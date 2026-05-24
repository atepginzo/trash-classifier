import { motion } from 'framer-motion';

/* Step icon SVGs */
const UploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
    <rect x="8" y="10" width="32" height="28" rx="3" />
    <path d="M8 32l8-10 6 6 8-12 10 16" />
    <path d="M24 6v12M20 10l4-4 4 4" strokeWidth="2" />
    <circle cx="32" cy="18" r="3" />
  </svg>
);

const AIIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
    <rect x="14" y="14" width="20" height="20" rx="3" />
    <rect x="19" y="19" width="10" height="10" rx="1.5" />
    <circle cx="24" cy="24" r="2" fill="currentColor" fillOpacity="0.3" />
    <path d="M20 14v-4M24 14v-4M28 14v-4" />
    <path d="M20 34v4M24 34v4M28 34v4" />
    <path d="M14 20h-4M14 24h-4M14 28h-4" />
    <path d="M34 20h4M34 24h4M34 28h4" />
  </svg>
);

const ResultIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
    <path d="M14 36V24" strokeWidth="3" strokeLinecap="round" />
    <path d="M24 36V16" strokeWidth="3" strokeLinecap="round" />
    <path d="M34 36V20" strokeWidth="3" strokeLinecap="round" />
    <path d="M8 36h32" />
    <path d="M10 28l8-6 8 4 12-10" strokeWidth="1.2" strokeDasharray="3 2" />
  </svg>
);

/* Steps data */
const STEPS = [
  {
    number: '1.',
    title: 'Unggah atau Foto',
    description: 'Gunakan kamera perangkat atau unggah gambar sampah dari galeri. Pastikan objek terlihat jelas untuk hasil terbaik.',
    Icon: UploadIcon,
    bgColor: 'from-sage-light/50 to-sage-muted/30',
  },
  {
    number: '2.',
    title: 'Analisis dengan AI',
    description: 'Sistem mendeteksi objek sampah menggunakan model YOLOv8. Tunggu beberapa detik hingga hasil muncul.',
    Icon: AIIcon,
    bgColor: 'from-[#C5E8D8]/40 to-[#E0F0E8]/30',
  },
  {
    number: '3.',
    title: 'Lihat Hasil Lengkap',
    description: 'Tampil kategori sampah, bounding box, dan confidence score. Data tersimpan otomatis ke dashboard analitik.',
    Icon: ResultIcon,
    bgColor: 'from-cream-light to-sage-light/20',
  },
];

/* Animation config */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HowItWorks() {
  return (
    <section id="cara-pakai" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-cream-light">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                          bg-forest/8 border border-forest/15
                          text-forest text-xs sm:text-sm font-semibold tracking-wide">
            Cara Pakai
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold
                         text-heading leading-[1.15] tracking-tight">
            Panduan penggunaan aplikasi
          </h2>
        </motion.div>

        {/* 3 Step Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative bg-white border border-sage/20 rounded-2xl overflow-hidden
                         shadow-[0_2px_20px_rgba(0,0,0,0.03)]
                         hover:shadow-[0_12px_40px_rgba(45,80,22,0.08)]
                         transition-shadow duration-400"
            >
              <div className="absolute top-5 left-6 z-10">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-forest/80">
                  {step.number}
                </span>
              </div>
              <div className={`relative bg-gradient-to-br ${step.bgColor} px-6 pt-14 pb-8 flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #2D5016 0.8px, transparent 0.8px)',
                    backgroundSize: '14px 14px',
                  }}
                />
                <step.Icon />
              </div>
              <div className="px-6 py-6">
                <h3 className="text-base sm:text-lg font-bold text-heading mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
