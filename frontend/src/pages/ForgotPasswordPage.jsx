import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  const inputClass = `w-full px-4 py-3 text-sm bg-white border border-sage/30 rounded-xl
    text-heading placeholder-muted/50
    focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40
    transition-all duration-200`

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <Link to="/" className="flex items-center gap-2.5 group w-fit">
          <div className="transition-transform duration-300 group-hover:scale-110">
            <Logo size={40} />
          </div>
          <span className="font-serif text-xl font-semibold text-heading tracking-tight">TrashSmart</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white border border-sage/20 rounded-2xl p-7 sm:p-9
                          shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                    <MailIcon />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading tracking-tight mb-2">
                    Lupa Password?
                  </h1>
                  <p className="text-sm text-muted">
                    Masukkan email Anda dan kami akan mengirimkan link untuk reset password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5
                               bg-forest text-white text-sm font-semibold rounded-xl
                               hover:bg-forest-dark active:scale-[0.98]
                               disabled:opacity-60 disabled:cursor-not-allowed
                               transition-all duration-300 shadow-lg shadow-forest/20"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MailIcon />
                        Kirim Link Reset
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-bold text-heading mb-2">
                  Email Terkirim!
                </h2>
                <p className="text-sm text-muted mb-6 leading-relaxed">
                  Kami telah mengirimkan link reset password ke <strong className="text-heading">{email}</strong>. Silakan cek inbox Anda.
                </p>
                <p className="text-xs text-muted">
                  Tidak menerima email?{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-forest font-semibold hover:underline"
                  >
                    Kirim ulang
                  </button>
                </p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-sage/15">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-forest font-semibold hover:underline"
              >
                <ArrowLeftIcon />
                Kembali ke Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
