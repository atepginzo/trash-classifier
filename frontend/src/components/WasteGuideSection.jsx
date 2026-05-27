import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchCheck, Droplets, Archive, Recycle } from 'lucide-react';

import sisaMakananImg from '../assets/guide/sisa-makanan.png';
import daunKeringImg from '../assets/guide/daun-kering.png';
import botolPlastikImg from '../assets/guide/botol-plastik.png';
import kardusBekasImg from '../assets/guide/kardus-bekas.png';
import kalengBekasImg from '../assets/guide/kaleng-bekas.png';
import kacaBelingImg from '../assets/guide/kaca&beling.png';
import bateraiBekasImg from '../assets/guide/baterai-bekas.png';
import lampuRusakImg from '../assets/guide/lampu-rusak.jpg';
import minyakJelantahImg from '../assets/guide/minyak-jelantah.jpg';

// Data
const wasteItems = [
  {
    name: "Sisa Makanan",
    category: "Organik",
    image: sisaMakananImg,
    description: "Sisa konsumsi manusia seperti nasi, tulang, kulit buah, sisa sayur, dan bahan makanan lain yang mudah membusuk karena berasal dari bahan alami.",
    sorting: "Tiriskan sisa air atau kuah terlebih dahulu agar tidak terlalu basah, lalu pisahkan dari plastik, tisu, kemasan makanan, atau benda anorganik lain. Masukkan ke wadah tertutup supaya tidak menimbulkan bau menyengat dan tidak mengundang lalat.",
    management: "Sisa makanan dapat diolah menjadi kompos rumah tangga, eco-enzyme, atau pakan maggot BSF jika dipilah dengan benar sejak awal. Untuk hasil terbaik, campurkan dengan bahan kering seperti daun kering atau serbuk gergaji agar proses pembusukan lebih seimbang."
  },
  {
    name: "Daun Kering",
    category: "Organik",
    image: daunKeringImg,
    description: "Sampah kebun seperti daun gugur, ranting kecil, dan sisa tanaman kering yang mudah terurai serta sangat baik untuk mengembalikan unsur hara ke tanah.",
    sorting: "Kumpulkan daun kering dalam karung, keranjang, atau wadah khusus yang terpisah dari sampah plastik, batu, kaca, dan sampah basah. Pastikan daun tidak tercampur minyak, bahan kimia, atau limbah rumah tangga lain agar tetap aman untuk pengomposan.",
    management: "Daun kering sangat cocok dijadikan mulsa untuk menjaga kelembapan tanah atau dicampurkan ke komposter sebagai bahan karbon. Jika dicacah lebih kecil, proses penguraian akan berjalan lebih cepat dan hasil kompos menjadi lebih merata."
  },
  {
    name: "Botol Plastik",
    category: "Anorganik",
    image: botolPlastikImg,
    description: "Botol plastik umumnya terbuat dari bahan sintetis seperti PET yang membutuhkan waktu sangat lama untuk terurai secara alami, tetapi masih memiliki nilai daur ulang yang cukup tinggi.",
    sorting: "Kosongkan seluruh sisa cairan, bilas bagian dalam botol agar tidak meninggalkan bau atau residu, lalu keringkan sebentar. Jika memungkinkan, remukkan botol untuk menghemat ruang dan pisahkan tutup botol karena jenis plastiknya bisa berbeda.",
    management: "Botol plastik yang bersih dan kering dapat dikumpulkan untuk disetorkan ke bank sampah, pengepul, atau fasilitas daur ulang. Hindari membakar plastik karena dapat menghasilkan asap beracun dan mencemari udara."
  },
  {
    name: "Kardus Bekas",
    category: "Anorganik",
    image: kardusBekasImg,
    description: "Kardus bekas merupakan material berbasis kertas tebal yang dapat didaur ulang menjadi kertas atau kardus baru selama kondisinya tidak terlalu kotor, basah, atau berminyak.",
    sorting: "Pastikan kardus dalam kondisi kering sebelum dikumpulkan. Lepaskan sisa selotip, plastik pembungkus, label pengiriman, atau stiker tebal jika memungkinkan, lalu lipat atau pipihkan agar tidak memakan banyak tempat.",
    management: "Kardus bekas memiliki nilai ekonomi yang cukup baik jika dikumpulkan dalam jumlah banyak dan kondisi bersih. Setorkan ke bank sampah atau pengepul barang bekas agar bisa masuk kembali ke rantai daur ulang."
  },
  {
    name: "Kaleng Bekas",
    category: "Anorganik",
    image: kalengBekasImg,
    description: "Kaleng bekas biasanya terbuat dari aluminium atau baja yang memiliki nilai daur ulang tinggi dan dapat diproses kembali menjadi material logam baru.",
    sorting: "Bilas kaleng dari sisa makanan atau minuman agar tidak berbau dan tidak menarik serangga. Setelah kering, pipihkan kaleng jika memungkinkan untuk menghemat ruang penyimpanan, tetapi tetap berhati-hati pada bagian tepi yang tajam.",
    management: "Kaleng bekas dapat disetorkan ke bank sampah atau fasilitas daur ulang logam. Karena logam bisa didaur ulang berkali-kali, memilah kaleng dengan benar membantu mengurangi kebutuhan produksi material baru dari alam."
  },
  {
  name: "Kaca & Beling",
  category: "B3",
  image: kacaBelingImg,
  description: "Kaca pecah, beling, atau botol kaca rusak termasuk sampah berisiko karena memiliki sisi tajam yang dapat melukai petugas kebersihan dan pengguna.",
  sorting: "Jangan dicampur langsung dengan sampah rumah tangga biasa. Bungkus pecahan kaca dengan kertas tebal, kardus, atau kain bekas, lalu beri tanda peringatan seperti 'Kaca Pecah' agar aman saat diangkut.",
  management: "Jika botol kaca masih utuh, gunakan kembali atau setorkan ke fasilitas daur ulang kaca. Jika sudah pecah, perlakukan sebagai limbah berisiko dan serahkan ke petugas atau fasilitas pengelolaan yang menerima sampah tajam."
  },
  {
    name: "Baterai Bekas",
    category: "B3",
    image: bateraiBekasImg,
    description: "Baterai bekas termasuk limbah B3 karena mengandung bahan kimia dan logam berat yang berpotensi mencemari tanah, air, serta membahayakan kesehatan jika dibuang sembarangan.",
    sorting: "Jangan mencampur baterai bekas dengan sampah organik atau anorganik biasa. Simpan baterai di wadah kering dan tertutup, jauhkan dari panas, air, dan benda logam lain untuk mencegah kebocoran atau korsleting.",
    management: "Baterai bekas sebaiknya diserahkan ke drop point e-waste, toko elektronik tertentu, bank sampah khusus, atau fasilitas pengelolaan limbah B3 resmi. Jangan dibakar, dibongkar, atau dibuang ke tanah karena kandungannya berbahaya."
  },
  {
    name: "Lampu Rusak",
    category: "B3",
    image: lampuRusakImg,
    description: "Beberapa jenis lampu seperti CFL, neon, atau TL dapat mengandung merkuri dan bahan berbahaya lain, sehingga perlu diperlakukan sebagai limbah B3 terutama jika pecah atau rusak.",
    sorting: "Jangan memecahkan lampu dengan sengaja. Jika lampu masih utuh, simpan kembali dalam kardus atau bungkus pelindung agar tidak pecah saat dipindahkan. Jika sudah pecah, gunakan sarung tangan dan kumpulkan pecahannya dengan hati-hati.",
    management: "Lampu rusak sebaiknya dikumpulkan di kotak e-waste atau diserahkan ke fasilitas pengelolaan limbah B3. Hindari membuangnya langsung ke tempat sampah biasa karena pecahan kaca dan kandungan kimianya dapat membahayakan manusia serta lingkungan."
  },
  {
    name: "Minyak Jelantah",
    category: "B3",
    image: minyakJelantahImg,
    description: "Minyak jelantah adalah minyak goreng bekas yang tidak layak digunakan berulang kali dan dapat mencemari air, menyumbat saluran pipa, serta merusak ekosistem jika dibuang sembarangan.",
    sorting: "Tunggu minyak hingga benar-benar dingin, lalu saring ampas makanan yang tersisa. Simpan minyak dalam botol, jerigen, atau wadah tertutup rapat agar tidak tumpah dan tidak tercampur dengan air atau sampah lain.",
    management: "Minyak jelantah dapat disetorkan ke lembaga pengumpul jelantah untuk diolah menjadi biodiesel, sabun, atau produk turunan lain. Jangan menuangkannya ke wastafel, selokan, tanah, atau sungai karena dapat menyebabkan pencemaran serius."
  }
];

