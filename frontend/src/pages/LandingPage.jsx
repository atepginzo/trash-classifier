import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import AboutSection from '../components/AboutSection'
import StatsSection from '../components/StatsSection'
import HowItWorks from '../components/HowItWorks'
import CategoriesSection from '../components/CategoriesSection'
import EdukasiSection from '../components/EdukasiSection'
import BenefitsSection from '../components/BenefitsSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <Hero />
      <Marquee />
      <AboutSection />
      <StatsSection />
      <HowItWorks />
      <CategoriesSection />
      <EdukasiSection />
      <BenefitsSection />
      <Footer />
    </div>
  )
}
