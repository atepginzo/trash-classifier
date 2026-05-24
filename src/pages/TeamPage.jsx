import Navbar from '../components/Navbar'
import TeamSection from '../components/TeamSection'
import Footer from '../components/Footer'

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-16 lg:pt-18">
        <TeamSection />
      </div>
      <Footer />
    </div>
  )
}
