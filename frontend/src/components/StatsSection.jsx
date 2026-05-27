import { motion, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

/* SVG icons for stats */
const TargetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" fill="#059669" fillOpacity="0.3" />
  </svg>
);
const GridIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
  </svg>
);
const BoltIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const STATS = [
  { value: 91, suffix: '%', label: 'Akurasi Model', Icon: TargetIcon },
  { value: 3, suffix: '', label: 'Kategori Sampah', Icon: GridIcon },
  { value: 500, suffix: '+', label: 'Gambar Dataset', Icon: ImageIcon },
  { value: 3, suffix: 's', label: 'Waktu Deteksi', Icon: BoltIcon },
];

function StatCard({ stat, index }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animate(0, stat.value, {
            duration: 1.8, ease: 'easeOut',
            onUpdate: (v) => setCount(Math.round(v)),
          });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden text-center px-4 py-8 bg-white/75 backdrop-blur-xl rounded-3xl border border-white/70 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-80" />
      <div className="flex justify-center mb-3 opacity-70"><stat.Icon /></div>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 mb-1 tracking-tight">
        {count}<span className="text-emerald-500">{stat.suffix}</span>
      </div>
      <div className="text-sm sm:text-base text-slate-500 font-medium">{stat.label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/40 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
