import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  X, Loader2, TrendingUp, MapPin, Navigation, Building2, Trees, Landmark,
  ChevronRight, BarChart3, AlertCircle,
} from 'lucide-react';
import { tpsService } from '../services/tpsService';
import { volumeService } from '../services/volumeService';
import Navbar from '../components/Navbar';

// ── Fix: Leaflet default marker icon path ────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Custom marker icons per area type ────────────────────────────────────────
function createIcon(color) {
  return new L.DivIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
    "><div style="width:8px;height:8px;border-radius:50%;background:#fff"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}
const ICONS = {
  URBAN: createIcon('#1565c0'),
  SEMI_URBAN: createIcon('#e65100'),
  RURAL: createIcon('#2e7d32'),
};

const AREA_META = {
  URBAN: { label: 'Urban', bg: '#e3f2fd', color: '#1565c0', Icon: Building2 },
  SEMI_URBAN: { label: 'Semi-Urban', bg: '#fff3e0', color: '#e65100', Icon: Landmark },
  RURAL: { label: 'Rural', bg: '#e8f5e9', color: '#2e7d32', Icon: Trees },
};

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ── Helper: fly map to marker ────────────────────────────────────────────────
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 14, { duration: 1.2 }); }, [center, map]);
  return null;
}

// ═════════════════════════════════════════════════════════════════════════════
export default function DashboardTpsPage() {
  const [allTps, setAllTps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTps, setSelectedTps] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flyCenter, setFlyCenter] = useState(null);

  // Volume prediction
  const [volLoading, setVolLoading] = useState(false);
  const [volResult, setVolResult] = useState(null);
  const [volError, setVolError] = useState(null);

  const sidebarRef = useRef(null);

  // ── Load all TPS on mount ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await tpsService.getAll({ limit: 500 });
        setAllTps(res?.data || []);
      } catch { setAllTps([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  // ── Handle marker click ────────────────────────────────────────────────────
  async function handleMarkerClick(tps) {
    setSelectedTps(tps);
    setSidebarOpen(true);
    setFlyCenter([tps.lat, tps.lon]);
    setVolResult(null);
    setVolError(null);
    setVolLoading(true);

    try {
      const res = await volumeService.predictVolume(tps.id);
      setVolResult(res?.data || res);
    } catch (err) {
      setVolError(err.message || 'Gagal memprediksi volume');
    } finally {
      setVolLoading(false);
    }
  }

  function closeSidebar() {
    setSidebarOpen(false);
    setSelectedTps(null);
    setVolResult(null);
    setVolError(null);
  }

  // ── Compute max volume for bar scaling ─────────────────────────────────────
  const allVols = [
    ...(volResult?.history || []).map(h => h.volume_ton),
    ...(volResult?.predictions || []).map(p => p.volume_ton),
  ];
  const maxVol = Math.max(...allVols, 1);

  return (
    <>
      <Navbar />
      <div style={{
        position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
        display: 'flex', overflow: 'hidden',
      }}>
        {/* ══════════ LEFT: MAP ══════════ */}
        <div style={{
          flex: sidebarOpen ? '0 0 65%' : '1',
          transition: 'flex 0.3s ease',
          position: 'relative',
        }}>
          {loading ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '100%', backgroundColor: '#F8FAFC',
            }}>
              <Loader2 size={36} style={{ color: '#059669' }} className="animate-spin" />
              <p style={{ color: '#64748B', marginTop: 16, fontSize: 14 }}>Memuat peta TPS...</p>
            </div>
          ) : (
            <MapContainer
              center={[-6.92, 107.61]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyTo center={flyCenter} />
              {allTps.map(tps => (
                <Marker
                  key={tps.id}
                  position={[tps.lat, tps.lon]}
                  icon={ICONS[tps.area_type] || ICONS.RURAL}
                  eventHandlers={{ click: () => handleMarkerClick(tps) }}
                >
                  <Popup>
                    <strong>{tps.nama_desa}</strong><br />
                    Kec. {tps.kecamatan}<br />
                    {tps.kapasitas_ton} ton
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 20, left: 20, zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 10,
            padding: '12px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            fontSize: 12,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: '#0F172A' }}>
              {allTps.length} TPS di Bandung Raya
            </div>
            {Object.entries(AREA_META).map(([key, m]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  backgroundColor: m.color, border: '2px solid #fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
                <span style={{ color: '#334155' }}>{m.label}</span>
              </div>
            ))}
          </div>

          {/* Hint if sidebar closed */}
          {!sidebarOpen && !loading && (
            <div style={{
              position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
              zIndex: 1000, backgroundColor: 'rgba(5,150,105,0.9)', color: '#fff',
              borderRadius: 999, padding: '10px 20px', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}>
              <MapPin size={14} /> Klik marker TPS untuk melihat prediksi volume
            </div>
          )}
        </div>

        {/* ══════════ RIGHT: SIDEBAR ══════════ */}
        <div
          ref={sidebarRef}
          style={{
            width: sidebarOpen ? '35%' : 0,
            minWidth: sidebarOpen ? 360 : 0,
            overflow: 'hidden',
            transition: 'width 0.3s ease, min-width 0.3s ease',
            backgroundColor: '#F8FAFC',
            borderLeft: sidebarOpen ? '1px solid #E2E8F0' : 'none',
            display: 'flex', flexDirection: 'column',
          }}
        >
          {sidebarOpen && selectedTps && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {/* Close button */}
              <button
                onClick={closeSidebar}
                style={{
                  float: 'right', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#64748B', padding: 4,
                }}
              >
                <X size={20} />
              </button>

              {/* TPS Header */}
              <div style={{ marginBottom: 20 }}>
                {(() => {
                  const meta = AREA_META[selectedTps.area_type] || AREA_META.RURAL;
                  const BadgeIcon = meta.Icon;
                  return (
                    <span style={{
                      backgroundColor: meta.bg, color: meta.color,
                      borderRadius: 999, fontSize: 11, fontWeight: 600,
                      padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <BadgeIcon size={11} /> {meta.label}
                    </span>
                  );
                })()}
                <h2 style={{
                  fontFamily: 'var(--font-sans)', color: '#0F172A',
                  fontSize: 22, fontWeight: 700, marginTop: 8, marginBottom: 4,
                }}>
                  {selectedTps.nama_desa}
                </h2>
                <p style={{ color: '#64748B', fontSize: 13 }}>
                  Kec. {selectedTps.kecamatan} • {selectedTps.kabupaten}
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginTop: 8, fontSize: 12, color: '#64748B',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Navigation size={12} />
                    {typeof selectedTps.lat === 'number' ? selectedTps.lat.toFixed(4) : selectedTps.lat},
                    {typeof selectedTps.lon === 'number' ? selectedTps.lon.toFixed(4) : selectedTps.lon}
                  </span>
                  <span>•</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>
                    {selectedTps.kapasitas_ton} ton
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '0 0 20px' }} />

              {/* Volume Prediction Section */}
              <h3 style={{
                fontSize: 14, fontWeight: 700, color: '#0F172A',
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
              }}>
                <TrendingUp size={16} style={{ color: '#059669' }} />
                Prediksi Volume Sampah (LSTM)
              </h3>

              {/* Loading */}
              {volLoading && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0',
                }}>
                  <div style={{
                    width: 36, height: 36, border: '3px solid #E2E8F0',
                    borderTopColor: '#059669', borderRadius: '50%',
                  }} className="animate-spin" />
                  <p style={{ color: '#64748B', fontSize: 13, marginTop: 12 }}>
                    Menjalankan model LSTM...
                  </p>
                </div>
              )}

              {/* Error */}
              {volError && (
                <div style={{
                  backgroundColor: '#fef2f2', border: '1px solid #f5c6c6',
                  borderRadius: 8, padding: 12, display: 'flex', alignItems: 'start', gap: 10,
                  marginBottom: 16,
                }}>
                  <AlertCircle size={16} style={{ color: '#a32d2d', marginTop: 2 }} />
                  <p style={{ color: '#7f1d1d', fontSize: 13 }}>{volError}</p>
                </div>
              )}

              {/* Prediction Cards */}
              {volResult && (
                <>
                  {/* 3 Prediction Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                    {(volResult.predictions || []).map((pred, i) => {
                      const lastH = volResult.history?.[volResult.history.length - 1];
                      const predMonth = lastH ? ((lastH.bulan + i) % 12) + 1 : i + 1;
                      const predYear = lastH ? lastH.tahun + Math.floor((lastH.bulan + i) / 12) : 2026;
                      return (
                        <div key={i} style={{
                          backgroundColor: '#ffffff', borderRadius: 10, padding: 14,
                          textAlign: 'center', border: '1px solid #E2E8F0',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}>
                          <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>
                            {BULAN[predMonth - 1]} {predYear}
                          </div>
                          <div style={{
                            fontSize: 20, fontWeight: 800, color: '#059669',
                            fontFamily: 'var(--font-mono, monospace)',
                          }}>
                            {pred.volume_ton.toFixed(1)}
                          </div>
                          <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>ton</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Model badge */}
                  <div style={{
                    backgroundColor: '#ECFDF5', borderRadius: 6,
                    padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 16,
                  }}>
                    <BarChart3 size={12} /> {volResult.model_used}
                  </div>

                  {/* History Bar Chart */}
                  <h4 style={{
                    fontSize: 12, fontWeight: 600, color: '#334155',
                    marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <BarChart3 size={13} /> Riwayat 12 Bulan (ton)
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                    {(volResult.history || []).map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ minWidth: 52, fontSize: 11, color: '#64748B', textAlign: 'right' }}>
                          {BULAN[h.bulan - 1]} {h.tahun}
                        </span>
                        <div style={{
                          flex: 1, height: 16, backgroundColor: '#F1F5F9',
                          borderRadius: 3, overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${(h.volume_ton / maxVol) * 100}%`,
                            height: '100%', backgroundColor: '#86EFAC',
                            borderRadius: 3, transition: 'width 0.4s ease',
                          }} />
                        </div>
                        <span style={{ minWidth: 40, fontSize: 11, fontWeight: 600, color: '#334155', textAlign: 'right' }}>
                          {h.volume_ton.toFixed(1)}
                        </span>
                      </div>
                    ))}

                    {/* Divider */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
                    }}>
                      <div style={{ flex: 1, height: 1, backgroundColor: '#CBD5E1' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#059669' }}>▼ PREDIKSI</span>
                      <div style={{ flex: 1, height: 1, backgroundColor: '#c5c5b8' }} />
                    </div>

                    {/* Prediction bars */}
                    {(volResult.predictions || []).map((p, i) => {
                      const lastH = volResult.history?.[volResult.history.length - 1];
                      const pm = lastH ? ((lastH.bulan + i) % 12) + 1 : i + 1;
                      const py = lastH ? lastH.tahun + Math.floor((lastH.bulan + i) / 12) : 2026;
                      return (
                        <div key={`p-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ minWidth: 52, fontSize: 11, fontWeight: 700, color: '#059669', textAlign: 'right' }}>
                            {BULAN[pm - 1]} {py}
                          </span>
                          <div style={{
                            flex: 1, height: 16, backgroundColor: '#f0ebe3',
                            borderRadius: 3, overflow: 'hidden',
                          }}>
                            <div style={{
                              width: `${(p.volume_ton / maxVol) * 100}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #059669 0%, #34D399 100%)',
                              borderRadius: 3, transition: 'width 0.4s ease',
                            }} />
                          </div>
                          <span style={{ minWidth: 40, fontSize: 11, fontWeight: 800, color: '#059669', textAlign: 'right' }}>
                            {p.volume_ton.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
