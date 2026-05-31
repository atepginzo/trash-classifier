import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/* ═══════════════════════════════════════════════════════════ */
/*  DATA                                                        */
/* ═══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {
    name: 'Organik',
    desc: 'Sisa makanan, daun, limbah dapur — mudah terurai secara alami',
    image: '/SAMPAH ORGANIK.jpeg',
    color: '#059669',
    light: '#ECFDF5',
  },
  {
    name: 'Plastik',
    desc: 'Botol, kemasan, gelas plastik — bisa didaur ulang',
    image: '/SAMPAH PELASTIK.jpeg',
    color: '#0284C7',
    light: '#EFF6FF',
  },
  {
    name: 'Kertas',
    desc: 'Kardus, koran, kertas bekas — daur ulang atau kompos',
    image: '/SAMPAH KARDUS.jpeg',
    color: '#D97706',
    light: '#FFFBEB',
  },
  {
    name: 'Kaca',
    desc: 'Botol kaca, toples — 100% bisa didaur ulang tanpa batas',
    image: '/SAMPAH KACA.jpeg',
    color: '#7C3AED',
    light: '#F5F3FF',
  },
  {
    name: 'Logam',
    desc: 'Kaleng, aluminium, besi — nilai jual tinggi di bank sampah',
    image: '/SAMPAH LOGAM.jpeg',
    color: '#475569',
    light: '#F8FAFC',
  },
  {
    name: 'B3 / Elektronik',
    desc: 'Baterai, lampu, gadget rusak — butuh penanganan khusus',
    image: '/SAMPAH B3.jpeg',
    color: '#DC2626',
    light: '#FEF2F2',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Identifikasi Jenis',
    desc: 'Kenali apakah sampah termasuk organik, plastik, kertas, kaca, logam, atau B3.',
    accent: '#059669',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Bersihkan & Keringkan',
    desc: 'Bilas kemasan dari sisa makanan. Lipat kardus agar hemat ruang.',
    accent: '#0284C7',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Pisahkan per Wadah',
    desc: 'Simpan di wadah terpisah: organik, daur ulang, dan residu. Jangan campur B3.',
    accent: '#D97706',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Kelola dengan Tepat',
    desc: 'Kompos organik, setor daur ulang ke bank sampah, kirim B3 ke drop-off resmi.',
    accent: '#7C3AED',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════ */
/*  TIPS PRAKTIS ICONS & DATA                                    */
/* ═══════════════════════════════════════════════════════════ */
const DropIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

const BoxFoldIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="10" y1="14" x2="3" y2="21" />
  </svg>
);

const BatteryIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
    <line x1="22" y1="11" x2="22" y2="13" />
  </svg>
);

const ShieldLockIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const RecycleIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);

const SearchCheckIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="m8 11 2 2 4-4" />
  </svg>
);

const TIPS = [
  { text: 'Bilas botol plastik sebelum dibuang agar tidak terkontaminasi', color: '#0284C7', lightBg: '#F0F9FF', icon: DropIcon },
  { text: 'Lipat kardus rata agar hemat ruang di tempat sampah', color: '#D97706', lightBg: '#FFFBEB', icon: BoxFoldIcon },
  { text: 'Pisahkan baterai bekas — jangan campur dengan sampah biasa', color: '#DC2626', lightBg: '#FEF2F2', icon: BatteryIcon },
  { text: 'Gunakan wadah tertutup untuk sampah organik agar tidak bau', color: '#059669', lightBg: '#ECFDF5', icon: ShieldLockIcon },
  { text: 'Kumpulkan barang daur ulang lalu setor ke bank sampah terdekat', color: '#7C3AED', lightBg: '#F5F3FF', icon: RecycleIcon },
  { text: 'Cek simbol daur ulang pada kemasan plastik sebelum membuang', color: '#475569', lightBg: '#F8FAFC', icon: SearchCheckIcon },
];

/* ═══════════════════════════════════════════════════════════ */
/*  ANIMATIONS                                                  */
/* ═══════════════════════════════════════════════════════════ */
const cardVariant = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const overlayVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

