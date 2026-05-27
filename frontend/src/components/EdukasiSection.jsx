import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RecycleIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
    <path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.005-1.775L16.8 9.5" />
    <path d="M14.469 3.592a1.835 1.835 0 00-1.563-.887h-.002a1.834 1.834 0 00-1.563.892L7.196 9.5" />
    <polyline points="9.5 14.5 7.196 9.5 12 9.5" />
    <polyline points="14.5 14.5 16.804 9.5 12 9.5" />
    <polyline points="12 19 9.5 14.5 14.5 14.5" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LeafIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
    <path d="M17 8a14 14 0 004-6 14 14 0 00-6 4" />
    <path d="M17 8C13 12 8 17 3.82 21.34" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WASTE_CLASSES = [
  {
    name: 'Anorganik',
    iconColor: 'text-sky-700 dark:text-sky-400',
    iconBg: 'bg-sky-100 dark:bg-sky-950/30',
    headerBg: 'bg-sky-50 dark:bg-[#0c1622]',
    borderColor: 'border-sky-200 dark:border-sky-900/40',
    badgeColor: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400',
    Icon: RecycleIcon,
    deskripsi: 'Sampah tidak dapat terurai secara biologis namun masih dapat didaur ulang.',
    contoh: ['Botol plastik', 'Kaleng aluminium', 'Kaca', 'Kertas bekas', 'Kardus'],
    penanganan: 'Pisahkan per material, bersihkan dari sisa makanan, kumpulkan di bank sampah atau penampung daur ulang.',
    nilaiDaurUlang: 'Tinggi',
  },
  {
    name: 'B3',
    subtitle: 'Bahan Berbahaya dan Beracun',
    iconColor: 'text-red-700 dark:text-red-400',
    iconBg: 'bg-red-100 dark:bg-red-950/30',
    headerBg: 'bg-red-50 dark:bg-[#1a0f0f]',
    borderColor: 'border-red-200 dark:border-red-900/40',
    badgeColor: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400',
    Icon: AlertTriangleIcon,
    deskripsi: 'Sampah mengandung zat berbahaya yang berpotensi merusak lingkungan dan kesehatan manusia.',
    contoh: ['Baterai', 'Lampu neon', 'Cat bekas', 'Pestisida', 'Obat kadaluarsa', 'Elektronik rusak'],
    penanganan: 'JANGAN campur dengan sampah lain. Antar ke fasilitas pengelolaan B3 resmi atau drop-off khusus.',
    nilaiDaurUlang: 'Butuh penanganan khusus',
  },
  {
    name: 'Organik',
    iconColor: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/30',
    headerBg: 'bg-emerald-50 dark:bg-[#0d1612]',
    borderColor: 'border-emerald-200 dark:border-emerald-900/40',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    Icon: LeafIcon,
    deskripsi: 'Sampah berasal dari makhluk hidup dan dapat terurai secara alami oleh mikroorganisme.',
    contoh: ['Sisa makanan', 'Sayuran', 'Buah', 'Daun', 'Ranting', 'Kertas tisu bekas makanan'],
    penanganan: 'Buat kompos rumahan atau masukkan ke tempat sampah organik komunal untuk diolah menjadi pupuk.',
    nilaiDaurUlang: 'Bisa dijadikan kompos bernilai tinggi',
  },
];

const TIPS = [
  {
    emoji: '🗑️',
    teks: 'Selalu sediakan 3 tempat sampah terpisah di rumah',
  },
  {
    emoji: '🧹',
    teks: 'Bersihkan kemasan sebelum dibuang agar tidak terkontaminasi',
  },
  {
    emoji: '♻️',
    teks: 'Cek simbol daur ulang pada kemasan plastik sebelum memilah',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export default function EdukasiSection() {
  return (
    <section id="edukasi" className="pt-20 lg:pt-28 bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-center px-4 mb-10 sm:mb-14"
      >
        <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                        bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30
                        text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-300">
          Panduan Pemilahan
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                       text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-4 transition-colors duration-300">
          Kenali Jenis Sampahmu
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          Pahami perbedaan sampah Anorganik, B3, dan Organik agar proses daur ulang lebih efektif
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-7 sm:pb-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {WASTE_CLASSES.map((kelas) => (
            <motion.div
              key={kelas.name}
              variants={fadeUp}
              className={`bg-white dark:bg-[#111111] border rounded-2xl overflow-hidden
                         shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.5)]
                         hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.8)]
                         transition-all duration-300 flex flex-col ${kelas.borderColor}`}
            >
              <div
                className={`px-5 sm:px-6 pt-6 pb-5 flex items-center gap-4 ${kelas.headerBg} transition-colors duration-300`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${kelas.iconBg} ${kelas.iconColor} transition-colors duration-300`}
                >
                  <kelas.Icon />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${kelas.iconColor} transition-colors duration-300`}>
                    {kelas.name}
                  </h3>
                  {kelas.subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 transition-colors duration-300">{kelas.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="px-5 sm:px-6 py-5 flex flex-col flex-1 bg-white dark:bg-[#111111] transition-colors duration-300">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 transition-colors duration-300">
                  {kelas.deskripsi}
                </p>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 transition-colors duration-300">
                    Contoh
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {kelas.contoh.map((item) => (
                      <span
                        key={item}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${kelas.badgeColor}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 transition-colors duration-300">
                    Penanganan
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                    {kelas.penanganan}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider transition-colors duration-300">
                      Nilai Daur Ulang
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full transition-colors duration-300 ${kelas.badgeColor}`}>
                      {kelas.nilaiDaurUlang}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="py-12 sm:py-16 lg:py-20 bg-emerald-50/30 dark:bg-[#0a0a0a] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mb-8 sm:mb-10"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                            bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30
                            text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide transition-colors duration-300">
              Tips Praktis
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold
                           text-slate-900 dark:text-white leading-[1.15] tracking-tight transition-colors duration-300">
              Tips Pemilahan Sampah
            </h3>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white dark:bg-[#111111] border border-slate-200/60 dark:border-white/5 rounded-xl p-5 sm:p-6
                           flex items-start gap-4
                           shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-colors duration-300"
              >
                <span className="text-2xl shrink-0 mt-0.5">{tip.emoji}</span>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                    <CheckIcon />
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">
                    {tip.teks}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