const STEPS = [
  {
    num: '01',
    title: 'Identifikasi Jenis',
    desc: 'Kenali apakah sampah termasuk organik, anorganik, atau B3 sebelum dibuang.',
    icon: SearchCheck,
  },
  {
    num: '02',
    title: 'Bersihkan & Keringkan',
    desc: 'Bilas kemasan dari sisa kotoran dan pastikan kering agar tidak mencemari sampah lain.',
    icon: Droplets,
  },
  {
    num: '03',
    title: 'Pisahkan per Wadah',
    desc: 'Gunakan wadah berbeda untuk sampah organik, anorganik, dan limbah berisiko.',
    icon: Archive,
  },
  {
    num: '04',
    title: 'Kelola dengan Tepat',
    desc: 'Jadikan kompos, setor ke bank sampah, atau kirim limbah B3 ke drop-off resmi.',
    icon: Recycle,
  },
];

// Helper for category badge styling
const getCategoryStyle = (category) => {
  switch (category) {
    case 'Organik':
      return 'bg-emerald-100 text-emerald-700 ring-emerald-500/20';
    case 'Anorganik':
      return 'bg-sky-100 text-sky-700 ring-sky-500/20';
    case 'B3':
      return 'bg-amber-100 text-amber-700 ring-amber-500/20';
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-500/20';
  }
};

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

