#!/usr/bin/env node
/**
 * migrate-tps.js — Migrasi data TPS dari CSV ke PostgreSQL
 *
 * Alur:
 *  1. Buat tabel tps_master (DDL) jika belum ada
 *  2. Baca file tpsjabar.csv
 *  3. Filter: Kab Bandung / Kab Bandung Barat / Kab Sumedang, tahun 2023, ADA
 *  4. Generate koordinat pseudo-random (MD5 hash — identik dengan Python app.py)
 *  5. INSERT ke PostgreSQL (ON CONFLICT DO NOTHING)
 *
 * Cara menjalankan:
 *   cd backend
 *   node scripts/migrate-tps.js
 *
 * Prasyarat:
 *   - PostgreSQL berjalan, DATABASE_URL di .env sudah benar
 *   - File tpsjabar.csv ada di ../data/ atau path yang ditentukan
 *   - npm packages: pg, csv-parser, dotenv (sudah terinstall)
 */

require('dotenv').config();
const { Pool } = require('pg');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

// Cari file CSV — cek beberapa lokasi
const CSV_CANDIDATES = [
  path.join(__dirname, '..', 'data', 'tpsjabar.csv'),
  path.join(__dirname, '..', 'tpsjabar.csv'),
  path.resolve('c:/Dicoding/CapstoneDBS/AI Persebaran Sampah/tpsjabar.csv'),
];

