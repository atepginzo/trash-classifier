import { motion } from 'framer-motion';
import uploadGambar from '../assets/guide/upload-photo.png';
import analisisAI from '../assets/guide/ai-analysis.png';
import lihatHasil from '../assets/guide/full-result.png';

const tutorialVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

/* Steps data */
const STEPS = [
  {
    number: '01',
    title: 'Unggah atau Foto',
    description: 'Gunakan kamera perangkat atau unggah gambar sampah dari galeri. Pastikan objek terlihat jelas untuk hasil terbaik.',
    image: uploadGambar,
    iconColor: '#059669',
  },
  {
    number: '02',
    title: 'Analisis dengan AI',
    description: 'Sistem mendeteksi objek sampah menggunakan model CNN. Tunggu beberapa detik hingga hasil muncul.',
    image: analisisAI,
    iconColor: '#0D9488',
  },
  {
    number: '03',
    title: 'Lihat Hasil Lengkap',
    description: 'Tampil kategori sampah, confidence score, dan rekomendasi pengelolaan. Data tersimpan otomatis ke riwayat.',
    image: lihatHasil,
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
          className="mb-14 sm:mb-20 text-center lg:text-left"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            Panduan penggunaan aplikasi
          </h2>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="relative">
          {/* Fluid flow line (Desktop) */}
          <div className="hidden md:block absolute top-[100px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-60 z-0 rounded-full" />
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative bg-white/75 border border-white/70 rounded-3xl overflow-hidden
                           shadow-sm backdrop-blur-xl
                           hover:shadow-xl hover:shadow-emerald-500/10
                           transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-emerald-50/50">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
                  
                  {/* Step number overlaid on image */}
                  <div className="absolute bottom-4 left-5">
                    <span className="text-3xl font-extrabold text-white opacity-90 tracking-tighter">
                      {step.number}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Video Tutorial Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-10 lg:mt-14 rounded-[2rem] border border-slate-200/70 bg-white p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="mb-5 sm:mb-6">
              <h3 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight">
                Video Tutorial Penggunaan Aplikasi
              </h3>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-slate-100 ring-1 ring-slate-900/5">
              <iframe
                className="aspect-video w-full"
                src={tutorialVideoUrl}
                title="Panduan Penggunaan Aplikasi TrashSmart"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
