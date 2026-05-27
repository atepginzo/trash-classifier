const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai proses import data tps_master ke PRODUCTION...');
  
  const inputPath = path.join(__dirname, '../data_tps_lengkap.json');
  if (!fs.existsSync(inputPath)) {
    console.error(`File ${inputPath} tidak ditemukan! Lakukan export terlebih dahulu menggunakan database lokal.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(inputPath, 'utf-8');
  const allTps = JSON.parse(rawData);
  console.log(`Ditemukan ${allTps.length} baris data di file JSON. Memulai upsert...`);

  let successCount = 0;
  
  for (let i = 0; i < allTps.length; i++) {
    const tps = allTps[i];
    try {
      await prisma.tps_master.upsert({
        where: { id: tps.id },
        update: {
          nama_desa: tps.nama_desa,
          kecamatan: tps.kecamatan,
          kabupaten: tps.kabupaten,
          area_type: tps.area_type,
          lat: tps.lat, 
          lon: tps.lon,
          kapasitas_ton: tps.kapasitas_ton,
        },
        create: {
          id: tps.id,
          nama_desa: tps.nama_desa,
          kecamatan: tps.kecamatan,
          kabupaten: tps.kabupaten,
          area_type: tps.area_type,
          lat: tps.lat,
          lon: tps.lon,
          kapasitas_ton: tps.kapasitas_ton,
        }
      });
      successCount++;
      if (successCount % 50 === 0) {
        console.log(`Progress: ${successCount} baris berhasil diproses...`);
      }
    } catch (err) {
      console.error(`Gagal upsert untuk ID ${tps.id}:`, err.message);
    }
  }

  console.log(`\nImport selesai! Berhasil memproses ${successCount} dari ${allTps.length} baris.`);
}

main()
  .catch(e => {
    console.error('Terjadi error saat import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
