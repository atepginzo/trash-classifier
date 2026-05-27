const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai proses export data tps_master dari LOKAL...');
  
  // Ambil semua data tps_master
  const allTps = await prisma.tps_master.findMany();
  console.log(`Berhasil mengambil ${allTps.length} baris data tps_master.`);
  
  // Konversi tipe Decimal bawaan Prisma menjadi String agar aman di-JSON-kan
  const serializedData = allTps.map(row => {
    return {
      ...row,
      lat: row.lat ? row.lat.toString() : null,
      lon: row.lon ? row.lon.toString() : null,
      kapasitas_ton: row.kapasitas_ton ? row.kapasitas_ton.toString() : null,
    };
  });
  
  const outputPath = path.join(__dirname, '../data_tps_lengkap.json');
  fs.writeFileSync(outputPath, JSON.stringify(serializedData, null, 2), 'utf-8');
  
  console.log(`Export selesai! Data tersimpan di ${outputPath}`);
}

main()
  .catch(e => {
    console.error('Terjadi error saat export:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
