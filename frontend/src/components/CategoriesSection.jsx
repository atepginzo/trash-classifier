import { motion } from 'framer-motion';

const RecycleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
    <path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.005-1.775L16.8 9.5" />
    <path d="M14.469 3.592a1.835 1.835 0 00-1.563-.887h-.002a1.834 1.834 0 00-1.563.892L7.196 9.5" />
    <polyline points="9.5 14.5 7.196 9.5 12 9.5" />
    <polyline points="14.5 14.5 16.804 9.5 12 9.5" />
    <polyline points="12 19 9.5 14.5 14.5 14.5" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LeafIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D5016" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
    <path d="M17 8a14 14 0 004-6 14 14 0 00-6 4" />
    <path d="M17 8C13 12 8 17 3.82 21.34" />
  </svg>
);

const CATEGORIES = [
  { name: 'Anorganik', desc: 'Plastik, kaleng, kaca, kertas yang masih bisa didaur ulang', Icon: RecycleIcon, bg: 'bg-[#E0ECFF]' },
  { name: 'B3', desc: 'Baterai, elektronik, bahan kimia berbahaya', Icon: AlertTriangleIcon, bg: 'bg-[#FFE0E0]' },
  { name: 'Organik', desc: 'Sisa makanan, daun, material yang bisa dikompos', Icon: LeafIcon, bg: 'bg-[#E8EDDF]' },
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

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
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
