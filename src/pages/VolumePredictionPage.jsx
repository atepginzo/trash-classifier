import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { volumeService } from '../services/volumeService';
import { tpsService } from '../services/tpsService';
import Navbar from '../components/Navbar';

const BULAN_LABEL = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export default function VolumePredictionPage() {
  const [searchParams] = useSearchParams();
  const initialTpsId = searchParams.get('tpsId') || '';

  const [tpsId, setTpsId] = useState(initialTpsId);
  const [tpsList, setTpsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTps, setLoadingTps] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Fetch daftar TPS saat mount
  useEffect(() => {
    async function fetchTpsList() {
      try {
        setLoadingTps(true);
        const res = await tpsService.getAll({ limit: 500 });
        setTpsList(res?.data || []);
      } catch {
        setTpsList([]);
      } finally {
        setLoadingTps(false);
      }
    }
    fetchTpsList();
  }, []);

  // Auto-predict jika tpsId dari URL
  useEffect(() => {
    if (initialTpsId) {
      handlePredict(initialTpsId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTpsId]);

  async function handlePredict(targetTpsId) {
    const id = targetTpsId || tpsId;
    if (!id) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await volumeService.predictVolume(id);
      setResult(res?.data || res);
    } catch (err) {
      setError(err.message || 'Gagal memprediksi volume sampah.');
    } finally {
      setLoading(false);
    }
  }

  // Hitung max untuk skala bar chart
  const allVolumes = [
    ...(result?.history || []).map((h) => h.volume_ton),
    ...(result?.predictions || []).map((p) => p.volume_ton),
  ];
  const maxVol = Math.max(...allVolumes, 1);

  return (
    <>
      <Navbar />
      <div
        style={{ minHeight: '100vh', backgroundColor: '#F5F0E8' }}
        className="flex flex-col items-center px-4 pt-28 pb-16 md:pt-32 md:pb-24"
      >
        {/* Header */}
        <div className="text-center mb-8 max-w-lg">
          <h1
            style={{ fontFamily: 'var(--font-serif)', color: '#0F1A0A' }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            Prediksi Volume Sampah
          </h1>
          <p style={{ color: '#6B7160' }} className="text-base leading-relaxed">
            Prediksi volume sampah 3 bulan ke depan menggunakan AI (LSTM)
          </p>
        </div>

        {/* Card */}
        <div
          style={{ maxWidth: 700, backgroundColor: '#ffffff', borderRadius: 12 }}
          className="w-full p-5 md:p-8"
        >
          {/* TPS Selector */}
          <label
            style={{ color: '#3A3D35' }}
            className="block text-sm font-semibold mb-2"
          >
            Pilih TPS
          </label>
          <div className="relative mb-5">
            <select
              value={tpsId}
              onChange={(e) => setTpsId(e.target.value)}
              disabled={loadingTps || loading}
              style={{
                backgroundColor: '#fafaf7',
                border: '1.5px solid #c5c5b8',
                borderRadius: 8,
                color: '#3A3D35',
                cursor: loadingTps ? 'wait' : 'pointer',
              }}
              className="w-full py-3 px-4 pr-10 text-sm appearance-none"
            >
              <option value="">
                {loadingTps ? 'Memuat daftar TPS...' : '— Pilih TPS —'}
              </option>
              {tpsList.map((tps) => (
                <option key={tps.id} value={tps.id}>
                  {tps.nama_desa} — Kec. {tps.kecamatan} ({tps.area_type})
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7160',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Predict Button */}
          <button
            onClick={() => handlePredict()}
            disabled={!tpsId || loading}
            style={{
              backgroundColor: tpsId && !loading ? '#1a3d1a' : '#b0b0a8',
              color: '#ffffff',
              borderRadius: 999,
              border: 'none',
              cursor: tpsId && !loading ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s ease',
            }}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold mb-6"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Memprediksi...
              </>
            ) : (
              <>
                <TrendingUp size={16} />
                Prediksi Volume
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #f5c6c6',
                borderRadius: 8,
              }}
              className="flex items-start gap-3 p-4 mb-5"
            >
              <AlertCircle
                size={18}
                style={{ color: '#a32d2d', flexShrink: 0, marginTop: 2 }}
              />
              <p style={{ color: '#7f1d1d' }} className="text-sm flex-1">
                {error}
              </p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div>
              {/* TPS Info */}
              <div
                style={{
                  backgroundColor: '#f0f7f0',
                  borderRadius: 8,
                  borderLeft: '4px solid #2d6a2d',
                }}
                className="p-4 mb-6"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} style={{ color: '#2d6a2d' }} />
                  <span
                    style={{ color: '#2d6a2d' }}
                    className="text-sm font-semibold"
                  >
                    {result.tps?.nama_desa}
                  </span>
                </div>
                <p style={{ color: '#6B7160' }} className="text-xs">
                  Kec. {result.tps?.kecamatan} • {result.tps?.kabupaten} •{' '}
                  {result.tps?.area_type}
                </p>
                <p style={{ color: '#6B7160' }} className="text-xs mt-1">
                  Model: {result.model_used}
                </p>
              </div>

              {/* Bar Chart — History + Predictions */}
              <h3
                style={{ color: '#3A3D35' }}
                className="text-sm font-semibold mb-3 flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Riwayat & Prediksi Volume (ton/bulan)
              </h3>

              <div className="space-y-2 mb-6">
                {/* History bars */}
                {(result.history || []).map((h, i) => (
                  <div key={`h-${i}`} className="flex items-center gap-3">
                    <span
                      style={{ color: '#6B7160', minWidth: 60 }}
                      className="text-xs text-right"
                    >
                      <Calendar size={10} className="inline mr-1" />
                      {BULAN_LABEL[h.bulan - 1]} {h.tahun}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 20,
                        backgroundColor: '#f0ebe3',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(h.volume_ton / maxVol) * 100}%`,
                          height: '100%',
                          backgroundColor: '#7fa67f',
                          borderRadius: 4,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <span
                      style={{ color: '#3A3D35', minWidth: 50 }}
                      className="text-xs font-medium text-right"
                    >
                      {h.volume_ton.toFixed(1)}
                    </span>
                  </div>
                ))}

                {/* Divider */}
                <div className="flex items-center gap-2 py-1">
                  <div
                    style={{ flex: 1, height: 1, backgroundColor: '#e0ddd5' }}
                  />
                  <span
                    style={{ color: '#1a3d1a' }}
                    className="text-xs font-semibold"
                  >
                    ▼ PREDIKSI
                  </span>
                  <div
                    style={{ flex: 1, height: 1, backgroundColor: '#e0ddd5' }}
                  />
                </div>

                {/* Prediction bars */}
                {(result.predictions || []).map((p, i) => {
                  const lastHistory = result.history?.[result.history.length - 1];
                  const predMonth = lastHistory
                    ? ((lastHistory.bulan + i) % 12) + 1
                    : i + 1;
                  const predYear = lastHistory
                    ? lastHistory.tahun +
                      Math.floor((lastHistory.bulan + i) / 12)
                    : new Date().getFullYear();

                  return (
                    <div key={`p-${i}`} className="flex items-center gap-3">
                      <span
                        style={{ color: '#1a3d1a', minWidth: 60 }}
                        className="text-xs text-right font-semibold"
                      >
                        <TrendingUp size={10} className="inline mr-1" />
                        {BULAN_LABEL[predMonth - 1]} {predYear}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 20,
                          backgroundColor: '#f0ebe3',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${(p.volume_ton / maxVol) * 100}%`,
                            height: '100%',
                            background:
                              'linear-gradient(90deg, #1a3d1a 0%, #2d6a2d 100%)',
                            borderRadius: 4,
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                      <span
                        style={{ color: '#1a3d1a', minWidth: 50 }}
                        className="text-xs font-bold text-right"
                      >
                        {p.volume_ton.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
