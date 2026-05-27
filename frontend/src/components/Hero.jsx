import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import heroImage from '../assets/hero/hero-recycling.png';

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
      className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden pt-12 md:pt-14 pb-12 md:pb-14 bg-gradient-to-br from-white via-emerald-50/60 to-cyan-50/70"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-emerald-100/30 blur-[120px]" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-cyan-100/40 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-8 sm:py-12">

          {/* ============ LEFT COLUMN ============ */}
          <div className="max-w-xl -translate-y-4 md:-translate-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center rounded-full border border-emerald-100 bg-white/75 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
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
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-emerald-600 px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 active:scale-95"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center gap-2.5">
                  <ScanIcon />
                  Mulai Scan Sampah
                </span>
              </a>
              <a
                href="#tentang"
                className="group inline-flex items-center gap-2 px-6 py-3.5
                           rounded-full bg-white/60 border border-emerald-100/50 text-emerald-800 font-semibold text-sm sm:text-base
                           backdrop-blur-md shadow-sm
                           hover:bg-white hover:border-emerald-200
                           hover:-translate-y-0.5 transition-all duration-300"
              >
                <InfoIcon />
                Lihat Panduan
              </a>
            </motion.div>
          </div>

          {/* ============ RIGHT COLUMN ============ */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg lg:max-w-xl -translate-y-2 md:-translate-y-4"
            >
              <div className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/40 p-1 shadow-[12px_16px_32px_-4px_rgba(5,150,105,0.15)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[16px_20px_40px_-4px_rgba(5,150,105,0.2)]">
                <div className="relative overflow-hidden rounded-3xl h-[400px] sm:h-[480px]">
                  <img
                    src={heroImage}
                    alt="Pilah Sampah"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating mini glass card overlay */}
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-md shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-inner">
                        <ScanIcon />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-50">Akurasi AI</p>
                        <p className="text-xl font-bold text-white tracking-tight">91.5%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative circle behind the image */}
              <div className="absolute -bottom-10 -right-10 -z-10 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-200 to-cyan-200 blur-3xl opacity-50" />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
