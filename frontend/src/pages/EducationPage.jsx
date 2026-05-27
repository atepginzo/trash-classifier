import Navbar from '../components/Navbar'
import EdukasiSection from '../components/EdukasiSection'
import Footer from '../components/Footer'

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-16 lg:pt-18">
        <EdukasiSection />
      </div>
      <Footer />
    </div>
  )
}
