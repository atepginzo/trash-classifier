import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewCard from './PreviewCard';

/* Rotating headline phrases */
const HEADLINES = [
  { words: ['Kelola', 'Sampah', 'Lebih', 'Cerdas', 'dengan', 'AI'], accents: new Set(['Sampah', 'Cerdas']) },
  { words: ['Kenali', 'Jenis', 'Limbah', 'dalam', 'Hitungan', 'Detik'], accents: new Set(['Limbah', 'Detik']) },
  { words: ['Deteksi', 'Kategori', 'Sampah', 'Secara', 'Otomatis'], accents: new Set(['Kategori', 'Otomatis']) },
];

/* Scan/detect icon for CTA */
const ScanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V4a1 1 0 011-1h3" />
    <path d="M13 3h3a1 1 0 011 1v3" />
    <path d="M17 13v3a1 1 0 01-1 1h-3" />
    <path d="M7 17H4a1 1 0 01-1-1v-3" />
    <circle cx="10" cy="10" r="3" />
  </svg>
);

/* Info icon for secondary CTA */
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 9v4.5" />
    <circle cx="10" cy="7" r="0.5" fill="currentColor" />
  </svg>
);

/* Down arrow for scroll indicator */
const ScrollArrow = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 4v12M5 12l5 5 5-5" />
  </svg>
);

export default function Hero() {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  /* Cycle through headlines every 4 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentHeadline = HEADLINES[headlineIndex];

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 lg:pt-28"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-teal-100/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full bg-sky-100/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-8 sm:py-12">

          {/* ============ LEFT COLUMN ============ */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                              bg-emerald-50 border border-emerald-200/60
                              text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-amber-500">
                  <path d="M8 0l2 5h5l-4 3.5 1.5 5L8 10.5 3.5 13.5 5 8.5 1 5h5z"/>
                </svg>
                Didukung Teknologi AI
              </span>
            </motion.div>
            <div className="relative min-h-[180px] sm:min-h-[200px] lg:min-h-[220px] xl:min-h-[250px] mb-5 sm:mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl
                             leading-[1.1] tracking-tight text-slate-900 absolute inset-0
                             font-extrabold"
                >
                  {currentHeadline.words.map((word, i) => (
                    <span
                      key={i}
                      className={`inline-block mr-[0.3em] ${
                        currentHeadline.accents.has(word)
                          ? 'text-gradient'
                          : ''
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </motion.h1>
              </AnimatePresence>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 sm:mb-10 max-w-md"
            >
              Unggah foto sampah dan dapatkan klasifikasi instan menggunakan
              teknologi AI. Temukan cara pengelolaan yang tepat untuk setiap jenis limbah.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap gap-3 sm:gap-4 mb-12 sm:mb-16"
            >
              <a
                href="/upload"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5
                           bg-emerald-600 text-white font-semibold text-sm sm:text-base
                           rounded-full shadow-lg shadow-emerald-600/25
                           hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30
                           hover:-translate-y-0.5 transition-all duration-300"
              >
                <ScanIcon />
                Mulai Scan Sampah
              </a>
              <a
                href="#tentang"
                className="group inline-flex items-center gap-2 px-6 py-3.5
                           border border-slate-200 text-slate-700 font-semibold text-sm sm:text-base
                           rounded-full hover:bg-slate-50 hover:border-slate-300
                           hover:-translate-y-0.5 transition-all duration-300"
              >
                <InfoIcon />
                Cara Kerja
              </a>
            </motion.div>
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <div className="flex justify-center lg:justify-end">
            <PreviewCard />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="hidden sm:flex flex-col items-center gap-2 text-slate-400 pb-8"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <div className="animate-bounce-slow text-emerald-400">
            <ScrollArrow />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
