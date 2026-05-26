import { motion } from 'framer-motion';

/* Steps data */
const STEPS = [
  {
    number: '01',
    title: 'Unggah atau Foto',
    description: 'Gunakan kamera perangkat atau unggah gambar sampah dari galeri. Pastikan objek terlihat jelas untuk hasil terbaik.',
    image: '/cara-pakai/unggah.png',
    fallbackImage: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=400&h=300&fit=crop',
    iconColor: '#059669',
  },
  {
    number: '02',
    title: 'Analisis dengan AI',
    description: 'Sistem mendeteksi objek sampah menggunakan model CNN. Tunggu beberapa detik hingga hasil muncul.',
    image: '/cara-pakai/analisis.png',
    fallbackImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    iconColor: '#0D9488',
  },
  {
    number: '03',
    title: 'Lihat Hasil Lengkap',
    description: 'Tampil kategori sampah, confidence score, dan rekomendasi pengelolaan. Data tersimpan otomatis ke riwayat.',
    image: '/cara-pakai/hasil.png',
    fallbackImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    iconColor: '#0284C7',
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
    <section id="cara-pakai" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                          bg-emerald-50 border border-emerald-200/60
                          text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide">
            Cara Pakai
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                         text-slate-900 leading-[1.15] tracking-tight">
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
              className="group relative bg-white border border-slate-200/60 rounded-2xl overflow-hidden
                         shadow-[0_2px_20px_rgba(0,0,0,0.04)]
                         hover:shadow-[0_12px_40px_rgba(5,150,105,0.1)]
                         transition-shadow duration-400"
            >
              {/* Step number badge */}
              <div className="absolute top-5 left-6 z-10">
                <span
                  className="text-sm font-extrabold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: step.iconColor }}
                >
                  {step.number}
                </span>
              </div>

              {/* Image area */}
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-50">
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = step.fallbackImage;
                    e.target.className = 'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105';
                  }}
                />
              </div>

              <div className="px-6 py-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
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
