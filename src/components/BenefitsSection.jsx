import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

/* Benefit icons */
const TrendUpIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const LeafIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" /><path d="M17 8a14 14 0 004-6 14 14 0 00-6 4" />
    <path d="M17 8C13 12 8 17 3.82 21.34" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const BENEFITS = [
  {
    title: 'Meningkatkan efisiensi pemilahan',
    desc: 'Mengurangi human error dalam proses pemilahan sampah manual sehingga kontaminasi silang antar material bisa diminimalkan.',
    Icon: TrendUpIcon,
    image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=400&fit=crop',
    overlay: 'from-emerald-950/80 via-emerald-900/50 to-emerald-950/80',
    borderColor: 'border-emerald-200/40',
  },
  {
    title: 'Mendukung pengelolaan limbah berkelanjutan',
    desc: 'Data deteksi real-time membantu pengambilan keputusan berbasis data untuk meningkatkan rasio daur ulang.',
    Icon: LeafIcon,
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop',
    overlay: 'from-teal-950/80 via-teal-900/50 to-teal-950/80',
    borderColor: 'border-teal-200/40',
  },
  {
    title: 'Menjamin kualitas & kepatuhan',
    desc: 'Sistem otomatis memastikan standar pemilahan terpenuhi sesuai regulasi pengelolaan limbah yang berlaku.',
    Icon: ShieldIcon,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    overlay: 'from-sky-950/80 via-sky-900/50 to-sky-950/80',
    borderColor: 'border-sky-200/40',
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function BenefitsSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="dampak" className="relative py-20 sm:py-28 lg:py-32 bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                          bg-emerald-50 border border-emerald-200/60
                          dark:bg-emerald-950/30 dark:border-emerald-800/30
                          text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
            Dampak Positif
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                         text-slate-900 dark:text-white leading-[1.15] tracking-tight transition-colors duration-300">
            Manfaat untuk organisasi pengelola sampah
          </h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`group bg-white dark:bg-[#111111] border ${b.borderColor} dark:border-white/5 rounded-2xl overflow-hidden
                         shadow-[0_2px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.5)]
                         hover:shadow-[0_12px_40px_rgba(5,150,105,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)]
                         transition-all duration-300`}
            >
              <div className="relative h-44 overflow-hidden flex items-center justify-center bg-slate-900">
                {/* Background Image */}
                <img
                  src={b.image}
                  alt={b.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-50"
                />
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${b.overlay} opacity-70 transition-opacity duration-300 group-hover:opacity-60`} />
                
                {/* Floating Icon inside a Premium Glassmorphic circle */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-white/95 dark:bg-black/90 shadow-lg border border-white/40 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <b.Icon />
                </div>
              </div>
              <div className="px-6 py-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 tracking-tight transition-colors duration-300">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-white/60 leading-relaxed transition-colors duration-300">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
