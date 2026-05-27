import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../contexts/ThemeContext';

/* Icons */
const EyeOnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isRegisterRoute = location.pathname === '/register' || location.pathname === '/signup';
  const [isLogin, setIsLogin] = useState(!isRegisterRoute);
  
  // Sync state with URL manually if needed
  useEffect(() => {
    setIsLogin(!isRegisterRoute);
  }, [isRegisterRoute]);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = (e) => {
    e.preventDefault();
    setError('');
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
    // Update URL without full navigation
    const nextUrl = isLogin ? '/register' : '/login';
    navigate(nextUrl, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(isLogin ? '/upload' : '/login');
      if (!isLogin) setIsLogin(true); // switch to login after register
    }, 1200);
  };

  const handleGoogleLogin = () => {
    alert('Fitur segera hadir');
  };

  return (
    <PageTransition>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#080808]' : 'bg-[#F8FAFC]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <div className="transition-transform duration-300 group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className={`font-serif text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              TrashSmart
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4 pb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl ${
              isDark 
                ? 'bg-[#111111] border border-white/5 shadow-black/50' 
                : 'bg-white border border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)]'
            }`}
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
              </h2>
              <p className={`text-sm ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                {isLogin ? 'Masuk untuk melanjutkan ke TrashSmart' : 'Daftar untuk mulai menggunakan TrashSmart'}
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium text-center">
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1.5"
                  >
                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Nama Lengkap</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="Nama lengkap Anda"
                      required={!isLogin}
                      className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/25' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="nama@email.com"
                  required
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 ${
                    isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/25' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                  }`}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    placeholder="••••••••"
                    required
                    className={`w-full px-4 py-3 pr-11 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/25' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                      isDark ? 'text-white/30 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeOnIcon />}
                  </button>
                </div>
                
                {isLogin && (
                  <div className="flex items-center justify-between mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className={`w-3.5 h-3.5 rounded text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 ${isDark ? 'border-white/20' : 'border-slate-300'}`} />
                      <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Ingat saya</span>
                    </label>
                    <Link to="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-200 transition-colors font-medium">Lupa password?</Link>
                  </div>    
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1.5"
                  >
                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Konfirmasi Password</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      required={!isLogin}
                      className={`w-full px-4 py-3 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 ${
                        isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/25' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-emerald-600 text-white font-bold text-sm
                           hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-600/20 disabled:opacity-70 flex justify-center items-center h-[52px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className={`flex-1 h-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
              <span className={`text-[11px] font-medium uppercase tracking-wider ${isDark ? 'text-white/30' : 'text-slate-400'}`}>atau</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className={`flex items-center justify-center gap-3 w-full py-3.5 rounded-xl text-sm font-semibold
                         border transition-all duration-300 active:scale-[0.98] ${
                isDark ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Lanjutkan dengan Google
            </button>

            {/* Toggle Mode */}
            <p className={`text-center mt-8 text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                onClick={toggleMode}
                className="text-emerald-500 font-semibold hover:text-emerald-400 transition-colors bg-transparent border-none outline-none cursor-pointer p-0"
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>

          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