export default function WasteGuideSection() {
  const [selectedWaste, setSelectedWaste] = useState(wasteItems[0]);

  return (
    <section id="edukasi" className="relative overflow-hidden">
      {/* Part 1: Macam-Macam Sampah (Carousel & Detail) */}
      <div className="bg-gradient-to-br from-[#F8FAFC] via-emerald-50/40 to-cyan-50/30 pt-16 md:pt-20 pb-20 sm:pb-28 lg:pb-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold
                           text-slate-900 leading-[1.1] tracking-tight mb-5">
              Kenali, Pilah, dan Kelola<br className="hidden sm:block" /> Sampah dengan Benar
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Pilih salah satu jenis sampah untuk melihat kategori, cara memilah, dan rekomendasi pengelolaannya.
            </p>
          </motion.div>

          {/* Carousel Wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="flex gap-4 sm:gap-5 snap-x snap-mandatory">
                {wasteItems.map((item, idx) => {
                  const isSelected = selectedWaste.name === item.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedWaste(item)}
                      className={`relative min-w-[220px] md:min-w-[260px] snap-start rounded-3xl border bg-white shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-left focus:outline-none
                        ${isSelected ? 'ring-2 ring-emerald-500 border-emerald-200' : 'border-slate-200/70 hover:border-emerald-300'}
                      `}
                    >
                      <div className="h-44 sm:h-48 w-full overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                      <div className="p-4 sm:p-5">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset mb-2 ${getCategoryStyle(item.category)}`}>
                          {item.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Detail Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedWaste.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="mt-4 sm:mt-6 rounded-[2rem] border border-emerald-100 bg-white/80 p-4 sm:p-5 lg:p-6 shadow-sm backdrop-blur-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-center">
                
                {/* Image Col */}
                <div className="md:col-span-5 lg:col-span-4">
                  <div className="relative aspect-[16/9] md:aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                    <img 
                      src={selectedWaste.image} 
                      alt={selectedWaste.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset shadow-sm ${getCategoryStyle(selectedWaste.category)} bg-white/95 backdrop-blur`}>
                        {selectedWaste.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Col */}
                <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center space-y-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 mb-1.5">
                      {selectedWaste.name}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {selectedWaste.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 uppercase tracking-wider">Cara Memilah</h4>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed">
                        {selectedWaste.sorting}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </div>
                        <h4 className="font-bold text-[11px] sm:text-xs text-slate-800 uppercase tracking-wider">Pengelolaan</h4>
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed">
                        {selectedWaste.management}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Part 2: Cara Memilah (Timeline Steps) */}
      <div className="bg-[#F8FAFC] py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 mb-4">
              4 Langkah Memilah Sampah
            </h3>
            <p className="text-slate-500 text-base leading-7">
              Ikuti alur sederhana ini untuk memastikan sampahmu ditangani dengan benar.
            </p>
          </motion.div>

          {/* Timeline Steps */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {STEPS.map((step, i) => {
              const IconComponent = step.icon;
              return (
                <motion.div key={i} variants={fadeUp} className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
                  <div className="absolute left-5 right-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-700 shadow-inner">
                      <IconComponent size={22} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                      Step {step.num}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-950">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
