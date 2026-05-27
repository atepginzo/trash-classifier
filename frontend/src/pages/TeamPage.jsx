import Navbar from '../components/Navbar'
import TeamSection from '../components/TeamSection'
import Footer from '../components/Footer'
import PageTransition from '../components/PageTransition'

export default function TeamPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors duration-300">
        <Navbar />
        <div className="pt-20 lg:pt-24">
          <TeamSection />
        </div>
        <Footer />
      </div>
    </PageTransition>
  )
}
