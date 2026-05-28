import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  X, Loader2, TrendingUp, MapPin, Navigation, Building2, Trees, Landmark,
  ChevronRight, BarChart3, AlertCircle, Navigation2, XCircle,
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
      width:20px;height:20px;border-radius:50%;
      background:#3b82f6;border:3px solid #fff;
      box-shadow:0 2px 8px rgba(59,130,246,0.5);
      display:flex;align-items:center;justify-content:center;
    "><div style="width:8px;height:8px;border-radius:50%;background:#fff;animation:pulse 2s infinite;"></div></div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
    </style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
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
    setFlyCenter([Number(tps.lat), Number(tps.lon)]);
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
    stopNavigation(); // Stop navigation when closing sidebar
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

  // ── Compute max volume for bar scaling ─────────────────────────────────────
  const allVols = [
    ...(volResult?.history || []).map(h => h.volume_ton),
    ...(volResult?.predictions || []).map(p => p.volume_ton),
  ];
  const maxVol = Math.max(...allVols, 1);

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
              {isNavigating && userLocation && <UserLocationMarker position={userLocation} />}
              
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
                    <span className="truncate">Rute aktif • Menuju {selectedTps?.nama_desa}</span>
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
              {/* Close button */}
              <button
                onClick={closeSidebar}
                className="float-right bg-transparent border-none cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 transition-colors duration-200"
              >
                <X size={20} />
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

              {/* Kapasitas Terpakai Progress Bar */}
              {volResult && (() => {
                const kapasitasKg = selectedTps.kapasitas_ton * 1000;
                const lastHistory = volResult.history?.[volResult.history.length - 1];
                const totalKg = lastHistory?.volume_ton * 1000 || 0;
                const persenTerpakai = Math.min((totalKg / kapasitasKg) * 100, 100);
                
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

              {/* Stats Grid 2x2 */}
              {volResult && (() => {
                const lastHistory = volResult.history?.[volResult.history.length - 1];
                const totalKg = lastHistory?.volume_ton * 1000 || 0;
                
                // Hitung rate per hari dari 3 bulan terakhir
                const recentHistory = volResult.history?.slice(-3) || [];
                const avgMonthlyKg = recentHistory.length > 0 
                  ? recentHistory.reduce((sum, h) => sum + (h.volume_ton * 1000), 0) / recentHistory.length 
                  : 0;
                const ratePerHari = avgMonthlyKg / 30;
                
                // Dummy data untuk organik/anorganik (bisa diganti dengan data real jika ada)
                const organikKg = totalKg * 0.6; // 60% organik
                const anorganikKg = totalKg * 0.4; // 40% anorganik
                
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
                      const kapasitasKg = selectedTps.kapasitas_ton * 1000;
                      const lastHistory = volResult.history?.[volResult.history.length - 1];
                      const totalKg = lastHistory?.volume_ton * 1000 || 0;
                      const sisaKapasitasKg = kapasitasKg - totalKg;
                      
                      // Hitung rate pengisian per hari (rata-rata 3 bulan terakhir)
                      const recentHistory = volResult.history?.slice(-3) || [];
                      const avgMonthlyKg = recentHistory.length > 0 
                        ? recentHistory.reduce((sum, h) => sum + (h.volume_ton * 1000), 0) / recentHistory.length 
                        : 0;
                      const ratePerHari = avgMonthlyKg / 30;
                      
                      const estimasiHari = ratePerHari > 0 ? Math.round(sisaKapasitasKg / ratePerHari) : 999;
                      
                      // Hitung tanggal estimasi penuh
                      const today = new Date();
                      const estimasiDate = new Date(today);
                      estimasiDate.setDate(today.getDate() + estimasiHari);
                      
                      // Hitung persentase dari total
                      const persenDariTotal = ((kapasitasKg - sisaKapasitasKg) / kapasitasKg * 100).toFixed(1);
                      
                      // Tentukan warna berdasarkan estimasi hari
                      const isKritis = estimasiHari < 3;
                      const isPerhatian = estimasiHari >= 3 && estimasiHari < 7;

                      return (
                        <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 md:p-4 border border-slate-200 dark:border-white/5 space-y-2.5">
                          {/* Rate pengisian */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Rate pengisian</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {(ratePerHari / 1000).toFixed(2)} kg/hari
                            </span>
                          </div>
                          
                          {/* Sisa kapasitas */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">Sisa kapasitas</span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {(sisaKapasitasKg / 1000).toFixed(2)} kg
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
                              {estimasiHari < 999 
                                ? `${estimasiHari} hari (${estimasiDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})`
                                : '∞ hari'}
                            </span>
                          </div>
                          
                          {/* B3 dari total */}
                          <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="text-slate-600 dark:text-slate-400">B3 dari total</span>
                            <span className={`font-bold ${
                              isKritis ? 'text-red-600 dark:text-red-400' : 
                              isPerhatian ? 'text-orange-600 dark:text-orange-400' : 
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {persenDariTotal}% dari total
                            </span>
                          </div>
                          
                          {/* Status badge */}
                          {isKritis && (
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2.5 py-1.5 rounded-lg mt-2">
                              <AlertCircle size={12} />
                              <span>KRITIS — Segera tindak lanjut!</span>
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

              {/* Volume Prediction Section */}
              <h3 className="flex items-center gap-2 text-sm md:text-[14px] font-bold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
                Prediksi Volume Sampah
              </h3>

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

              {/* Prediction Card */}
              {volResult && (
                <>
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
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {(volResult.predictions || []).map((pred, i) => {
                        const lastH = volResult.history?.[volResult.history.length - 1];
                        const predMonth = lastH ? ((lastH.bulan + i) % 12) + 1 : i + 1;
                        const predYear = lastH ? lastH.tahun + Math.floor((lastH.bulan + i) / 12) : 2026;
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
                    <div className="flex items-center justify-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-medium">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-slate-400 dark:bg-slate-500 rounded-sm" />
                        <span className="text-blue-600 dark:text-blue-400">Estimasi lalu</span>
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
                    
                    {/* Mini Bar Chart */}
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700/50">
                      <div className="flex items-end justify-between gap-1 h-20 md:h-24">
                        {/* Last 3 history bars (gray) */}
                        {(volResult.history || []).slice(-3).map((h, i) => (
                          <div key={`h-${i}`} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                              style={{ height: `${(h.volume_ton / maxVol) * 100}%` }}
                              className="w-full bg-slate-300 dark:bg-slate-600 rounded-t transition-all duration-500"
                            />
                            <span className="text-[8px] md:text-[9px] text-blue-600 dark:text-blue-400 font-medium">
                              {BULAN[h.bulan - 1]}
                            </span>
                          </div>
                        ))}
                        
                        {/* Current month (green) */}
                        {volResult.history && volResult.history.length > 0 && (() => {
                          const current = volResult.history[volResult.history.length - 1];
                          return (
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <div 
                                style={{ height: `${(current.volume_ton / maxVol) * 100}%` }}
                                className="w-full bg-emerald-500 dark:bg-emerald-400 rounded-t transition-all duration-500"
                              />
                              <span className="text-[8px] md:text-[9px] text-blue-600 dark:text-blue-400 font-bold">
                                {BULAN[current.bulan - 1]}
                              </span>
                            </div>
                          );
                        })()}
                        
                        {/* Predictions (blue) */}
                        {(volResult.predictions || []).map((p, i) => {
                          const lastH = volResult.history?.[volResult.history.length - 1];
                          const pm = lastH ? ((lastH.bulan + i) % 12) + 1 : i + 1;
                          return (
                            <div key={`p-${i}`} className="flex-1 flex flex-col items-center gap-1">
                              <div 
                                style={{ height: `${(p.volume_ton / maxVol) * 100}%` }}
                                className="w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-500"
                              />
                              <span className="text-[8px] md:text-[9px] text-blue-600 dark:text-blue-400 font-bold">
                                {BULAN[pm - 1]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Detailed History (Collapsible) */}
                  <details className="group">
                    <summary className="cursor-pointer list-none flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors duration-200">
                      <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <BarChart3 size={13} /> Riwayat 12 Bulan (ton)
                      </span>
                      <ChevronRight size={14} className="text-slate-400 group-open:rotate-90 transition-transform duration-200" />
                    </summary>
                    
                    <div className="flex flex-col gap-1.5 mt-2 mb-4">
                      {(volResult.history || []).map((h, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="min-w-[52px] text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 text-right transition-colors duration-300">
                            {BULAN[h.bulan - 1]} {h.tahun}
                          </span>
                          <div className="flex-1 h-3 md:h-4 bg-slate-100 dark:bg-white/5 rounded-sm overflow-hidden transition-colors duration-300">
                            <div
                              className="h-full bg-emerald-300 dark:bg-emerald-500 rounded-sm transition-all duration-500"
                              style={{ width: `${(h.volume_ton / maxVol) * 100}%` }}
                            />
                          </div>
                          <span className="min-w-[40px] text-[10px] md:text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-right transition-colors duration-300">
                            {h.volume_ton.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
