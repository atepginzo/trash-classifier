import { motion } from 'framer-motion';
import Logo from './Logo';
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from '../lib/animations';

const CheckBullet = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="9" stroke="#059669" strokeWidth="1.5" fill="#059669" fillOpacity="0.1" />
    <path d="M6.5 10.5L9 13L13.5 8" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FEATURES = [
  'Deteksi otomatis via kamera atau unggah gambar',
  'Klasifikasi 6 kategori: Organik, Plastik, Kertas, Kaca, Logam, B3',
  'Dashboard analitik untuk pengelola fasilitas',
];

export default function AboutSection() {
  return (
    <section id="tentang" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white dark:from-black dark:to-[#0a0a0a] transition-colors duration-300 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT: Text ── */}
          <motion.div
            variants={slideInLeft} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full
                               bg-emerald-50 border border-emerald-200/60
                               dark:bg-emerald-950/30 dark:border-emerald-800/30
                               text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase">
                Tentang Kami
              </span>
            </div>

            <h2 className="text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem]
                           font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-[-0.025em] mb-6">
              Apa itu{' '}
              <span className="text-gradient">TrashSmart</span>?
            </h2>

            <p className="text-lg sm:text-xl text-slate-500 dark:text-white/60 leading-relaxed mb-10 max-w-lg font-medium">
              TrashSmart adalah sistem klasifikasi sampah cerdas yang membantu
              organisasi pengelola limbah mengidentifikasi dan memilah jenis sampah
              secara otomatis — cepat, akurat, dan berbasis data.
            </p>

            <motion.ul
              variants={staggerContainer} initial="hidden"
              whileInView="visible" viewport={{ once: true, margin: '-80px' }}
              className="space-y-5"
            >
              {FEATURES.map((f, i) => (
                <motion.li key={i} variants={fadeUp}
                  className="flex items-start gap-3.5 text-base sm:text-lg text-slate-600 dark:text-white/70 font-medium">
                  <CheckBullet />
                  <span>{f}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── RIGHT: Visual ── */}
          <motion.div
            variants={slideInRight} initial="hidden"
            whileInView="visible" viewport={{ once: true, margin: '-80px' }}
            className="flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-sm lg:max-w-md">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br
                              from-emerald-200/40 to-teal-200/20 dark:from-emerald-500/10 dark:to-teal-500/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem]
                              bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50
                              dark:from-[#111111] dark:via-[#0d0d0d] dark:to-[#161616]
                              border border-emerald-100/80 dark:border-white/5
                              shadow-[0_24px_64px_rgba(5,150,105,0.12)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.5)]
                              flex items-center justify-center h-[280px] sm:h-[360px] lg:h-[420px] transition-colors duration-300">
                {/* Decorative circles */}
                <div className="absolute top-6 right-6 w-20 h-20 rounded-full
                                bg-emerald-100/60 dark:bg-emerald-500/5 blur-xl" />
                <div className="absolute bottom-8 left-8 w-28 h-28 rounded-full
                                bg-teal-100/50 dark:bg-teal-500/5 blur-xl" />
                <Logo size={150} className="animate-float relative z-10" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
