import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'Anorganik',
    desc: 'Plastik, kaleng, kaca, kertas yang masih bisa didaur ulang',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400&h=300&fit=crop',
    color: '#0284C7',
  },
  {
    name: 'B3',
    desc: 'Baterai, elektronik, bahan kimia berbahaya',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=300&fit=crop',
    color: '#DC2626',
  },
  {
    name: 'Organik',
    desc: 'Sisa makanan, daun, material yang bisa dikompos',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    color: '#059669',
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function CategoriesSection() {
  return (
    <section id="kategori" className="relative py-20 sm:py-28 lg:py-32 bg-slate-900 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                          bg-emerald-500/15 border border-emerald-500/25
                          text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
            Kategori Sampah
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
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
              className="group relative bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden
                         hover:border-emerald-500/30 transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.name}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-6 pt-4">
                <h3 className="text-lg font-bold text-white mb-1.5">{cat.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{cat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
