import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const NAV_LINKS = [
  { label: 'Beranda', href: '/', icon: 'home' },
  { label: 'Peta TPS', href: '/dashboard-tps', icon: 'map' },
  { label: 'Riwayat', href: '/predictions', icon: 'history' },
  { label: 'Tim', href: '/team', icon: 'users' },
  { label: 'Kontak', href: '/contact', icon: 'mail' },
];

const NavIcon = ({ type, className = '' }) => {
  const iconMap = {
    home: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L10 4l7 6.5" />
        <path d="M5 9.5V16a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V9.5" />
      </svg>
    ),
    info: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 9v4M10 7h.01" />
      </svg>
    ),
    book: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="12" height="14" rx="1" />
        <path d="M7 3v14M4 7h3M4 11h3" />
      </svg>
    ),
    users: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="7" r="2.5" />
        <path d="M3 16c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
        <circle cx="14" cy="7.5" r="1.8" />
        <path d="M14.5 11.5c1.8.3 3.5 1.8 3.5 4" />
      </svg>
    ),
    mail: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="14" height="10" rx="1.5" />
        <path d="M3 6.5l7 5 7-5" />
      </svg>
    ),
    history: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <polyline points="10 6 10 10 13 10" />
      </svg>
    ),
    scan: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 012-2h2M13 3h2a2 2 0 012 2v2M17 13v2a2 2 0 01-2 2h-2M7 17H5a2 2 0 01-2-2v-2" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
    map: (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5l5-2 4 2 5-2v12l-5 2-4-2-5 2V5z" />
        <path d="M8 3v12M12 5v12" />
      </svg>
    ),
  };
  return iconMap[type] || null;
};

const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="3" />
    <circle cx="10" cy="8.5" r="2.2" />
    <path d="M5.5 16c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* Track scroll for sticky blur effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /**
   * Smart navigation handler:
   * - "/" → scroll to top
   * - "/about" → navigate to about page
   * - "/team" → navigate to /team
   */
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);

    // Pure route (no hash), e.g. "/team" or "/"
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  /* Check if link is active */
  const isActive = (href) => {
    // Direct path matching for all routes
    return location.pathname === href;
  };

  const linkClass = (href) =>
    `flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive(href)
      ? 'bg-forest/10 text-forest'
      : 'text-body hover:bg-forest/5 hover:text-forest'
    }`;

  const mobileLinkClass = (href) =>
    `flex items-center gap-2.5 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(href)
      ? 'bg-forest/10 text-forest'
      : 'text-body hover:bg-forest/5 hover:text-forest'
    }`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'navbar-blur bg-cream/85 shadow-[0_1px_0_0_rgba(168,184,156,0.3)]'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <a
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2.5 group"
          >
            <div className="transition-transform duration-300 group-hover:scale-110">
              <Logo size={40} />
            </div>
            <span className="font-serif text-xl font-semibold text-heading tracking-tight">
              TrashSmart
            </span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={linkClass(link.href)}
              >
                <NavIcon type={link.icon} className="w-4 h-4 opacity-60" />
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              onClick={(e) => handleNavClick(e, '/login')}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold
                         border border-forest/30 text-forest rounded-full
                         hover:bg-forest hover:text-white
                         transition-all duration-300"
            >
              <LoginIcon />
              Masuk
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-forest/5 transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M6 18L18 6" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h12" />
                    <path d="M4 17h8" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden navbar-blur bg-cream/95 border-t border-sage/20"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={mobileLinkClass(link.href)}
                >
                  <NavIcon type={link.icon} className="w-4.5 h-4.5 opacity-50" />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
