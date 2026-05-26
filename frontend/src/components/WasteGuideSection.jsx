import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  {
    name: 'Organik',
    desc: 'Sisa makanan, daun, limbah dapur — mudah terurai secara alami',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&h=500&fit=crop',
    color: '#059669',
    bg: '#ECFDF5',
    emoji: '🍂',
    span: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2',
    imgH: 'h-64 sm:h-72 lg:h-full',
  },
  {
    name: 'Plastik',
    desc: 'Botol, kemasan, gelas plastik — bisa didaur ulang',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=500&h=400&fit=crop',
    color: '#0284C7',
    bg: '#F0F9FF',
    emoji: '♻️',
    span: 'col-span-1',
    imgH: 'h-40 sm:h-44',
  },
  {
    name: 'Kertas',
    desc: 'Kardus, koran, kertas bekas — daur ulang atau kompos',
    image: 'https://images.unsplash.com/photo-1585351737793-55b3d67e4448?w=500&h=400&fit=crop&q=80',
    color: '#D97706',
    bg: '#FFFBEB',
    emoji: '📄',
    span: 'col-span-1',
    imgH: 'h-40 sm:h-44',
  },
  {
    name: 'Kaca',
    desc: 'Botol kaca, toples — 100% bisa didaur ulang tanpa batas',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=400&fit=crop',
    color: '#7C3AED',
    bg: '#F5F3FF',
    emoji: '🫙',
    span: 'col-span-1',
    imgH: 'h-40 sm:h-44',
  },
  {
    name: 'Logam',
    desc: 'Kaleng, aluminium, besi — nilai jual tinggi di bank sampah',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500&h=400&fit=crop&crop=left',
    color: '#475569',
    bg: '#F8FAFC',
    emoji: '🥫',
    span: 'col-span-1',
    imgH: 'h-40 sm:h-44',
  },
  {
    name: 'B3 / Elektronik',
    desc: 'Baterai, lampu, gadget rusak — butuh penanganan khusus',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&h=400&fit=crop',
    color: '#DC2626',
    bg: '#FEF2F2',
    emoji: '⚠️',
    span: 'col-span-1 sm:col-span-2 lg:col-span-2',
    imgH: 'h-40 sm:h-48',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Identifikasi Jenis',
    desc: 'Kenali apakah sampah termasuk organik, plastik, kertas, kaca, logam, atau B3.',
    icon: '🔍',
    accent: '#059669',
  },
  {
    num: '02',
    title: 'Bersihkan & Keringkan',
    desc: 'Bilas kemasan dari sisa makanan. Lipat kardus agar hemat ruang.',
    icon: '🧹',
    accent: '#0284C7',
  },
  {
    num: '03',
    title: 'Pisahkan per Wadah',
    desc: 'Simpan di wadah terpisah: organik, daur ulang, dan residu. Jangan campur B3.',
    icon: '🗑️',
    accent: '#D97706',
  },
  {
    num: '04',
    title: 'Kelola dengan Tepat',
    desc: 'Kompos organik, setor daur ulang ke bank sampah, dan kirim B3 ke drop-off resmi.',
    icon: '♻️',
    accent: '#7C3AED',
  },
];

const TIPS = [
  { emoji: '💧', text: 'Bilas botol plastik sebelum dibuang agar tidak terkontaminasi' },
  { emoji: '📦', text: 'Lipat kardus rata agar hemat ruang di tempat sampah' },
  { emoji: '🔋', text: 'Pisahkan baterai bekas — jangan campur dengan sampah rumah tangga' },
  { emoji: '🥬', text: 'Gunakan wadah tertutup untuk sampah organik agar tidak bau' },
  { emoji: '🏦', text: 'Kumpulkan barang daur ulang lalu setor ke bank sampah terdekat' },
  { emoji: '🏷️', text: 'Cek simbol daur ulang pada kemasan plastik sebelum membuang' },
];

/* ═══════════════════════════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function WasteGuideSection() {
  return (
    <section id="edukasi" className="relative overflow-hidden">

      {/* ────────────────────────────────────────────────────────────
          PART 1: HEADER + BENTO GRID (Kenali Kategori Sampah)
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-slate-900 pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-16 lg:mb-20"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                            bg-emerald-500/15 border border-emerald-500/25
                            text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
              📚 Panduan Cerdas
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold
                           text-white leading-[1.12] tracking-tight mb-5">
              Kenali, Pilah, dan Kelola<br className="hidden sm:block" /> Sampah dengan Benar
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Pelajari 6 kategori sampah, cara memilah yang tepat,
              dan tips praktis yang bisa langsung kamu terapkan sehari-hari.
            </p>
          </motion.div>

          {/* ═════ BENTO GRID ═════ */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-auto"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`group relative overflow-hidden rounded-2xl
                           border border-white/10 hover:border-emerald-500/40
                           transition-all duration-500 cursor-default ${cat.span}`}
              >
                {/* Photo */}
                <div className={`relative overflow-hidden ${cat.imgH}`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700
                               group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-base shrink-0"
                      style={{ backgroundColor: cat.bg }}
                    >
                      {cat.emoji}
                    </span>
                    <div className="min-w-0">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white mb-1.5"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.name}
                      </span>
                      <p className="text-sm text-slate-300 leading-snug line-clamp-2">{cat.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at bottom center, ${cat.color}15, transparent 70%)`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          PART 2: CARA MEMILAH (Timeline Steps)
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-[#F8FAFC] py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14 sm:mb-16"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                            bg-emerald-50 border border-emerald-200/60
                            text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide">
              Langkah Pemilahan
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold
                           text-slate-900 leading-[1.15] tracking-tight mb-4">
              4 Langkah Memilah Sampah
            </h3>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Ikuti alur sederhana ini untuk memastikan sampahmu ditangani dengan benar
            </p>
          </motion.div>

          {/* Timeline Steps */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0"
          >
            {STEPS.map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="relative">
                {/* Connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+28px)] right-0 h-[2px]">
                    <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100" />
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-center text-center px-4 group">
                  {/* Number circle */}
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center
                               text-white text-lg sm:text-xl font-bold mb-5
                               shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{
                      background: `linear-gradient(135deg, ${step.accent}, ${step.accent}CC)`,
                      boxShadow: `0 8px 24px ${step.accent}30`,
                    }}
                  >
                    <span className="text-xl">{step.icon}</span>
                  </div>
                  {/* Step number label */}
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: step.accent }}
                  >
                    Step {step.num}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          PART 3: TIPS PRAKTIS (Compact Strip)
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12"
          >
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full mb-4
                              bg-amber-50 border border-amber-200/60
                              text-amber-700 text-xs sm:text-sm font-semibold tracking-wide">
                💡 Tips Praktis
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Kebiasaan Kecil, Dampak Besar
              </h3>
            </div>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Tips sederhana yang bisa langsung kamu terapkan di rumah setiap hari
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group flex items-start gap-4 p-5 rounded-2xl
                           bg-slate-50/70 border border-slate-100
                           hover:bg-white hover:border-emerald-200/60
                           hover:shadow-[0_4px_20px_rgba(5,150,105,0.06)]
                           transition-all duration-300"
              >
                <span className="text-2xl shrink-0 mt-0.5
                               group-hover:scale-110 transition-transform duration-300">
                  {tip.emoji}
                </span>
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{tip.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
