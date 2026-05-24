import { motion } from 'framer-motion';

/* Leaf SVG illustration */
const LeafIllustration = () => (
  <svg
    width="140"
    height="140"
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <path
      d="M70 20C50 20 25 45 25 80C25 95 35 110 55 115C60 116 65 112 68 105C69 102 70 98 70 95C70 98 71 102 72 105C75 112 80 116 85 115C105 110 115 95 115 80C115 45 90 20 70 20Z"
      fill="#A8B89C"
      fillOpacity="0.35"
    />
    <path
      d="M70 20C50 20 25 45 25 80C25 95 35 110 55 115C60 116 65 112 68 105C69 102 70 98 70 95C70 98 71 102 72 105C75 112 80 116 85 115C105 110 115 95 115 80C115 45 90 20 70 20Z"
      stroke="#2D5016"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M70 30V95"
      stroke="#2D5016"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="4 3"
    />
    <path d="M70 45L50 60" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M70 45L90 60" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M70 60L45 78" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M70 60L95 78" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M70 75L52 92" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <path d="M70 75L88 92" stroke="#2D5016" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <circle cx="70" cy="20" r="3" fill="#2D5016" fillOpacity="0.3" />
  </svg>
);

/* Checkmark icon */
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
    <circle cx="10" cy="10" r="9" fill="#2D5016" />
    <path d="M6.5 10.5L9 13L14 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PreviewCard() {
  return (
    <motion.div
      /* Entrance animation */
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      /* Hover: straighten + lift */
      whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
      className="relative w-full max-w-sm mx-auto lg:max-w-md cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-2xl lg:rounded-3xl
                    bg-gradient-to-br from-sage-light/40 to-cream-light
                    border border-sage/30
                    shadow-[0_8px_30px_rgba(45,80,22,0.08)]
                    p-6 sm:p-8 lg:p-10
                    min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]
                    flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #2D5016 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6"
        >
          <div className="bg-forest text-white px-4 py-3 rounded-xl text-center shadow-lg shadow-forest/20">
            <div className="text-xl sm:text-2xl font-bold font-serif leading-none">91.4%</div>
            <div className="text-[10px] sm:text-xs font-medium opacity-80 mt-1 tracking-wide">Akurasi model</div>
          </div>
        </motion.div>
        <div className="relative z-10 my-4 sm:my-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LeafIllustration />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6"
        >
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm
                          border border-sage/25 rounded-xl px-4 py-3
                          shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <CheckIcon />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-heading truncate">Plastik terdeteksi</div>
              <div className="text-xs text-muted">Confidence: 93% · Zona A</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
