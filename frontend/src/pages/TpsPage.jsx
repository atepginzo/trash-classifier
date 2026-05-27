import { useState, useEffect, useCallback } from 'react';
import {
  MapPin, Navigation, Loader2, AlertCircle, ChevronLeft, ChevronRight,
  Locate, List, ArrowUpDown, Building2, Trees, Landmark,
} from 'lucide-react';
import { tpsService } from '../services/tpsService';
import Navbar from '../components/Navbar';

const AREA_BADGE = {
  URBAN: { label: 'Urban', bg: '#e3f2fd', color: '#1565c0', Icon: Building2 },
  SEMI_URBAN: { label: 'Semi-Urban', bg: '#fff3e0', color: '#e65100', Icon: Landmark },
  RURAL: { label: 'Rural', bg: '#e8f5e9', color: '#2e7d32', Icon: Trees },
};

export default function TpsPage() {
  // Mode state
  const [mode, setMode] = useState('all'); // 'all' | 'nearest'

  // Shared state
  const [tpsList, setTpsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state (mode: all)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 12;

  // Geolocation state (mode: nearest)
  const [userCoords, setUserCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Fetch All TPS (paginasi)
  const fetchAll = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tpsService.getAll({ page: p, limit: LIMIT });
      setTpsList(res?.data || []);
      setTotal(res?.meta?.total || 0);
      setTotalPages(res?.meta?.totalPages || 1);
      setPage(p);
    } catch (err) {
      setError(err.message || 'Gagal memuat data TPS');
      setTpsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Nearest TPS (geolokasi)
  const fetchNearest = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await tpsService.findNearest(lat, lon, 10);
      const data = res?.data?.tps || res?.data || [];
      setTpsList(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat TPS terdekat');
      setTpsList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Geolocation handler
  function requestGeolocation() {
    if (!navigator.geolocation) {
      setGeoError('Browser Anda tidak mendukung Geolokasi.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserCoords(coords);
        setGeoLoading(false);
        fetchNearest(coords.lat, coords.lon);
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setGeoError('Izin lokasi ditolak. Aktifkan GPS dan izinkan akses lokasi di browser.');
            break;
          case err.POSITION_UNAVAILABLE:
            setGeoError('Informasi lokasi tidak tersedia.');
            break;
          case err.TIMEOUT:
            setGeoError('Permintaan lokasi timeout. Coba lagi.');
            break;
          default:
            setGeoError('Gagal mendapatkan lokasi.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  // Auto-fetch saat mode berubah
  useEffect(() => {
    if (mode === 'all') {
      fetchAll(1);
    } else {
      setTpsList([]);
      setError(null);
      if (userCoords) {
        fetchNearest(userCoords.lat, userCoords.lon);
      } else {
        requestGeolocation();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function switchMode(m) {
    if (m === mode) return;
    setMode(m);
  }

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
            Lokasi TPS
          </h1>
          <p style={{ color: '#6B7160' }} className="text-base leading-relaxed">
            Temukan Tempat Pembuangan Sampah di Bandung Raya
          </p>
        </div>

        {/* Card Container */}
        <div
          style={{ maxWidth: 900, backgroundColor: '#ffffff', borderRadius: 12 }}
          className="w-full p-5 md:p-8"
        >
          {/* Tab Switcher */}
          <div
            style={{ backgroundColor: '#f0ebe3', borderRadius: 999, padding: 4 }}
            className="flex mb-6"
          >
            {[
              { key: 'all', label: 'Semua TPS', Icon: List },
              { key: 'nearest', label: 'TPS Terdekat', Icon: Navigation },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                disabled={loading}
                style={{
                  backgroundColor: mode === key ? '#1a3d1a' : 'transparent',
                  color: mode === key ? '#ffffff' : '#3A3D35',
                  borderRadius: 999,
                  border: 'none',
                  outline: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Nearest Mode: Koordinat Info */}
          {mode === 'nearest' && (
            <div
              style={{
                backgroundColor: '#f0f7f0',
                borderRadius: 8,
                borderLeft: '4px solid #2d6a2d',
              }}
              className="p-4 mb-5 flex items-center justify-between flex-wrap gap-3"
            >
              <div className="flex items-center gap-2">
                <Locate size={16} style={{ color: '#2d6a2d' }} />
                {geoLoading ? (
                  <span style={{ color: '#2d6a2d' }} className="text-sm">
                    Mendapatkan lokasi Anda...
                  </span>
                ) : userCoords ? (
                  <span style={{ color: '#2d6a2d' }} className="text-sm">
                    Lokasi Anda:{' '}
                    <span className="font-mono font-semibold">
                      {userCoords.lat.toFixed(4)}, {userCoords.lon.toFixed(4)}
                    </span>
                  </span>
                ) : (
                  <span style={{ color: '#6B7160' }} className="text-sm">
                    Lokasi belum terdeteksi
                  </span>
                )}
              </div>
              <button
                onClick={requestGeolocation}
                disabled={geoLoading || loading}
                style={{
                  backgroundColor: '#2d6a2d',
                  color: '#ffffff',
                  borderRadius: 999,
                  border: 'none',
                  fontSize: 12,
                  cursor: geoLoading || loading ? 'not-allowed' : 'pointer',
                  opacity: geoLoading || loading ? 0.6 : 1,
                }}
                className="px-4 py-1.5 font-semibold flex items-center gap-1.5"
              >
                {geoLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Navigation size={12} />
                )}
                Perbarui Lokasi
              </button>
            </div>
          )}

          {/* Geo Error */}
          {geoError && mode === 'nearest' && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #f5c6c6',
                borderRadius: 8,
              }}
              className="flex items-start gap-3 p-4 mb-5"
            >
              <AlertCircle size={18} style={{ color: '#a32d2d', flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: '#7f1d1d' }} className="text-sm flex-1">
                {geoError}
              </p>
            </div>
          )}

          {/* Fetch Error */}
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #f5c6c6',
                borderRadius: 8,
              }}
              className="flex items-start gap-3 p-4 mb-5"
            >
              <AlertCircle size={18} style={{ color: '#a32d2d', flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: '#7f1d1d' }} className="text-sm flex-1">
                {error}
              </p>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center py-16">
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: '3px solid #e0ddd5',
                  borderTopColor: '#1a3d1a',
                  borderRadius: '50%',
                }}
                className="animate-spin"
              />
              <p style={{ color: '#6B7160' }} className="mt-4 text-sm">
                {mode === 'nearest'
                  ? 'Mencari TPS terdekat...'
                  : 'Memuat data TPS...'}
              </p>
            </div>
          )}

          {/* Results: TPS Cards */}
          {!loading && tpsList.length > 0 && (
            <>
              {/* Counter */}
              <div className="flex items-center justify-between mb-4">
                <p style={{ color: '#6B7160' }} className="text-sm">
                  {mode === 'nearest'
                    ? `Menampilkan ${tpsList.length} TPS terdekat`
                    : `Menampilkan ${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} dari ${total} TPS`}
                </p>
                {mode === 'nearest' && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#6B7160' }}>
                    <ArrowUpDown size={12} />
                    Terurut dari terdekat
                  </div>
                )}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tpsList.map((tps, idx) => {
                  const badge = AREA_BADGE[tps.area_type] || AREA_BADGE.RURAL;
                  const BadgeIcon = badge.Icon;

                  return (
                    <div
                      key={tps.id}
                      style={{
                        backgroundColor: '#fafaf7',
                        border: '1px solid #e0ddd5',
                        borderRadius: 10,
                        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
                      }}
                      className="p-4 hover:shadow-md hover:-translate-y-0.5"
                    >
                      {/* Top Row: Badge + Rank */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                          className="px-2.5 py-1 flex items-center gap-1"
                        >
                          <BadgeIcon size={11} />
                          {badge.label}
                        </span>
                        {mode === 'nearest' && (
                          <span
                            style={{
                              backgroundColor: '#1a3d1a',
                              color: '#ffffff',
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 700,
                              minWidth: 24,
                              textAlign: 'center',
                            }}
                            className="px-2 py-0.5"
                          >
                            #{idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Nama Desa */}
                      <h3
                        style={{ color: '#0F1A0A' }}
                        className="text-sm font-bold leading-snug mb-1"
                      >
                        {tps.nama_desa}
                      </h3>

                      {/* Kecamatan + Kabupaten */}
                      <p
                        style={{ color: '#6B7160' }}
                        className="text-xs mb-3 leading-relaxed"
                      >
                        Kec. {tps.kecamatan}
                        {tps.kabupaten && ` • ${tps.kabupaten}`}
                      </p>

                      {/* Distance (nearest mode) */}
                      {mode === 'nearest' && tps.distance_km != null && (
                        <div
                          style={{
                            backgroundColor: '#e8f5e9',
                            borderRadius: 6,
                          }}
                          className="flex items-center gap-2 px-3 py-2 mb-3"
                        >
                          <Navigation size={13} style={{ color: '#2d6a2d' }} />
                          <span
                            style={{ color: '#2d6a2d' }}
                            className="text-xs font-bold"
                          >
                            {tps.distance_km < 1
                              ? `${(tps.distance_km * 1000).toFixed(0)} m`
                              : `${tps.distance_km.toFixed(1)} km`}
                          </span>
                          <span style={{ color: '#6B7160' }} className="text-xs">
                            dari lokasi Anda
                          </span>
                        </div>
                      )}

                      {/* Footer: Kapasitas + Koordinat */}
                      <div
                        style={{ borderTop: '1px solid #e0ddd5' }}
                        className="pt-3 flex items-center justify-between"
                      >
                        <span style={{ color: '#6B7160' }} className="text-xs">
                          Kapasitas:{' '}
                          <span className="font-semibold" style={{ color: '#3A3D35' }}>
                            {tps.kapasitas_ton} ton
                          </span>
                        </span>
                        <span
                          style={{ color: '#A8B89C' }}
                          className="text-xs font-mono flex items-center gap-1"
                        >
                          <MapPin size={10} />
                          {typeof tps.lat === 'number' ? tps.lat.toFixed(3) : tps.lat},
                          {typeof tps.lon === 'number' ? tps.lon.toFixed(3) : tps.lon}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination (only for 'all' mode) */}
              {mode === 'all' && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => fetchAll(page - 1)}
                    disabled={page <= 1 || loading}
                    style={{
                      backgroundColor: page <= 1 ? '#f0ebe3' : '#ffffff',
                      color: page <= 1 ? '#b0b0a8' : '#3A3D35',
                      border: '1px solid #e0ddd5',
                      borderRadius: 8,
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    }}
                    className="p-2"
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Page numbers */}
                  {generatePageNumbers(page, totalPages).map((p, i) =>
                    p === '...' ? (
                      <span
                        key={`dots-${i}`}
                        style={{ color: '#6B7160' }}
                        className="px-2 text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => fetchAll(p)}
                        disabled={loading}
                        style={{
                          backgroundColor: p === page ? '#1a3d1a' : '#ffffff',
                          color: p === page ? '#ffffff' : '#3A3D35',
                          border: `1px solid ${p === page ? '#1a3d1a' : '#e0ddd5'}`,
                          borderRadius: 8,
                          minWidth: 36,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontWeight: p === page ? 700 : 400,
                          transition: 'all 0.15s ease',
                        }}
                        className="py-1.5 text-sm"
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => fetchAll(page + 1)}
                    disabled={page >= totalPages || loading}
                    style={{
                      backgroundColor: page >= totalPages ? '#f0ebe3' : '#ffffff',
                      color: page >= totalPages ? '#b0b0a8' : '#3A3D35',
                      border: '1px solid #e0ddd5',
                      borderRadius: 8,
                      cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                    }}
                    className="p-2"
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && tpsList.length === 0 && mode === 'all' && (
            <div className="flex flex-col items-center py-16 text-center">
              <MapPin size={44} style={{ color: '#A8B89C' }} />
              <p style={{ color: '#6B7160' }} className="text-sm mt-4">
                Tidak ada data TPS ditemukan.
              </p>
            </div>
          )}

          {!loading && !error && !geoError && tpsList.length === 0 && mode === 'nearest' && !geoLoading && (
            <div className="flex flex-col items-center py-16 text-center">
              <Navigation size={44} style={{ color: '#A8B89C' }} />
              <p style={{ color: '#6B7160' }} className="text-sm mt-4">
                Aktifkan lokasi untuk mencari TPS terdekat
              </p>
              <button
                onClick={requestGeolocation}
                style={{
                  backgroundColor: '#1a3d1a',
                  color: '#ffffff',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="mt-4 px-6 py-2.5 text-sm font-semibold flex items-center gap-2"
              >
                <Locate size={14} />
                Aktifkan Lokasi
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Menghasilkan array nomor halaman dengan ellipsis.
 * Contoh: [1, 2, 3, '...', 38, 39, 40]
 */
function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}
