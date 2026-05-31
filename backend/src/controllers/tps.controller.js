const axios = require('axios');

const CAPACITY_TON = { "URBAN": 20.0, "SEMI_URBAN": 10.0, "RURAL": 4.0 };
const TPS_COUNT_PER_AREA = { "URBAN": 24, "SEMI_URBAN": 30, "RURAL": 24 };

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const getNearestTps = async (req, res, next) => {
    try {
        const { lat, lon, limit = 100 } = req.query; 

        const pythonResponse = await axios.get('http://localhost:8000/api/tps');
        const allTps = pythonResponse.data.data || pythonResponse.data || [];

        const mappedTps = allTps.map(tps => {
            const areaType = tps.area_type || "RURAL";
            const capacityKg = (tps.kapasitas_ton || CAPACITY_TON[areaType] || 4.0) * 1000;
            const tpsCount = TPS_COUNT_PER_AREA[areaType] || 24;
            
            // Fallback: volume area aggregate (Ton) jika tidak ada dari Python
            const areaMonthlyTon = tps.last_volume_ton || tps.volume_ton 
                || (areaType === 'URBAN' ? 550.0 : areaType === 'SEMI_URBAN' ? 220.0 : 355.0);
            
            // Bagi area aggregate → per-TPS
            const perTpsMonthlyKg = (areaMonthlyTon / tpsCount) * 1000;
            
            // --- VARIASI DETERMINISTIK ---
            const areaMultiplier = {
                'URBAN': 1.15, 'SEMI_URBAN': 1.00, 'RURAL': 0.72,
            }[areaType] ?? 1.00;

            let idHash = 0;
            const idStr = String(tps.id || tps.tps_id || '0');
            for (let i = 0; i < idStr.length; i++) {
                idHash = (idHash << 5) - idHash + idStr.charCodeAt(i);
                idHash |= 0;
            }
            const idVariation = 0.85 + (Math.abs(idHash) % 100 / 100 * 0.30);

            const dailyRateKg = (perTpsMonthlyKg / 30) * areaMultiplier * idVariation;
            const monthlyFillKg = perTpsMonthlyKg * areaMultiplier * idVariation;
            const currentFillKg = Math.min(dailyRateKg, capacityKg);
            const fillPct = capacityKg > 0 ? (currentFillKg / capacityKg) * 100 : 0;
            
            const alert = fillPct >= 90 ? 'KRITIS'
                        : fillPct >= 70 ? 'TINGGI'
                        : fillPct >= 40 ? 'SEDANG'
                        : 'NORMAL';

            const remainingKg = Math.max(0, capacityKg - currentFillKg);
            const daysToFull = dailyRateKg > 0 ? Math.ceil(remainingKg / dailyRateKg) : 999;

            const fullDateObj = new Date();
            fullDateObj.setDate(fullDateObj.getDate() + daysToFull);
            const fullDateStr = fullDateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            // --- KOMPOSISI SAMPAH BERVARIASI per TPS ---
            const compSeed = Math.abs((idHash * 7 + 13) | 0) % 100 / 100;
            const organikPct  = 50 + (compSeed * 15);
            const b3Pct       = 3 + ((1 - compSeed) * 7);
            const anorganikPct = 100 - organikPct - b3Pct;

            const tpsResult = {
                ...tps,
                kapasitas_ton: capacityKg / 1000,
                kapasitas_kg: Math.round(capacityKg),
                total_kg: Math.round(monthlyFillKg),
                fill_pct: Math.round(fillPct * 10) / 10,
                alert: alert,
                daily_rate: Math.round(dailyRateKg),
                remaining_kg: Math.round(remainingKg),
                days_to_full: daysToFull,
                full_date: fullDateStr,
                by_type: {
                    organik:   { kg: Math.round(monthlyFillKg * organikPct / 100) },
                    anorganik: { kg: Math.round(monthlyFillKg * anorganikPct / 100) },
                    b3:        { kg: Math.round(monthlyFillKg * b3Pct / 100) }
                },
                organik_pct:   Math.round(organikPct * 10) / 10,
                anorganik_pct: Math.round(anorganikPct * 10) / 10,
                b3_pct:        Math.round(b3Pct * 10) / 10
            };

            if (lat && lon && tps.lat && tps.lon) {
                tpsResult.distance_km = calculateDistance(lat, lon, tps.lat, tps.lon);
            }

            return tpsResult;
        });

        if (lat && lon) {
            mappedTps.sort((a, b) => a.distance_km - b.distance_km);
        }

        const finalTps = limit ? mappedTps.slice(0, Number(limit)) : mappedTps;

        return res.status(200).json({
            status: 'success',
            data: {
                mode: 'nearest',
                tps: finalTps
            }
        });

    } catch (error) {
        console.error("Error TPS Controller:", error?.response?.data || error.message);
        return res.status(500).json({ status: 'error', message: 'Gagal memuat list TPS' });
    }
};

module.exports = { getNearestTps };