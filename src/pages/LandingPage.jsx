import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import AboutSection from '../components/AboutSection'
import StatsSection from '../components/StatsSection'
import HowItWorks from '../components/HowItWorks'
import WasteGuideSection from '../components/WasteGuideSection'
import BenefitsSection from '../components/BenefitsSection'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

/* Final CTA Section — before Footer */
function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop"
          alt="Lingkungan hijau bersih"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/85" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-6
                          bg-white/10 border border-white/20
                          text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide">
            ♻️ Mulai Sekarang
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold
                         text-white leading-[1.15] tracking-tight mb-6">
            Siap Mengelola Sampah<br className="hidden sm:block" /> dengan Lebih Cerdas?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            Upload foto sampah sekarang dan biarkan AI membantu Anda mengidentifikasi
            jenis limbah serta cara pengelolaannya yang tepat.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/upload"
              className="inline-flex items-center gap-2.5 px-8 py-4
                         bg-white text-emerald-700 font-bold text-sm sm:text-base
                         rounded-full shadow-xl shadow-black/20
                         hover:bg-emerald-50 hover:-translate-y-0.5
                         transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V4a1 1 0 011-1h3" /><path d="M13 3h3a1 1 0 011 1v3" />
                <path d="M17 13v3a1 1 0 01-1 1h-3" /><path d="M7 17H4a1 1 0 01-1-1v-3" />
                <circle cx="10" cy="10" r="3" />
              </svg>
              Mulai Scan Sampah
            </a>
            <a
              href="/dashboard-tps"
              className="inline-flex items-center gap-2 px-7 py-4
                         border border-white/30 text-white font-semibold text-sm sm:text-base
                         rounded-full hover:bg-white/10 hover:border-white/50
                         hover:-translate-y-0.5 transition-all duration-300"
            >
              Lihat Peta TPS
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
    </div>
  )
}
