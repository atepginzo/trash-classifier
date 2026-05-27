import { Routes, Route, useLocation } from 'react-router-dom'
import { useScroll, useSpring, motion, AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import HistoryPage from './pages/HistoryPage'
import TeamPage from './pages/TeamPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AboutPage from './pages/AboutPage'
import EducationPage from './pages/EducationPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CareerPage from './pages/CareerPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VolumePredictionPage from './pages/VolumePredictionPage'
import TpsPage from './pages/TpsPage'
import DashboardTpsPage from './pages/DashboardTpsPage'

function App() {
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <>
      <motion.div
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: '#1D9E75',
          transformOrigin: '0%',
          zIndex: 9999,
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/predictions" element={<HistoryPage />} />
          <Route path="/predictions/:id" element={<ResultPage />} />
          <Route path="/volume-prediction" element={<VolumePredictionPage />} />
          <Route path="/tps" element={<TpsPage />} />
          <Route path="/dashboard-tps" element={<DashboardTpsPage />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App