/* ═══════════════════════════════════════════════════════════ */
/*  CATEGORY CARD — hover reveals full description             */
/* ═══════════════════════════════════════════════════════════ */
function CategoryCard({ cat, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={cardVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative overflow-hidden rounded-2xl cursor-default aspect-[4/3]"
      style={{ border: `1.5px solid ${hovered ? cat.color + '60' : 'rgba(255,255,255,0.08)'}` }}
    >
      {/* Photo */}
      <img
        src={cat.image}
        alt={cat.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center
                   transition-transform duration-700 group-hover:scale-110"
      />

      {/* Persistent dark gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Animated color tint on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 0.25 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `radial-gradient(circle at bottom center, ${cat.color}, transparent 70%)` }}
      />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        {/* Category badge — always visible */}
        <span
          className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white mb-2"
          style={{ backgroundColor: cat.color }}
        >
          {cat.name}
        </span>

        {/* Description — slides up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              key="desc"
              variants={overlayVariant}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
              className="text-sm text-white/90 leading-snug"
            >
              {cat.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN SECTION                                               */
/* ═══════════════════════════════════════════════════════════ */
export default function WasteGuideSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="edukasi" className="relative overflow-hidden">

      {/* ══ PART 1: CATEGORY GRID — dark emerald theme ══ */}
      <div className="bg-[#0A1A0F] pt-20 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 relative">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                             bg-emerald-500/10 border border-emerald-500/20
                             text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Panduan Cerdas
            </span>
            <h2 className="text-[2rem] sm:text-[2.6rem] lg:text-[3rem]
                           font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-4">
              Kenali, Pilah, dan Kelola<br className="hidden sm:block" /> Sampah dengan Benar
            </h2>
            <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium" style={{color: 'rgba(255,255,255,0.7)'}}>
              Hover setiap kartu untuk melihat cara pengelolaan masing-masing kategori.
            </p>
          </motion.div>

          {/* 6-card grid — hover reveals desc */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={i} cat={cat} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ══ PART 2: HOW TO SORT — clean white bg ══ */}
      <div className="bg-white dark:bg-black py-20 sm:py-28 transition-colors duration-300" id="cara-pakai-steps">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                             bg-emerald-50 border border-emerald-200/60
                             dark:bg-emerald-950/30 dark:border-emerald-800/30
                             text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              4 Langkah Mudah
            </span>
            <h2 className="text-[2rem] sm:text-[2.6rem] lg:text-[3rem]
                           font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-[-0.025em] transition-colors duration-300">
              Cara Memilah Sampah
            </h2>
          </motion.div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 relative">
            {/* Connector line desktop */}
            <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-emerald-100 dark:bg-emerald-950/40 z-0 transition-colors duration-300" />

            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center text-center px-5 group"
              >
                {/* Icon circle */}
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-5
                             text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)`,
                    boxShadow: `0 8px 24px ${step.accent}30`,
                  }}
                >
                  {step.icon}
                </motion.div>

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                  style={{ color: step.accent }}>
                  Step {step.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 tracking-tight transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed max-w-[200px] transition-colors duration-300">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ PART 3: TIPS — warm off-white strip ══ */}
      <div className="bg-[#F8FAFC] dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-white/5 py-16 sm:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4
                               bg-amber-500/10 border border-amber-500/20
                               text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Tips Praktis
              </span>
              <h2 className="text-[1.8rem] sm:text-[2.2rem] font-extrabold
                             text-slate-900 dark:text-white tracking-[-0.02em] leading-tight transition-colors duration-300">
                Kebiasaan Kecil, <span className="text-gradient">Dampak Besar</span>
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed sm:text-right transition-colors duration-300">
              Tips yang bisa langsung kamu terapkan setiap hari
            </p>
          </motion.div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIPS.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                  }}
                  className="group flex items-start gap-4 p-5 rounded-2xl
                             bg-white dark:bg-[#111111] border border-slate-100/80 dark:border-white/5
                             hover:border-slate-200 dark:hover:border-white/10 hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]
                             transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-6"
                    style={{ backgroundColor: isDark ? `${tip.color}15` : tip.lightBg }}
                  >
                    <Icon color={tip.color} />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
                    {tip.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
