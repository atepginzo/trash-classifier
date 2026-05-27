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

              {/* Masuk button — navigates to login */}
              <motion.button
                onClick={(e) => go(e, '/login')}
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
                  onClick={(e) => go(e, '/login')}
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
    </>
  );
}
