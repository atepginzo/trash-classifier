const axios = require('axios');

const CAPACITY_TON = { "URBAN": 20.0, "SEMI_URBAN": 10.0, "RURAL": 4.0 };

// Jumlah TPS per area — digunakan untuk membagi volume area aggregate ke per-TPS
const TPS_COUNT_PER_AREA = { "URBAN": 24, "SEMI_URBAN": 30, "RURAL": 24 };

const predictVolume = async (req, res, next) => {
    try {
        const { tpsId } = req.params;
        
        const pythonResponse = await axios.post('http://localhost:8000/predict-volume/', { tps_id: tpsId });
        const pyData = pythonResponse.data.data || pythonResponse.data;

        const tpsObj = pyData.tps || { id: tpsId, area_type: 'RURAL' };
        const areaType = tpsObj.area_type || "RURAL";
        
        // UNIT CONTRACT — semua dalam Kg
        const capacityKg = (tpsObj.kapasitas_ton || CAPACITY_TON[areaType] || 4.0) * 1000;
        const tpsCount = TPS_COUNT_PER_AREA[areaType] || 24;

        const rawHistory = pyData.history_12 || [];
        const predictions = pyData.predictions || [];

        // Ambil volume bulan terakhir dari history (area aggregate, dalam Ton)
        const lastEntry = rawHistory.length > 0 ? rawHistory[rawHistory.length - 1] : null;
        const areaMonthlyTon = lastEntry ? Number(lastEntry.volume_ton) : 0;
        
        // Bagi dengan jumlah TPS di area → volume per-TPS (Ton)
        const perTpsMonthlyTon = areaMonthlyTon / tpsCount;
        const perTpsMonthlyKg = perTpsMonthlyTon * 1000;

        // --- VARIASI DETERMINISTIK per TPS ---
        const areaMultiplier = {
            'URBAN': 1.15, 'SEMI_URBAN': 1.00, 'RURAL': 0.72,
        }[areaType] ?? 1.00;

        let idHash = 0;
        const idStr = String(tpsId);
        for (let i = 0; i < idStr.length; i++) {
            idHash = (idHash << 5) - idHash + idStr.charCodeAt(i);
            idHash |= 0;
        }
        const idVariation = 0.85 + (Math.abs(idHash) % 100 / 100 * 0.30);

        // Daily rate per-TPS (Kg) — sudah bervariasi
        const dailyRateKg = (perTpsMonthlyKg / 30) * areaMultiplier * idVariation;
        
        // Total bulanan per-TPS (sama dengan nilai grafik bulan ini)
        const monthlyFillKg = perTpsMonthlyKg * areaMultiplier * idVariation;
        
        // Fill percentage — volume harian vs kapasitas harian
        const currentFillKg = Math.min(dailyRateKg, capacityKg);
        const fillPercentage = capacityKg > 0 ? (currentFillKg / capacityKg) * 100 : 0;
        
        const status = fillPercentage >= 90 ? 'KRITIS'
                     : fillPercentage >= 70 ? 'TINGGI'
                     : fillPercentage >= 40 ? 'SEDANG'
                     : 'NORMAL';

        const remainingKg = Math.max(0, capacityKg - currentFillKg);
        const daysToFull = dailyRateKg > 0 ? Math.ceil(remainingKg / dailyRateKg) : 999;

        const fullDateObj = new Date();
        fullDateObj.setDate(fullDateObj.getDate() + daysToFull);
        const fullDateStr = fullDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        // --- KOMPOSISI SAMPAH BERVARIASI per TPS ---
        // Gunakan hash kedua (shift idHash) untuk variasi komposisi
        const compSeed = Math.abs((idHash * 7 + 13) | 0) % 100 / 100; // 0.00 - 0.99
        const organikPct  = 50 + (compSeed * 15);        // 50% - 65%
        const b3Pct       = 3 + ((1 - compSeed) * 7);    // 3% - 10%  (inverse: urban/padat → B3 lebih tinggi)
        const anorganikPct = 100 - organikPct - b3Pct;   // sisa, ~25% - 47%

        // Injeksi properti ke tpsObj
        // total_kg = volume bulanan per-TPS (konsisten dengan grafik bulan ini)
        tpsObj.kapasitas_ton = capacityKg / 1000;
        tpsObj.kapasitas_kg = Math.round(capacityKg);
        tpsObj.total_kg = Math.round(monthlyFillKg);
        tpsObj.fill_pct = Math.round(fillPercentage * 10) / 10;
        tpsObj.alert = status;
        tpsObj.daily_rate = Math.round(dailyRateKg);
        tpsObj.remaining_kg = Math.round(remainingKg);
        tpsObj.days_to_full = daysToFull;
        tpsObj.full_date = fullDateStr;
        tpsObj.by_type = {
            organik:   { kg: Math.round(monthlyFillKg * organikPct / 100) },
            anorganik: { kg: Math.round(monthlyFillKg * anorganikPct / 100) },
            b3:        { kg: Math.round(monthlyFillKg * b3Pct / 100) }
        };
        tpsObj.organik_pct   = Math.round(organikPct * 10) / 10;
        tpsObj.anorganik_pct = Math.round(anorganikPct * 10) / 10;
        tpsObj.b3_pct        = Math.round(b3Pct * 10) / 10;

        // History & predictions — konversi ke per-TPS (Ton) dengan variasi yang sama
        const variationFactor = areaMultiplier * idVariation;
        const mappedHistory = rawHistory.map(item => ({
            tahun: Number(item.tahun),
            bulan: Number(item.bulan),
            volume_ton: Number((Number(item.volume_ton) / tpsCount * variationFactor).toFixed(2))
        }));

        const mappedPredictions = predictions.map((item, index) => ({
            bulan_ke: index + 1,
            volume_ton: Number((Number(item.volume_ton) / tpsCount * variationFactor).toFixed(2))
        }));

        return res.status(200).json({
            status: 'success',
            data: {
                tps: tpsObj,
                history: mappedHistory,
                predictions: mappedPredictions,
                isDailyAverage: false
            }
        });

    } catch (error) {
        console.error("Error FastAPI:", error?.response?.data || error.message);
        return res.status(500).json({ status: 'error', message: 'Gagal memuat data prediksi' });
    }
};

module.exports = { predictVolume };