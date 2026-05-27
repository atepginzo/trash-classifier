import { motion } from 'framer-motion';
import Logo from './Logo';

/* Checkmark bullet icon */
const CheckBullet = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="11" cy="11" r="10" stroke="#059669" strokeWidth="1.5" fill="#059669" fillOpacity="0.08" />
    <path d="M7 11.5L10 14.5L15.5 8.5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Feature list data */
const FEATURES = [
  'Deteksi otomatis via kamera atau unggah gambar',
  'Klasifikasi 3 kategori: Anorganik, B3, Organik',
  'Dashboard analitik untuk pengelola fasilitas',
];

/* Animation config */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutSection() {
  return (
    <section id="tentang" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] to-white pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ============ LEFT COLUMN — Text ============ */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                         text-slate-900 leading-[1.15] tracking-tight mb-6"
            >
              Apa itu <span className="text-gradient">TrashSmart</span>?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-lg"
            >
              TrashSmart adalah sistem klasifikasi sampah cerdas yang membantu
              organisasi pengelola limbah mengidentifikasi dan memilah jenis sampah
              secara otomatis — cepat, akurat, dan berbasis data.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4">
              {FEATURES.map((feature, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-sm sm:text-base text-slate-600"
                >
                  <CheckBullet />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ============ RIGHT COLUMN — Photo ============ */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative flex items-center justify-center w-full max-w-sm lg:max-w-md">
              <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
              <div className="relative transition-transform duration-500 ease-out hover:scale-110 hover:-rotate-3 active:scale-105">
                <div className="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 flex items-center justify-center drop-shadow-2xl">
                  <Logo size="100%" variant="default" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
