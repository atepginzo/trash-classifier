import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useTheme } from '../contexts/ThemeContext';

const NAV_LINKS = [
  { label: 'Beranda',  href: '/' },
  { label: 'Peta TPS', href: '/dashboard-tps' },
  { label: 'Riwayat',  href: '/predictions' },
  { label: 'Tim',      href: '/team' },
  { label: 'Kontak',   href: '/contact' },
];

const LoginIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="3" />
    <circle cx="10" cy="8.5" r="2.2" />
    <path d="M5.5 16c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" />
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeOnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [visible, setVisible]       = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen]   = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  /* ── Scroll hide/show ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y < 24)              setVisible(true);
      else if (y > lastScrollY && y > 100) setVisible(false);
      else if (y < lastScrollY)            setVisible(true);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* ── Lock body scroll when login panel open ── */
  useEffect(() => {
    document.body.style.overflow = loginOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loginOpen]);

  const go = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  const isActive = (href) => location.pathname === href;

  /* ── Navbar bg ── */
  const navBg = scrolled
    ? isDark
      ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
      : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.08)]'
    : isDark ? 'bg-black' : 'bg-white';

  return (
    <>
      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[64px]">

            {/* Logo */}
            <a href="/" onClick={(e) => go(e, '/')}
              className="flex items-center gap-2.5 group shrink-0">
              <div className="transition-transform duration-300 group-hover:scale-105">
                <Logo size={34} />
              </div>
              <span className={`text-[1.1rem] font-extrabold tracking-tight leading-none transition-colors ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                TrashSmart
              </span>
            </a>

            {/* Desktop pill nav */}
            <div className={`hidden md:flex items-center gap-0.5 backdrop-blur-md
                            rounded-full px-1.5 py-1.5 border shadow-lg ${
              isDark
                ? 'bg-emerald-600/90 border-emerald-500/30 shadow-emerald-900/30'
                : 'bg-emerald-500/90 border-emerald-400/30 shadow-emerald-500/20'
            }`}>
              {NAV_LINKS.map((link) => (
                <div key={link.label} className="relative">
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    className={`relative z-10 px-4 py-1.5 text-sm font-semibold rounded-full
                                transition-colors duration-200 block whitespace-nowrap ${
                      isActive(link.href) ? 'text-emerald-700' : 'text-white hover:text-white/90'
                    }`}
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2">

              {/* Theme toggle — small round button */}
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle dark/light"
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 border-white/15 text-emerald-400 hover:bg-white/15'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center justify-center"
                  >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {/* Masuk button — opens sidebar */}
              <motion.button
                onClick={() => setLoginOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                           rounded-full shadow-md transition-all duration-300 ${
                  isDark
                    ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-900/50'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/25'
                }`}
              >
                <LoginIcon />
                Masuk
              </motion.button>

              {/* Hamburger (mobile) */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
                className={`md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl
                           transition-colors gap-1.5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
              >
                {[
                  { animate: { rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 } },
                  { animate: { opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 } },
                  { animate: { rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 } },
                ].map((bar, i) => (
                  <motion.span
                    key={i}
                    animate={bar.animate}
                    transition={{ duration: 0.2 }}
                    className={`block w-5 h-0.5 rounded-full origin-center ${
                      isDark ? 'bg-white' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`md:hidden overflow-hidden border-b backdrop-blur-xl shadow-lg ${
                isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-slate-200/70'
              }`}
            >
              <nav className="flex flex-col gap-1 px-5 py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-emerald-500/20 text-emerald-500 font-semibold'
                        : isDark
                          ? 'text-white/70 hover:bg-white/10 hover:text-emerald-400'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); setLoginOpen(true); }}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                             bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors"
                >
                  <LoginIcon /> Masuk
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ═══════════════════ LOGIN SIDEBAR PANEL ═══════════════════ */}
      <AnimatePresence>
        {loginOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="login-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLoginOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              key="login-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[70]
                         flex flex-col shadow-2xl overflow-y-auto ${
                isDark ? 'bg-[#080808]' : 'bg-white'
              }`}
            >
              {/* Panel header */}
              <div className={`flex items-center justify-between px-6 py-5 border-b ${
                isDark ? 'border-white/8' : 'border-slate-100'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Logo size={28} />
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    TrashSmart
                  </span>
                </div>
                <motion.button
                  onClick={() => setLoginOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isDark
                      ? 'bg-white/8 text-white/60 hover:bg-white/15 hover:text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <CloseIcon />
                </motion.button>
              </div>

              {/* Panel body */}
              <div className="flex-1 px-6 py-8 flex flex-col">

                {/* Greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="mb-8"
                >
                  <h2 className={`text-2xl font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Selamat Datang 👋
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                    Masuk untuk melanjutkan ke TrashSmart
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex flex-col gap-4"
                  onSubmit={(e) => { setLoginOpen(false); go(e, '/login'); }}
                >
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${
                      isDark ? 'text-white/40' : 'text-slate-400'
                    }`}>Email</label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      className={`w-full px-4 py-3 rounded-xl text-sm border outline-none
                                 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30
                                 focus:border-emerald-500 ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder-white/25'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                      }`}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[11px] font-semibold uppercase tracking-widest ${
                      isDark ? 'text-white/40' : 'text-slate-400'
                    }`}>Password</label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 pr-11 rounded-xl text-sm border outline-none
                                   transition-all duration-200 focus:ring-2 focus:ring-emerald-500/30
                                   focus:border-emerald-500 ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder-white/25'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
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
                    <a
                      href="/forgot-password"
                      onClick={(e) => { setLoginOpen(false); go(e, '/forgot-password'); }}
                      className="text-xs text-emerald-500 hover:text-emerald-400 self-end mt-0.5 transition-colors"
                    >
                      Lupa password?
                    </a>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm
                               hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-600/20 mt-1"
                  >
                    Masuk Sekarang
                  </motion.button>
                </motion.form>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 my-6"
                >
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
                  <span className={`text-xs ${isDark ? 'text-white/25' : 'text-slate-400'}`}>atau</span>
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/8' : 'bg-slate-200'}`} />
                </motion.div>

                {/* Google */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-semibold
                             border transition-all duration-300 ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Lanjutkan dengan Google
                </motion.button>

                {/* Register */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto pt-8 text-center"
                >
                  <p className={`text-sm ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
                    Belum punya akun?{' '}
                    <a
                      href="/register"
                      onClick={(e) => { setLoginOpen(false); go(e, '/register'); }}
                      className="text-emerald-500 font-semibold hover:text-emerald-400 transition-colors"
                    >
                      Daftar sekarang
                    </a>
                  </p>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
