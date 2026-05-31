import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import AboutSection from '../components/AboutSection'
import StatsSection from '../components/StatsSection'
import HowItWorks from '../components/HowItWorks'
import WasteGuideSection from '../components/WasteGuideSection'
import BenefitsSection from '../components/BenefitsSection'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { scaleIn } from '../lib/animations'

/* Final CTA Section — before Footer */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&h=700&fit=crop"
          alt="Lingkungan hijau bersih"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/92 via-emerald-900/80 to-teal-900/85" />
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8
                           bg-emerald-500/15 border border-emerald-400/30
                           text-emerald-300 text-xs font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mulai Sekarang
          </span>
          <h2 className="text-[2.2rem] sm:text-[3rem] lg:text-[3.5rem]
                         font-extrabold text-white leading-[1.1] tracking-[-0.025em] mb-6">
            Siap Mengelola Sampah<br className="hidden sm:block" /> dengan Lebih Cerdas?
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-medium" style={{color: 'rgba(255,255,255,0.7)'}}>
            Upload foto sampah sekarang dan biarkan AI membantu mengidentifikasi
            jenis limbah serta cara pengelolaannya yang tepat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/upload"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-8 py-4
                         bg-white text-emerald-700 font-bold text-base
                         rounded-full shadow-xl shadow-black/20
                         hover:bg-emerald-50 transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V4a1 1 0 011-1h3" /><path d="M13 3h3a1 1 0 011 1v3" />
                <path d="M17 13v3a1 1 0 01-1 1h-3" /><path d="M7 17H4a1 1 0 01-1-1v-3" />
                <circle cx="10" cy="10" r="3" />
              </svg>
              Mulai Scan Sampah
            </motion.a>
            <motion.a
              href="/dashboard-tps"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-7 py-4
                         border border-white/30 text-white font-semibold text-base
                         rounded-full hover:bg-white/10 hover:border-white/50
                         transition-all duration-300"
            >
              Lihat Peta TPS
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
        <Navbar />
        <Hero />
        <Marquee />
        <AboutSection />
        <StatsSection />
        <HowItWorks />
        <WasteGuideSection />
        <BenefitsSection />
        <FinalCTA />
        <Footer />
        <ScrollToTop />
      </div>
    </PageTransition>
  )
}
