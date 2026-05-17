import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-forest rounded-3xl px-6 sm:px-12 lg:px-20 py-14 sm:py-20 lg:py-24 overflow-hidden text-center"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-terracotta/10 blur-2xl" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
                <path d="M17 8a14 14 0 004-6 14 14 0 00-6 4" />
                <path d="M17 8C13 12 8 17 3.82 21.34" />
              </svg>
            </motion.div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-4 sm:mb-6">
              Siap memulai pengelolaan sampah yang lebih cerdas?
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
              Coba TrashSmart sekarang — gratis, tanpa registrasi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/upload" className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-forest font-bold text-sm sm:text-base rounded-full shadow-lg hover:bg-cream hover:-translate-y-0.5 transition-all duration-300">
                Mulai Deteksi Sekarang
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M4 10h12M12 5l5 5-5 5" /></svg>
              </a>
              <a href="#tentang" className="inline-flex items-center gap-2 px-6 py-3.5 text-white/80 font-medium text-sm rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-all duration-300">
                Pelajari lebih lanjut
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
