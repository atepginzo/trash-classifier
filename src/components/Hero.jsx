import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewCard from './PreviewCard';
import { fadeIn, fadeUp, slideInRight } from '../lib/animations';
import { useTheme } from '../contexts/ThemeContext';

const HEADLINES = [
  { line1: 'Kelola Sampah',       line2: 'Lebih Cerdas' },
  { line1: 'Deteksi Limbah',      line2: 'Dalam Hitungan Detik' },
  { line1: 'AI yang Peduli',      line2: 'Bumi Lebih Bersih' },
  { line1: 'Pilah Sampah',        line2: 'Selamatkan Lingkungan' },
  { line1: 'Teknologi Hijau',     line2: 'Untuk Masa Depan' },
];

const ScanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V4a1 1 0 011-1h3M13 3h3a1 1 0 011 1v3M17 13v3a1 1 0 01-1 1h-3M7 17H4a1 1 0 01-1-1v-3" />
    <circle cx="10" cy="10" r="3" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 9v4.5" />
    <circle cx="10" cy="7" r="0.5" fill="currentColor" />
  </svg>
);

const STATS = [
  { value: '99%', label: 'Akurasi AI' },
  { value: '< 3s', label: 'Waktu Deteksi' },
  { value: '6', label: 'Kategori Sampah' },
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const line1 = HEADLINES[idx].line1;
    const line2 = HEADLINES[idx].line2;
    const totalLength = line1.length + line2.length;

    if (!isDeleting && subIdx < totalLength) {
      const timeout = setTimeout(() => {
        setSubIdx((prev) => prev + 1);
        setTypingSpeed(80);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && subIdx > 0) {
      const timeout = setTimeout(() => {
        setSubIdx((prev) => prev - 1);
        setTypingSpeed(45); // Erase faster
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && subIdx === totalLength) {
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2500); // Pause for 2.5s when fully typed
      return () => clearTimeout(timeout);
    } else if (isDeleting && subIdx === 0) {
      setIsDeleting(false);
      setIdx((prev) => (prev + 1) % HEADLINES.length);
      setTypingSpeed(80);
    }
  }, [subIdx, isDeleting, idx, typingSpeed]);

  const line1 = HEADLINES[idx].line1;
  const line2 = HEADLINES[idx].line2;
  const L1 = line1.length;

  const typedLine1 = subIdx <= L1 ? line1.substring(0, subIdx) : line1;
  const typedLine2 = subIdx > L1 ? line2.substring(0, subIdx - L1) : '';
  const showCursorLine1 = subIdx <= L1;
  const showCursorLine2 = subIdx > L1;

  return (
    <section id="beranda"
      className={`relative min-h-screen flex items-center overflow-hidden
                  pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-24 lg:pb-16 transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>

      {/* ── Background dots only (no color blobs/gradients) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 opacity-[0.03] ${
          isDark ? 'opacity-[0.06]' : 'opacity-[0.025]'
        }`}
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? '#10B981' : '#059669'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ══ LEFT COLUMN ══ */}
          <div>
            {/* Eyebrow badge */}
            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="mb-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full
                               text-xs font-semibold tracking-widest uppercase border ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200/70 text-emerald-700'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Didukung Teknologi AI
              </span>
            </motion.div>

            {/* Animated headline with typewriter effect */}
            <div className="relative min-h-[7rem] sm:min-h-[8rem] lg:min-h-[9rem] mb-3">
              <h1
                className={`text-[2.4rem] sm:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem]
                           font-extrabold leading-[1.05] tracking-[-0.025em] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {typedLine1}
                {showCursorLine1 && (
                  <span className="inline-block w-[3px] h-[0.85em] bg-emerald-500 ml-1 align-middle animate-pulse" />
                )}
                <br />
                <span className="text-gradient">
                  {typedLine2}
                  {showCursorLine2 && (
                    <span className="inline-block w-[3px] h-[0.85em] bg-emerald-500 ml-1 align-middle animate-pulse" />
                  )}
                </span>
              </h1>
            </div>

            {/* Sub text */}
            <motion.p variants={fadeUp} initial="hidden" animate="visible"
              transition={{ delay: 0.2 }}
              className={`text-base sm:text-lg lg:text-xl leading-relaxed mb-4 max-w-lg font-medium ${
                isDark ? 'text-white/55' : 'text-slate-500'
              }`}>
              Unggah foto sampah dan dapatkan klasifikasi instan menggunakan
              teknologi AI — cepat, akurat, dan berbasis data.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible"
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-7">
              <motion.a
                href="/upload"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5
                           bg-emerald-600 text-white font-semibold text-base
                           rounded-full shadow-xl shadow-emerald-600/25
                           hover:bg-emerald-500 hover:shadow-emerald-600/35
                           transition-all duration-300 cursor-pointer"
              >
                <ScanIcon /> Mulai Scan Sampah
              </motion.a>
              <motion.a
                href="#tentang"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-2 px-6 py-3.5
                           font-semibold text-base rounded-full
                           transition-all duration-300 cursor-pointer border ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <InfoIcon /> Cara Kerja
              </motion.a>
            </motion.div>

            {/* Stats strip */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible"
              transition={{ delay: 0.45 }}
              className="flex items-center gap-5 sm:gap-7">
              {STATS.map((s, i) => (
                <div key={i} className={`flex flex-col ${
                  i > 0 ? `border-l pl-5 sm:pl-7 ${isDark ? 'border-white/15' : 'border-slate-200'}` : ''
                }`}>
                  <span className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-none ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {s.value}
                  </span>
                  <span className={`text-xs font-medium mt-1 ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <motion.div
            variants={slideInRight} initial="hidden" animate="visible"
            transition={{ delay: 0.15 }}
            className="flex justify-center lg:justify-end items-center"
          >
            <PreviewCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
