import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

/* Icons */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const LoginArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/upload');
    }, 1200);
  };

  const inputClass = `w-full px-4 py-3 text-sm bg-white border border-sage/30 rounded-xl
    text-heading placeholder-muted/50
    focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40
    transition-all duration-200`;

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

            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-heading tracking-tight mb-2">
                Selamat Datang
              </h1>
              <p className="text-sm text-muted">
                Masuk ke akun Anda untuk mulai deteksi sampah
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                       placeholder="nama@email.com" required className={inputClass} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-heading">Password</label>
                  <a href="#" className="text-xs text-forest font-medium hover:underline">Lupa password?</a>
                </div>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         placeholder="Masukkan password" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox"
                       className="w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest/30 accent-forest" />
                <span className="text-xs text-muted">Ingat saya di perangkat ini</span>
              </label>
              <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5
                                 bg-forest text-white text-sm font-semibold rounded-xl
                                 hover:bg-forest-dark active:scale-[0.98]
                                 disabled:opacity-60 disabled:cursor-not-allowed
                                 transition-all duration-300 shadow-lg shadow-forest/20">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LoginArrow />
                    Masuk
                  </>
                )}
              </button>
            </form>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-sage/20" />
              <span className="text-xs text-muted font-medium">atau</span>
              <div className="flex-1 h-px bg-sage/20" />
            </div>
            <button className="w-full flex items-center justify-center gap-2.5 px-6 py-3
                               bg-cream-light border border-sage/25 text-sm font-medium text-heading rounded-xl
                               hover:bg-sage-light/30 transition-all duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.56-5.17 3.56-8.79z" />
                <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.97c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.07C3.515 21.27 7.565 24 12.255 24z" />
                <path fill="#FBBC05" d="M5.525 14.32c-.25-.72-.38-1.49-.38-2.32s.14-1.6.38-2.32V6.61h-3.98a11.86 11.86 0 000 10.78l3.98-3.07z" />
                <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.73-10.71 6.61l3.98 3.07c.95-2.85 3.6-4.93 6.73-4.93z" />
              </svg>
              Masuk dengan Google
            </button>
          </div>
          <p className="text-center text-sm text-muted mt-6">
            Belum punya akun?{' '}
            <Link to="/signup" className="text-forest font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
