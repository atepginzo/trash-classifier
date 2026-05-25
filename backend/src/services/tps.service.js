const prisma = require('../lib/prisma');

/**
 * Haversine Formula — menghitung jarak antara dua titik koordinat di permukaan bumi.
 *
 * @param {number} lat1 - Latitude titik 1 (derajat)
 * @param {number} lon1 - Longitude titik 1 (derajat)
 * @param {number} lat2 - Latitude titik 2 (derajat)
 * @param {number} lon2 - Longitude titik 2 (derajat)
 * @returns {number} Jarak dalam kilometer
 */
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Ambil TPS terdekat dari posisi user.
 * Hitung jarak Haversine untuk setiap TPS, urutkan, dan kembalikan 10 terdekat.
 *
 * @param {number} userLat - Latitude posisi user
 * @param {number} userLon - Longitude posisi user
 * @param {number} [limit=10] - Jumlah TPS yang dikembalikan
 * @returns {Promise<Array>} Array TPS + distance_km, terurut dari terdekat
 */
async function findNearest(userLat, userLon, limit = 10) {
  const allTps = await prisma.tps_master.findMany();

  const withDistance = allTps.map((tps) => {
    const tpsLat = parseFloat(tps.lat);
    const tpsLon = parseFloat(tps.lon);
    const distKm = haversineKm(userLat, userLon, tpsLat, tpsLon);

    return {
      id: tps.id,
      nama_desa: tps.nama_desa,
      kecamatan: tps.kecamatan,
      kabupaten: tps.kabupaten,
      area_type: tps.area_type,
      lat: tpsLat,
      lon: tpsLon,
      kapasitas_ton: parseFloat(tps.kapasitas_ton),
      distance_km: parseFloat(distKm.toFixed(2)),
    };
  });

  // Urutkan dari jarak terdekat
  withDistance.sort((a, b) => a.distance_km - b.distance_km);

  return withDistance.slice(0, limit);
}

/**
 * Ambil semua TPS dengan paginasi sederhana.
 *
 * @param {number} [page=1]
 * @param {number} [limit=50]
 * @returns {Promise<{ tps: Array, total: number, totalPages: number }>}
 */
async function findAll(page = 1, limit = 50) {
  const skip = (page - 1) * limit;

  const [tps, total] = await Promise.all([
    prisma.tps_master.findMany({
      skip,
      take: limit,
      orderBy: { kecamatan: 'asc' },
    }),
    prisma.tps_master.count(),
  ]);

  const formatted = tps.map((t) => ({
    id: t.id,
    nama_desa: t.nama_desa,
    kecamatan: t.kecamatan,
    kabupaten: t.kabupaten,
    area_type: t.area_type,
    lat: parseFloat(t.lat),
    lon: parseFloat(t.lon),
    kapasitas_ton: parseFloat(t.kapasitas_ton),
  }));

  return {
    tps: formatted,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Ambil detail satu TPS berdasarkan ID.
 *
 * @param {string} id - ID TPS (contoh: "TPS-3204290004")
 * @returns {Promise<Object|null>}
 */
async function findById(id) {
  const tps = await prisma.tps_master.findUnique({ where: { id } });
  if (!tps) return null;

  return {
    id: tps.id,
    nama_desa: tps.nama_desa,
    kecamatan: tps.kecamatan,
    kabupaten: tps.kabupaten,
    area_type: tps.area_type,
    lat: parseFloat(tps.lat),
    lon: parseFloat(tps.lon),
    kapasitas_ton: parseFloat(tps.kapasitas_ton),
  };
}

module.exports = { findNearest, findAll, findById };
