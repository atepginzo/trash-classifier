import { motion } from 'framer-motion';

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
    title: 'Lebih mudah memahami kategori sampah',
    desc: 'Bantuan AI membuat identifikasi sampah organik, anorganik, dan B3 menjadi instan tanpa kebingungan.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400&h=200&fit=crop',
    Icon: TrendUpIcon,
  },
  {
    title: 'Proses belajar lebih cepat',
    desc: 'Panduan visual dan tips praktis langsung membantu Anda memilah sampah dengan benar sejak hari pertama.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=400&h=200&fit=crop',
    Icon: LeafIcon,
  },
  {
    title: 'Membantu kebiasaan ramah lingkungan',
    desc: 'Langkah kecil memilah sampah berdampak besar untuk mengurangi volume di TPA dan mempercepat daur ulang.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&h=200&fit=crop',
    Icon: ShieldIcon,
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

export default function BenefitsSection() {
  return (
    <section id="dampak" className="relative py-20 sm:py-28 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
            Manfaat untuk kebiasaan sehari-hari
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
              className="group relative bg-white/75 border border-white/70 rounded-3xl overflow-hidden
                         shadow-sm backdrop-blur-xl
                         hover:shadow-xl hover:shadow-emerald-500/10
                         transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <img
                  src={b.image}
                  alt={b.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/20 p-2 text-white backdrop-blur-md shadow-sm">
                  <b.Icon />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2 tracking-tight">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
