import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Loader2, TrendingUp, MapPin, Navigation, Building2, Trees, Landmark,
  ChevronRight, ChevronDown, BarChart3, AlertCircle, Navigation2, XCircle,
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
  RURAL: { label: 'Pedesaan', bg: '#e8f5e9', color: '#2e7d32', Icon: Trees },
};

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

// ── Helper: fly map to marker ────────────────────────────────────────────────
function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 14, { duration: 1.2 }); }, [center, map]);
  return null;
}

// ── Helper: Route Layer Component ────────────────────────────────────────────
function RouteLayer({ routeGeoJSON }) {
  if (!routeGeoJSON) return null;
  
  const routeStyle = {
    color: '#2563eb',
    weight: 5,
    opacity: 0.8,
    lineJoin: 'round',
    lineCap: 'round',
  };

  return <GeoJSON data={routeGeoJSON} style={routeStyle} />;
}

// ── Helper: User Location Marker ─────────────────────────────────────────────
function UserLocationMarker({ position }) {
  if (!position) return null;

  const userIcon = new L.DivIcon({
    className: '',
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:#ef4444;border:3px solid #fff;
      box-shadow:0 0 12px rgba(239,68,68,0.8);
      display:flex;align-items:center;justify-content:center;
    "><div style="width:8px;height:8px;border-radius:50%;background:#fff;animation:pulse 2s infinite;"></div></div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
    </style>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <strong>Lokasi Anda</strong>
      </Popup>
    </Marker>
  );
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

  // Navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // { distance, duration }
  const [userLocation, setUserLocation] = useState(null);
  const [navLoading, setNavLoading] = useState(false);
  const [navError, setNavError] = useState(null);

  const sidebarRef = useRef(null);

  // ── Load all TPS on mount ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await tpsService.getAll({ limit: 500 });
        setAllTps(res?.data?.data?.tps || res?.data?.tps || res?.data || []);
      } catch { setAllTps([]); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  // ── Handle marker click ────────────────────────────────────────────────────
  async function handleMarkerClick(tps) {
    setSelectedTps(tps);
    setSidebarOpen(true);
    setFlyCenter([Number(tps.lat), Number(tps.lon)]);
    setVolResult(null);
    setVolError(null);
    setVolLoading(true);

    try {
      const res = await volumeService.predictVolume(tps.id);
      setVolResult(res?.data?.data || res?.data || res);
    } catch (err) {
      setVolError(err.message || 'Gagal memprediksi volume');
    } finally {
      setVolLoading(false);
    }
  }

  // Collapse/hide panel only — preserves selectedTps, volResult, and active navigation
  function collapsePanel() {
    setSidebarOpen(false);
  }

  // Full close: clear everything including navigation
  function closeSidebar() {
    setSidebarOpen(false);
    setSelectedTps(null);
    setVolResult(null);
    setVolError(null);
    stopNavigation();
  }

  // ── Navigation Functions ───────────────────────────────────────────────────
  async function startNavigation() {
    if (!selectedTps) return;

    setNavLoading(true);
    setNavError(null);

    try {
      // Get user location
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation tidak didukung browser Anda'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      setUserLocation([userLat, userLon]);

      // Call OSRM API
      const tpsLat = Number(selectedTps.lat);
      const tpsLon = Number(selectedTps.lon);
      
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${tpsLon},${tpsLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(osrmUrl);
      if (!response.ok) throw new Error('Gagal mendapatkan rute dari OSRM');
      
      const data = await response.json();
      
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('Tidak dapat menemukan rute ke TPS ini');
      }

      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMin = Math.round(route.duration / 60);

      // Set route data
      setRouteGeoJSON(route.geometry);
      setRouteInfo({ distance: distanceKm, duration: durationMin });
      setIsNavigating(true);

      // Auto-collapse panel on mobile so user can see the route
      setSidebarOpen(false);

      // Fly to show full route
      setFlyCenter([userLat, userLon]);

    } catch (error) {
      console.error('Navigation error:', error);
      setNavError(error.message || 'Gagal memulai navigasi');
    } finally {
      setNavLoading(false);
    }
  }

  function stopNavigation() {
    setIsNavigating(false);
    setRouteGeoJSON(null);
    setRouteInfo(null);
    setUserLocation(null);
    setNavError(null);
  }

  async function handleLocateMe() {
    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation tidak didukung browser Anda'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      
      setUserLocation([userLat, userLon]);
      setFlyCenter([userLat, userLon]);
    } catch (err) {
      console.error('Gagal mendapatkan lokasi:', err);
      alert('Gagal mendapatkan lokasi Anda. Pastikan izin lokasi (GPS) diaktifkan di browser.');
    }
  }

  // ── Gabungkan 4 history terakhir + 3 prediksi menjadi 7 bar chart ────────
  const recentHistory = (volResult?.history || []).slice(-4);
  const predictions = volResult?.predictions || [];

  const lastH = recentHistory.length > 0 ? recentHistory[recentHistory.length - 1] : null;
  const chartData = [
    ...recentHistory.map((h, i) => ({
      label: BULAN[h.bulan - 1],
      volume_ton: h.volume_ton,
      type: i < recentHistory.length - 1 ? 'past' : 'current'
    })),
    ...predictions.map((p, i) => {
      const pm = lastH ? ((lastH.bulan + i) % 12) + 1 : i + 1;
      return {
        label: BULAN[pm - 1],
        volume_ton: p.volume_ton,
        type: 'prediction'
      };
    })
  ];
  const maxVol = Math.max(...chartData.map(d => d.volume_ton), 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="fixed top-16 left-0 right-0 bottom-0 flex overflow-hidden">
        {/* ══════════ LEFT: MAP ══════════ */}
        <div 
          className={`relative transition-all duration-300 ${
            sidebarOpen ? 'hidden md:block md:flex-[0_0_60%] lg:flex-[0_0_65%]' : 'flex-1'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-black transition-colors duration-300">
              <Loader2 size={36} className="text-emerald-600 dark:text-emerald-400 animate-spin" />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Memuat peta TPS...</p>
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
              
              {/* Route Layer */}
              {isNavigating && routeGeoJSON && <RouteLayer routeGeoJSON={routeGeoJSON} />}
              
              {/* User Location Marker */}
              {userLocation && <UserLocationMarker position={userLocation} />}
              
              {allTps.filter(tps => tps.lat != null && tps.lon != null).map(tps => (
                <Marker
                  key={tps.id}
                  position={[Number(tps.lat), Number(tps.lon)]}
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

              {/* Locate Me Floating Button */}
              <div className="absolute bottom-6 right-6 z-[1000] flex flex-col items-center gap-2">
                <button 
                  onClick={handleLocateMe}
                  title="Lokasi Saya"
                  className="relative group bg-red-500 dark:bg-red-600 text-white p-3.5 rounded-full shadow-[0_4px_12px_rgba(239,68,68,0.4)] hover:bg-red-600 dark:hover:bg-red-500 hover:scale-110 hover:-translate-y-1 transition-all duration-300 border-2 border-white dark:border-slate-800"
                >
                  <MapPin size={24} className="animate-bounce" style={{ animationDuration: '2s' }} />
                  <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30"></span>
                  <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                    Lokasi Saya
                  </span>
                </button>
              </div>
            </MapContainer>
          )}

          {/* Legend */}
          <div className="absolute bottom-5 left-5 z-[1000] bg-white/95 dark:bg-black/90 rounded-xl px-4 py-3 shadow-md text-xs border border-transparent dark:border-white/10 transition-colors duration-300">
            <div className="font-bold mb-2 text-slate-900 dark:text-white transition-colors duration-300">
              {allTps.length} TPS di Bandung Raya
            </div>
            {Object.entries(AREA_META).map(([key, m]) => (
              <div key={key} className="flex items-center gap-2 mb-1">
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  backgroundColor: m.color, border: '2px solid #fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
                <span className="text-slate-700 dark:text-slate-300 transition-colors duration-300">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Hint if sidebar closed */}
          {!sidebarOpen && !loading && !selectedTps && (
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

          {/* Re-open panel button when panel is collapsed but TPS is selected */}
          {!sidebarOpen && selectedTps && !loading && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-5 right-5 z-[1000] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 flex items-center gap-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95"
            >
              <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
              {selectedTps.nama_desa || selectedTps.id}
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          )}

          {/* Navigation Panel (Floating at bottom) */}
          {isNavigating && routeInfo && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] w-[95%] sm:w-[90%] max-w-lg px-2">
              <div className="bg-slate-900/98 dark:bg-slate-950/98 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-4 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  {/* Route Info */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Navigation2 size={20} className="text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xl sm:text-2xl font-extrabold text-white leading-none mb-1">
                          {routeInfo.distance} <span className="text-sm font-semibold">km</span>
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Jarak</div>
                      </div>
                    </div>
                    <div className="h-10 sm:h-12 w-px bg-white/30 shrink-0" />
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white leading-none mb-1">
                        {routeInfo.duration} <span className="text-sm font-semibold">mnt</span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-300 font-medium">Estimasi</div>
                    </div>
                  </div>

                  {/* Stop Button */}
                  <button
                    onClick={stopNavigation}
                    className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full
                               bg-red-600 hover:bg-red-700 active:bg-red-800 text-white
                               transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 shrink-0"
                    title="Hentikan Navigasi"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                {/* Route Status */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="text-[11px] sm:text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">Rute Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══════════ RIGHT: SIDEBAR ══════════ */}
        <div
          ref={sidebarRef}
          className={`flex flex-col overflow-hidden bg-white dark:bg-[#0a0a0a] transition-all duration-300 
            ${sidebarOpen ? 'w-full md:w-[40%] lg:w-[35%] md:min-w-[360px] lg:min-w-[400px] border-l border-slate-200 dark:border-white/5' : 'w-0 min-w-0'}`}
        >
          {sidebarOpen && selectedTps && (
            <div className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6 scrollbar-thin">
              {/* Collapse panel button — does NOT stop navigation */}
              <button
                onClick={collapsePanel}
                className="float-right bg-transparent border-none cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
                title="Tutup panel"
              >
                {/* ChevronRight on desktop, ChevronDown on mobile */}
                <ChevronRight size={20} className="hidden md:block" />
                <ChevronDown size={20} className="block md:hidden" />
              </button>

              {/* TPS Header */}
              <div className="mb-4">
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
                <h2 className="font-sans text-xl md:text-[22px] font-bold text-slate-900 dark:text-white mt-2 mb-1 tracking-tight transition-colors duration-300">
                  {selectedTps.nama_desa}
                </h2>
                <p className="text-xs md:text-[13px] text-slate-500 dark:text-slate-400 transition-colors duration-300">
                  {selectedTps.kecamatan} • {selectedTps.kabupaten}
                </p>
              </div>

              {/* Kapasitas Terpakai Progress Bar — Ambil dari backend tps.fill_pct */}
              {volResult && (() => {
                const tpsData = volResult.tps || {};
                const persenTerpakai = tpsData.fill_pct || 0;
                
                return (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Kapasitas Terpakai</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{persenTerpakai.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${persenTerpakai}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          persenTerpakai >= 90 ? 'bg-red-500' : 
                          persenTerpakai >= 70 ? 'bg-orange-500' : 
                          'bg-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Stats Grid 2x2 — Ambil dari backend tps.total_kg, tps.daily_rate, tps.by_type */}
              {volResult && (() => {
                const tpsData = volResult.tps || {};
                const totalKg = tpsData.total_kg || 0;
                const ratePerHari = tpsData.daily_rate || 0;
                const organikKg = tpsData.by_type?.organik?.kg || 0;
                const anorganikKg = tpsData.by_type?.anorganik?.kg || 0;
                
                return (
                  <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 md:p-4 border border-slate-200 dark:border-white/5">
                      <div className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                        {(totalKg / 1000).toFixed(1)}k
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Total (kg)</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 md:p-4 border border-slate-200 dark:border-white/5">
                      <div className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mb-1">
                        {(ratePerHari / 1000).toFixed(1)}k
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Rate/hari (kg)</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 md:p-4 border border-slate-200 dark:border-white/5">
                      <div className="text-xl md:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
                        {(organikKg / 1000).toFixed(1)}k
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Organik (kg)</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-3 md:p-4 border border-slate-200 dark:border-white/5">
                      <div className="text-xl md:text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">
                        {(anorganikKg / 1000).toFixed(1)}k
                      </div>
                      <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Anorganik (kg)</div>
                    </div>
                  </div>
                );
              })()}

              {/* Komposisi Sampah — Pie Chart */}
              {volResult && (() => {
                const tpsData = volResult.tps || {};
                const organikKg = tpsData.by_type?.organik?.kg || 0;
                const anorganikKg = tpsData.by_type?.anorganik?.kg || 0;
                const b3Kg = tpsData.by_type?.b3?.kg || 0;
                const totalKg = organikKg + anorganikKg + b3Kg;
                
                const orgPct = totalKg > 0 ? ((organikKg / totalKg) * 100).toFixed(1) : 0;
                const anorgPct = totalKg > 0 ? ((anorganikKg / totalKg) * 100).toFixed(1) : 0;
                const b3Pct = totalKg > 0 ? ((b3Kg / totalKg) * 100).toFixed(1) : 0;

                const orgAngle = (organikKg / totalKg) * 360;
                const anorgAngle = (anorganikKg / totalKg) * 360;
                const orgEnd = orgAngle;
                const anorgEnd = orgAngle + anorgAngle;

                return (
                  <div className="mb-4">
                    <h3 className="flex items-center gap-2 text-sm md:text-[14px] font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                      <BarChart3 size={16} className="text-slate-600 dark:text-slate-400" />
                      Komposisi Sampah
                    </h3>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-white/5">
                      <div className="flex items-center gap-4">
                        {/* Donut Chart */}
                        <div className="relative shrink-0" style={{ width: '90px', height: '90px' }}>
                          <div 
                            className="w-full h-full rounded-full"
                            style={{
                              background: `conic-gradient(
                                #10b981 0deg ${orgEnd}deg,
                                #3b82f6 ${orgEnd}deg ${anorgEnd}deg,
                                #ef4444 ${anorgEnd}deg 360deg
                              )`
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[52px] h-[52px] rounded-full bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center transition-colors duration-300">
                              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                {(totalKg / 1000).toFixed(1)}k
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Legend Items */}
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400">Organik</span>
                            </div>
                            <span className="text-[11px] md:text-xs font-bold text-slate-800 dark:text-slate-200">{orgPct}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                              <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400">Anorganik</span>
                            </div>
                            <span className="text-[11px] md:text-xs font-bold text-slate-800 dark:text-slate-200">{anorgPct}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                              <span className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400">B3</span>
                            </div>
                            <span className="text-[11px] md:text-xs font-bold text-slate-800 dark:text-slate-200">{b3Pct}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <hr className="border-none border-t border-slate-200 dark:border-white/10 my-4 transition-colors duration-300" />

              {/* Prediksi Kapasitas Section */}
              {volResult && (
                <>
                  <div className="mb-4">
                    <h3 className="flex items-center gap-2 text-sm md:text-[14px] font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                      <BarChart3 size={16} className="text-slate-600 dark:text-slate-400" />
                      Prediksi Kapasitas
                    </h3>

                    {(() => {
                      const tpsData = volResult.tps || {};
                      const ratePerHari = tpsData.daily_rate || 0;
                      const sisaKapasitasKg = tpsData.remaining_kg ?? Math.max(0, (tpsData.kapasitas_kg || 0) - ratePerHari);
                      const daysToFull = tpsData.days_to_full || 0;
                      const fullDate = tpsData.full_date || '';
                      const b3Pct = tpsData.b3_pct || 0;
                      const alertStatus = tpsData.alert || 'NORMAL';
                      
                      const isKritis = alertStatus === 'KRITIS';
                      const isPerhatian = alertStatus === 'TINGGI';

                      return (
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-white/5 space-y-2.5">
                          {/* Rate pengisian */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Rate pengisian</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {(ratePerHari / 1000).toFixed(1)}k kg/hari
                            </span>
                          </div>
                          
                          {/* Sisa kapasitas */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Sisa kapasitas</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {(sisaKapasitasKg / 1000).toFixed(1)}k kg
                            </span>
                          </div>
                          
                          {/* Estimasi penuh */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Estimasi penuh</span>
                            <span className={`font-bold ${
                              isKritis ? 'text-red-600 dark:text-red-400' : 
                              isPerhatian ? 'text-orange-600 dark:text-orange-400' : 
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {daysToFull > 0 
                                ? `${daysToFull} hari (${fullDate})`
                                : '∞ hari'}
                            </span>
                          </div>
                          
                          {/* B3 dari total */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">B3 dari total</span>
                            <span className={`font-bold ${
                              b3Pct > 15 ? 'text-red-600 dark:text-red-400' : 
                              b3Pct > 10 ? 'text-orange-600 dark:text-orange-400' : 
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {b3Pct}% dari total
                            </span>
                          </div>
                          
                          {/* Status badge */}
                          {isKritis && (
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded-lg mt-2">
                              <AlertCircle size={12} />
                              <span>KRITIS — Segera tindak lanjut!</span>
                            </div>
                          )}
                          {isPerhatian && (
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-1.5 rounded-lg mt-2">
                              <AlertCircle size={12} />
                              <span>TINGGI — Perlu perhatian</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <hr className="border-none border-t border-slate-200 dark:border-white/10 my-4 transition-colors duration-300" />
                </>
              )}

              {/* Navigation Section */}
              <div className="mb-5">
                <h3 className="flex items-center gap-2 text-[14px] font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                  <Navigation2 size={16} className="text-blue-600 dark:text-blue-400" />
                  Navigasi ke TPS
                </h3>

                {/* Navigation Error */}
                {navError && (
                  <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3 mb-3 transition-colors duration-300">
                    <AlertCircle size={16} className="text-red-700 dark:text-red-400 mt-0.5 shrink-0" />
                    <p className="text-[13px] text-red-800 dark:text-red-300 m-0" style={{color: 'inherit'}}>{navError}</p>
                  </div>
                )}

                {!isNavigating ? (
                  <button
                    onClick={startNavigation}
                    disabled={navLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5
                               bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                               text-white font-semibold text-sm rounded-xl
                               transition-all duration-200 shadow-md hover:shadow-lg
                               disabled:cursor-not-allowed active:scale-95"
                  >
                    {navLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Mendapatkan lokasi...</span>
                      </>
                    ) : (
                      <>
                        <Navigation2 size={18} />
                        <span>Navigasi ke sini</span>
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    {/* Route Info Card */}
                    {routeInfo && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 mb-3 transition-colors duration-300">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <div className="text-[11px] text-blue-700 dark:text-blue-300 font-bold mb-1 uppercase tracking-wider">Jarak</div>
                            <div className="text-2xl font-extrabold text-blue-800 dark:text-blue-200">
                              {routeInfo.distance} <span className="text-sm font-semibold">km</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] text-blue-700 dark:text-blue-300 font-bold mb-1 uppercase tracking-wider">Estimasi</div>
                            <div className="text-2xl font-extrabold text-blue-800 dark:text-blue-200">
                              {routeInfo.duration} <span className="text-sm font-semibold">mnt</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-1.5 font-medium">
                          <MapPin size={11} />
                          <span>Rute ditampilkan di peta</span>
                        </div>
                      </div>
                    )}

                    {/* Stop Navigation Button */}
                    <button
                      onClick={stopNavigation}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5
                                 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl
                                 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    >
                      <XCircle size={18} />
                      <span>Hentikan Navigasi</span>
                    </button>
                  </>
                )}
              </div>

              <hr className="border-none border-t border-slate-200 dark:border-white/10 my-5 transition-colors duration-300" />

              {/* Loading */}
              {volLoading && (
                <div className="flex flex-col items-center py-10">
                  <div className="w-9 h-9 border-[3px] border-slate-200 dark:border-white/10 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin" />
                  <p className="mt-3 text-xs md:text-[13px] text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    Menjalankan model LSTM...
                  </p>
                </div>
              )}

              {/* Error */}
              {volError && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-3 mb-4 transition-colors duration-300">
                  <AlertCircle size={16} className="text-red-700 dark:text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs md:text-[13px] text-red-800 dark:text-red-300 m-0">{volError}</p>
                </div>
              )}

              {/* Unified 7-Bar Chart Card */}
              {volResult && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3 md:p-4 mb-4 transition-colors duration-300">
                  {/* Header with badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold text-xs md:text-sm">
                      <BarChart3 size={14} />
                      <span>Prediksi Volume Sampah</span>
                    </div>
                    <span className="bg-blue-600 dark:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      LSTM Model
                    </span>
                  </div>
                    
                  <p className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 mb-3">
                    Prediksi LSTM 3 bulan ke depan
                  </p>

                  {/* 3 Prediction Cards */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {(volResult.predictions || []).map((pred, i) => {
                      const lh = volResult.history?.[volResult.history.length - 1];
                      const predMonth = lh ? ((lh.bulan + i) % 12) + 1 : i + 1;
                      const predYear = lh ? lh.tahun + Math.floor((lh.bulan + i) / 12) : 2026;
                      return (
                        <div key={i} className="bg-white dark:bg-blue-900/30 rounded-lg p-2 md:p-3 text-center border border-blue-200 dark:border-blue-700/50 transition-colors duration-300">
                          <div className="text-[10px] md:text-[11px] text-blue-600 dark:text-blue-400 mb-1 font-medium">
                            {BULAN[predMonth - 1]} {predYear}
                          </div>
                          <div className="text-lg md:text-xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                            {pred.volume_ton.toFixed(1)}
                          </div>
                          <div className="text-[9px] md:text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">ton</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-medium mb-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-slate-400 dark:bg-slate-500 rounded-sm" />
                      <span className="text-blue-600 dark:text-blue-400">Histori</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-sm" />
                      <span className="text-blue-600 dark:text-blue-400">Bulan ini</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-blue-500 dark:bg-blue-400 rounded-sm" />
                      <span className="text-blue-600 dark:text-blue-400">Prediksi</span>
                    </div>
                  </div>

                  {/* 7-Bar Chart */}
                  <div className="border-t border-blue-200 dark:border-blue-700/50 pt-3">
                    <div className="flex items-end justify-between gap-1.5" style={{ height: '120px' }}>
                      {chartData.map((d, i) => {
                        const barColor = d.type === 'past'
                          ? 'bg-slate-300 dark:bg-slate-600'
                          : d.type === 'current'
                          ? 'bg-emerald-500 dark:bg-emerald-400'
                          : 'bg-blue-500 dark:bg-blue-400';
                        const pct = maxVol > 0 ? (d.volume_ton / maxVol) * 100 : 0;
                        const barHeight = Math.max(pct, 4);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                            <span className="text-[7px] md:text-[8px] font-bold text-slate-600 dark:text-slate-300 mb-0.5">
                              {d.volume_ton.toFixed(1)}
                            </span>
                            <div 
                              style={{ height: `${barHeight}%` }}
                              className={`w-full max-w-[28px] ${barColor} rounded-t transition-all duration-500`}
                            />
                            <span className={`text-[7px] md:text-[8px] mt-1 font-medium ${
                              d.type === 'current' 
                                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                                : d.type === 'prediction'
                                ? 'text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {d.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
