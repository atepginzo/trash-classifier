import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function PreviewCard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      drag
      dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
      dragElastic={0.1}
      whileHover={{ y: -6, scale: 1.02, cursor: 'grab' }}
      whileDrag={{ scale: 1.04, cursor: 'grabbing', rotate: 1.5 }}
      /* ── kecil: max-w-[300px], medium: max-w-[340px] ── */
      className="relative w-full max-w-[300px] mx-auto lg:max-w-[340px] mt-4 lg:mt-0"
    >
      <div className={`relative overflow-hidden rounded-2xl border shadow-[0_16px_48px_rgba(0,0,0,0.15)] transition-colors duration-300 ${
        isDark
          ? 'bg-[#111111] border-white/8'
          : 'bg-white border-slate-200'
      }`}>

        {/* ── Header ── */}
        <div className={`relative p-4 transition-colors duration-300 ${
          isDark ? 'bg-[#0d0d0d]' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-xs font-bold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Deteksi Otomatis
              </h3>
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                Powered by AI
              </p>
            </div>
          </div>

          {/* Camera frame */}
          <div className={`relative rounded-xl overflow-hidden border-2 aspect-[4/3] ${
            isDark ? 'border-white/10 bg-black' : 'border-slate-200 bg-white'
          }`}>
            <img
              src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&h=450&fit=crop&q=80"
              alt="Waste detection preview"
              className="w-full h-full object-cover"
            />

            {/* Bounding box overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <div className="relative w-full h-full max-w-[180px] max-h-[180px]">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-md" />

                {/* Detection label */}
                <div className="absolute -top-6 left-0 px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-lg">
                  Plastik 94%
                </div>
              </div>
            </div>

            {/* Scan line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line" />
          </div>

          {/* Status row */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-[10px] font-semibold ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                Siap Mendeteksi
              </span>
            </div>
            <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              Real-time AI
            </span>
          </div>
        </div>

        {/* ── Bottom stats ── */}
        <div className={`grid grid-cols-2 gap-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`}>
          <div className={`px-4 py-2.5 text-center transition-colors ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
            <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>99%</div>
            <div className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Akurasi</div>
          </div>
          <div className={`px-4 py-2.5 text-center transition-colors ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
            <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>&lt; 3s</div>
            <div className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Deteksi</div>
          </div>
        </div>
      </div>

      {/* Floating glow accent */}
      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-xl rounded-full opacity-40 transition-colors ${
        isDark ? 'bg-emerald-500' : 'bg-emerald-400'
      }`} />
    </motion.div>
  );
}
