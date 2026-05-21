import { motion } from 'framer-motion';

/* Checkmark bullet icon */
const CheckBullet = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="11" cy="11" r="10" stroke="#2D5016" strokeWidth="1.5" fill="#2D5016" fillOpacity="0.08" />
    <path d="M7 11.5L10 14.5L15.5 8.5" stroke="#2D5016" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Recycle illustration for the card */
const RecycleIllustration = () => (
  <div className="relative flex items-center justify-center">
    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-forest flex items-center justify-center shadow-xl shadow-forest/20">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
        <path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.005-1.775L16.8 9.5" />
        <path d="M14.469 3.592a1.835 1.835 0 00-1.563-.887h-.002a1.834 1.834 0 00-1.563.892L7.196 9.5" />
        <polyline points="9.5 14.5 7.196 9.5 12 9.5" />
        <polyline points="14.5 14.5 16.804 9.5 12 9.5" />
        <polyline points="12 19 9.5 14.5 14.5 14.5" />
      </svg>
    </div>
  </div>
);

/* Feature list data */
const FEATURES = [
  'Deteksi otomatis via kamera atau unggah gambar',
  'Klasifikasi 3 kategori: Anorganik, B3, Organik',
  'Dashboard analitik untuk pengelola fasilitas',
];

/* Animation config */
const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function AboutSection() {
  return (
    <section id="tentang" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-cream-light pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ============ LEFT COLUMN — Text ============ */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div variants={fadeUp} className="mb-5">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full
                              bg-forest/8 border border-forest/15
                              text-forest text-xs sm:text-sm font-semibold tracking-wide">
                Tentang
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold
                         text-heading leading-[1.15] tracking-tight mb-6"
            >
              Apa itu TrashSmart?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-lg"
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
                  className="flex items-start gap-3 text-sm sm:text-base text-body"
                >
                  <CheckBullet />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ============ RIGHT COLUMN — Illustration Card ============ */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm lg:max-w-md">
              <div className="bg-gradient-to-br from-sage-light/40 to-cream-light
                              border border-sage/25 rounded-2xl lg:rounded-3xl
                              p-10 sm:p-14 flex flex-col items-center justify-center
                              shadow-[0_8px_30px_rgba(45,80,22,0.06)]
                              min-h-[280px] sm:min-h-[340px]">
                <div className="absolute inset-0 rounded-2xl lg:rounded-3xl overflow-hidden opacity-[0.03]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #2D5016 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  }}
                />

                <RecycleIllustration />

                <p className="mt-6 text-xl sm:text-2xl font-serif font-bold text-heading tracking-tight">
                  TrashSmart
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted font-medium tracking-wider uppercase">
                  Smart Waste Classification
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