const CSV_PATH = CSV_CANDIDATES.find((p) => fs.existsSync(p));
if (!CSV_PATH) {
  console.error('[!] File tpsjabar.csv tidak ditemukan di:');
  CSV_CANDIDATES.forEach((p) => console.error(`    - ${p}`));
  console.error('\n    Salin file CSV ke backend/data/tpsjabar.csv lalu jalankan ulang.');
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('[!] DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

// Kabupaten yang diambil
const BANDUNG_RAYA = new Set([
  'KABUPATEN BANDUNG',
  'KABUPATEN BANDUNG BARAT',
  'KABUPATEN SUMEDANG',
]);

// ═══════════════════════════════════════════════════════════════════════════════
// KOORDINAT KECAMATAN (identik dengan Python app.py KEC_COORDS)
// ═══════════════════════════════════════════════════════════════════════════════

const KEC_COORDS = {
  // Kab. Bandung
  'CILEUNYI':       [-6.9195, 107.7502], 'CIMENYAN':      [-6.8724, 107.6891],
  'CILENGKRANG':    [-6.8894, 107.7102], 'BOJONGSOANG':   [-6.9882, 107.6431],
  'BALEENDAH':      [-7.0106, 107.6313], 'DAYEUHKOLOT':   [-6.9882, 107.6213],
  'MARGAASIH':      [-6.9587, 107.5721], 'MARGAHAYU':     [-6.9671, 107.5901],
  'KATAPANG':       [-7.0002, 107.5802], 'KUTAWARINGIN':  [-6.9945, 107.5441],
  'SOREANG':        [-7.0308, 107.5221], 'CIWIDEY':       [-7.0876, 107.4801],
  'RANCABALI':      [-7.1234, 107.4321], 'PASIRJAMBU':    [-7.0987, 107.4561],
  'PANGALENGAN':    [-7.1567, 107.5834], 'KERTASARI':     [-7.1987, 107.6234],
  'PACET':          [-6.8812, 107.7234], 'MAJALAYA':      [-7.0434, 107.7234],
  'SOLOKAN JERUK':  [-7.0212, 107.7023], 'PASEH':         [-7.0654, 107.7456],
  'CIPARAY':        [-7.0234, 107.7012], 'BANJARAN':      [-7.0456, 107.5901],
  'CANGKUANG':      [-7.0234, 107.5701], 'PAMEUNGPEUK':   [-7.0123, 107.6012],
  'ARJASARI':       [-7.0654, 107.5634], 'CIMAUNG':       [-7.0876, 107.5634],
  'IBUN':           [-7.0456, 107.7456], 'RANCAEKEK':     [-6.9765, 107.7345],
  'CIKANCUNG':      [-6.9445, 107.7456], 'CICALENGKA':    [-6.9654, 107.7567],
  'NAGREG':         [-7.0012, 107.8012],
  // Kab. Bandung Barat
  'PADALARANG':     [-6.8765, 107.5234], 'NGAMPRAH':      [-6.8987, 107.5423],
  'LEMBANG':        [-6.8123, 107.6123], 'BATUJAJAR':     [-6.9123, 107.5001],
  'CIPATAT':        [-6.8765, 107.4234], 'SINDANGKERTA':  [-7.0123, 107.4234],
  'CIHAMPELAS':     [-6.9456, 107.5012], 'CILILIN':       [-6.9654, 107.4434],
  'CIPONGKOR':      [-6.9876, 107.4012], 'RONGGA':        [-7.0234, 107.4012],
  'GUNUNGHALU':     [-7.0456, 107.3901], 'SAGULING':      [-6.9334, 107.4756],
  'CIKALONGWETAN':  [-6.8456, 107.4234], 'CIPEUNDEUY':    [-6.8765, 107.4756],
  'PARONGPONG':     [-6.8234, 107.5756], 'CISARUA':       [-6.8345, 107.5901],
  // Kab. Sumedang
  'SUMEDANG UTARA': [-6.8543, 107.9198], 'SUMEDANG SELATAN': [-6.8765, 107.9123],
  'CIMALAKA':       [-6.8123, 107.9345], 'TANJUNGSARI':   [-6.9123, 107.8567],
  'JATINANGOR':     [-6.9234, 107.7765], 'RANCAKALONG':   [-6.8876, 107.8345],
  'PAMULIHAN':      [-7.0012, 107.8234], 'CIMANGGUNG':    [-6.9654, 107.8012],
  'SUKASARI':       [-6.9445, 107.7923], 'CONGGEANG':     [-6.7987, 107.9456],
  'TOMO':           [-6.8234, 108.0123], 'UJUNGJAYA':     [-6.8456, 108.0456],
  'DARMARAJA':      [-6.9234, 108.0123], 'SITURAJA':      [-6.9567, 108.0234],
  'GANEAS':         [-6.8765, 107.9901], 'CISITU':        [-6.8543, 108.0012],
  'BUAHDUA':        [-6.7654, 107.9567], 'WADO':          [-6.9876, 108.0456],
  'JATIGEDE':       [-6.9345, 108.0789], 'TANJUNGKERTA':  [-6.9123, 108.0456],
  'TANJUNGMEDAR':   [-6.8543, 108.0901],
};

// Titik tengah fallback per kabupaten (identik dengan Python KAB_CENTER)
const KAB_CENTER = {
  'KABUPATEN BANDUNG':       [-7.0117, 107.5900],
  'KABUPATEN BANDUNG BARAT': [-6.9167, 107.5200],
  'KABUPATEN SUMEDANG':      [-6.8500, 107.9200],
};

// ═══════════════════════════════════════════════════════════════════════════════
// AREA TYPE & KAPASITAS (disesuaikan dengan spesifikasi user)
// ═══════════════════════════════════════════════════════════════════════════════

const URBAN_KEC = new Set([
  'BALEENDAH', 'DAYEUHKOLOT', 'BOJONGSOANG',
  'LEMBANG', 'PADALARANG', 'NGAMPRAH',
  'SUMEDANG UTARA',
]);

const SEMI_URBAN_KEC = new Set([
  'MAJALAYA', 'PASEH', 'CIPARAY', 'RANCAEKEK',
  'CICALENGKA', 'SOREANG', 'KATAPANG',
  'JATINANGOR',
]);

const CAPACITY_TON = {
  URBAN: 20.0,
  SEMI_URBAN: 10.0,
  RURAL: 4.0,
};

/**
 * Tentukan tipe area berdasarkan nama kecamatan.
 */
function getAreaType(kecamatan) {
  const k = kecamatan.toUpperCase();
  if (URBAN_KEC.has(k)) return 'URBAN';
  if (SEMI_URBAN_KEC.has(k)) return 'SEMI_URBAN';
  return 'RURAL';
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE KOORDINAT (port 1:1 dari Python _coords)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate koordinat pseudo-random deterministik menggunakan MD5 hash.
 * Algoritma identik dengan Python app.py `_coords()`:
 *
 *   h = int(hashlib.md5(kode.encode()).hexdigest()[:8], 16)
 *   lat_off = ((h & 0xFF) / 255.0 - 0.5) * 0.026
 *   lon_off = ((h >> 8 & 0xFF) / 255.0 - 0.5) * 0.026
 *   return (lat0 + lat_off, lon0 + lon_off)
 *
 * @param {string} kecamatan - Nama kecamatan (uppercase)
 * @param {string} kodeDesa  - Kode desa BPS (string angka)
 * @param {string} kabupaten - Nama kabupaten lengkap (uppercase)
 * @returns {{ lat: number, lon: number }}
 */
function generateCoords(kecamatan, kodeDesa, kabupaten) {
  const kecUp = kecamatan.toUpperCase();
  const kabUp = kabupaten.toUpperCase();

  // Ambil titik tengah: prioritas kecamatan, fallback ke kabupaten
  const fallback = KAB_CENTER[kabUp] || [-6.9175, 107.6191];
  const [lat0, lon0] = KEC_COORDS[kecUp] || fallback;

  // MD5 hash dari kode desa → ambil 8 hex pertama → parse ke integer
  const md5hex = crypto.createHash('md5').update(kodeDesa).digest('hex');
  const h = parseInt(md5hex.substring(0, 8), 16);

  // Offset latitude dan longitude (± ~0.013 derajat ≈ ± ~1.4 km)
  const latOff = ((h & 0xFF) / 255.0 - 0.5) * 0.026;
  const lonOff = (((h >> 8) & 0xFF) / 255.0 - 0.5) * 0.026;

  return {
    lat: parseFloat((lat0 + latOff).toFixed(6)),
    lon: parseFloat((lon0 + lonOff).toFixed(6)),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TITLE CASE HELPER
// ═══════════════════════════════════════════════════════════════════════════════

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║          migrate-tps.js — CSV → PostgreSQL              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(`[+] CSV   : ${CSV_PATH}`);
  console.log(`[+] DB    : ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`); // mask password

  // ── 1. Koneksi database ───────────────────────────────────────────────────
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query('SELECT 1');
    console.log('[+] Koneksi PostgreSQL berhasil!\n');
  } catch (err) {
    console.error('[!] Gagal terkoneksi ke PostgreSQL:', err.message);
    process.exit(1);
  }

  // ── 2. DDL: Buat tabel tps_master ─────────────────────────────────────────
  console.log('[1/4] Membuat tabel tps_master...');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tps_master (
      id             VARCHAR(50)    PRIMARY KEY,
      nama_desa      VARCHAR(255)   NOT NULL,
      kecamatan      VARCHAR(255)   NOT NULL,
      kabupaten      VARCHAR(255)   NOT NULL,
      area_type      VARCHAR(20)    NOT NULL,
      lat            DECIMAL(9,6)   NOT NULL,
      lon            DECIMAL(9,6)   NOT NULL,
      kapasitas_ton  DECIMAL(6,1)   NOT NULL
    );
  `);
  console.log('      ✔ Tabel tps_master siap.\n');

  // ── 3. Baca dan filter CSV ────────────────────────────────────────────────
  console.log('[2/4] Membaca dan memfilter CSV...');
  const rows = await readAndFilterCSV(CSV_PATH);
  console.log(`      ✔ ${rows.length} baris lolos filter (Bandung Raya, 2023, ADA).\n`);

  if (rows.length === 0) {
    console.log('[!] Tidak ada data yang lolos filter. Proses dihentikan.');
    await pool.end();
    return;
  }

  // ── 4. Generate koordinat dan tentukan area type ──────────────────────────
  console.log('[3/4] Menghitung koordinat dan area type...');
  const tpsRecords = rows.map((row) => {
    const kodeDesa = String(parseInt(row.bps_kode_desa_kelurahan));
    const kecamatan = row.bps_nama_kecamatan;
    const kabupaten = row.bps_nama_kabupaten_kota;

    const areaType = getAreaType(kecamatan);
    const { lat, lon } = generateCoords(kecamatan, kodeDesa, kabupaten);

    return {
      id: `TPS-${kodeDesa}`,
      nama_desa: toTitleCase(row.bps_nama_desa_kelurahan),
      kecamatan: toTitleCase(kecamatan),
      kabupaten: toTitleCase(kabupaten),
      area_type: areaType,
      lat,
      lon,
      kapasitas_ton: CAPACITY_TON[areaType],
    };
  });

  // Statistik area type
  const stats = { URBAN: 0, SEMI_URBAN: 0, RURAL: 0 };
  tpsRecords.forEach((r) => stats[r.area_type]++);
  console.log(`      ✔ URBAN: ${stats.URBAN}  |  SEMI_URBAN: ${stats.SEMI_URBAN}  |  RURAL: ${stats.RURAL}\n`);

  // ── 5. Insert ke database ─────────────────────────────────────────────────
  console.log('[4/4] Memasukkan data ke PostgreSQL...');
  let inserted = 0;
  let skipped = 0;

  for (const rec of tpsRecords) {
    const result = await pool.query(
      `INSERT INTO tps_master (id, nama_desa, kecamatan, kabupaten, area_type, lat, lon, kapasitas_ton)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [rec.id, rec.nama_desa, rec.kecamatan, rec.kabupaten, rec.area_type, rec.lat, rec.lon, rec.kapasitas_ton]
    );
    if (result.rowCount > 0) {
      inserted++;
    } else {
      skipped++;
    }
  }

  console.log(`      ✔ Inserted: ${inserted}  |  Skipped (sudah ada): ${skipped}\n`);

  // ── Selesai ───────────────────────────────────────────────────────────────
  // Verifikasi jumlah record di database
  const countResult = await pool.query('SELECT COUNT(*) AS total FROM tps_master');
  console.log(`[✔] Total record di tps_master: ${countResult.rows[0].total}`);
  console.log('[✔] Migrasi selesai!\n');

  // Tampilkan 5 sample
  const sample = await pool.query('SELECT id, nama_desa, kecamatan, area_type, lat, lon FROM tps_master LIMIT 5');
  console.log('── Sample Data ──────────────────────────────────────────────');
  console.table(sample.rows);

  await pool.end();
}

// ═══════════════════════════════════════════════════════════════════════════════
// CSV READER + FILTER
// ═══════════════════════════════════════════════════════════════════════════════

function readAndFilterCSV(csvPath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let totalRead = 0;

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        totalRead++;

        // Field names dari CSV header
        const kabupaten = (row.bps_nama_kabupaten_kota || '').trim().toUpperCase();
        const tahun = (row.tahun || '').trim().replace('.0', '');
        const ketersediaan = (row.ketersediaan_tempat_pembuangan_sampah || '').trim().toUpperCase();

        // Filter 1: Kabupaten Bandung Raya
        if (!BANDUNG_RAYA.has(kabupaten)) return;

        // Filter 2: Tahun 2023
        if (tahun !== '2023') return;

        // Filter 3: TPS tersedia
        if (ketersediaan !== 'ADA') return;

        results.push(row);
      })
      .on('end', () => {
        console.log(`      → Total baris dibaca dari CSV: ${totalRead}`);
        resolve(results);
      })
      .on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUN
// ═══════════════════════════════════════════════════════════════════════════════

main().catch((err) => {
  console.error('[!] Fatal error:', err);
  process.exit(1);
});
