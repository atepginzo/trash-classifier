import Navbar from '../components/Navbar'
import TeamSection from '../components/TeamSection'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function TeamPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="pt-16 lg:pt-18">
          <TeamSection />
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}
