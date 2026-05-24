import Navbar from '../components/Navbar'
import AboutSection from '../components/AboutSection'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-16 lg:pt-18">
        <AboutSection />
        <HowItWorks />
      </div>
      <Footer />
    </div>
  )
}
