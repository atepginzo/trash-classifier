import { motion } from 'framer-motion';

/* Category icons */
const PlasticIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8l1 5H7l1-5z" /><path d="M7 7v13a2 2 0 002 2h6a2 2 0 002-2V7" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);
const PaperIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
  </svg>
);
const MetalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);
const ResidueIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CATEGORIES = [
  { name: 'Plastik', desc: 'Botol, kantong, wadah plastik berbagai jenis', Icon: PlasticIcon, bg: 'bg-[#E8EDDF]' },
  { name: 'Kertas', desc: 'Kardus, koran, kertas kantor & kemasan', Icon: PaperIcon, bg: 'bg-[#E0ECFF]' },
  { name: 'Logam', desc: 'Kaleng, besi, aluminium bekas pakai', Icon: MetalIcon, bg: 'bg-[#FFE0E0]' },
  { name: 'Residu', desc: 'Sampah campuran yang tidak dapat didaur ulang', Icon: ResidueIcon, bg: 'bg-[#EDEDED]' },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function CategoriesSection() {
  return (
    <section id="kategori" className="relative py-20 sm:py-28 lg:py-32 bg-heading overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                          bg-forest/20 border border-forest/30
                          text-sage-light text-xs sm:text-sm font-semibold tracking-wide">
            Kategori Sampah
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold
                         text-white leading-[1.15] tracking-tight">
            Jenis sampah yang dapat dikenali
          </h2>
        </motion.div>

        {/* 4 Category Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group bg-[#1A2F12] border border-white/8 rounded-2xl overflow-hidden
                         hover:border-forest/50 transition-colors duration-300"
            >
              <div className="flex items-center justify-center py-10">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${cat.bg} flex items-center justify-center
                                shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <cat.Icon />
                </div>
              </div>
              <div className="px-5 pb-6 text-center">
                <h3 className="text-base sm:text-lg font-bold text-sage-light mb-1.5">{cat.name}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
