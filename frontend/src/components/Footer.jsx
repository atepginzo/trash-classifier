import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { motion } from 'framer-motion';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const NAV_COLS = [
  {
    title: 'Navigasi',
    links: [
      { label: 'Beranda', href: '/', internal: true },
      { label: 'Cara Pakai', href: '/#cara-pakai', internal: true, scroll: 'cara-pakai' },
      { label: 'Peta TPS', href: '/dashboard-tps', internal: true },
      { label: 'Riwayat', href: '/predictions', internal: true },
      { label: 'Tim', href: '/team', internal: true },
    ],
  },
  {
    title: 'Kontak',
    links: [
      { label: 'Email Kami', href: 'mailto:ecosortdbs@gmail.com' },
      { label: 'WhatsApp', href: 'https://wa.me/6289513829923', external: true },
      { label: 'Telepon', href: 'tel:+6289513829923' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Kebijakan Privasi', href: '/privacy' },
      { label: 'Syarat & Ketentuan', href: '/terms' },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleLink = (e, link) => {
    if (!link.internal && !link.scroll) return;
    e.preventDefault();
    if (link.scroll) {
      // Navigate to home then scroll
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(link.scroll);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      navigate(link.href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="kontak" className="bg-[#0A1A0F] overflow-hidden">

      {/* ── Top divider line ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-700/40 to-transparent" />

      {/* ── CTA Banner ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
              Mulai kelola sampah lebih cerdas
            </h3>
            <p className="text-sm text-slate-400 max-w-md">
              Bergabung bersama organisasi pengelola limbah yang sudah menggunakan TrashSmart
            </p>
          </div>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-6 py-3
                       bg-emerald-600 text-white font-semibold text-sm rounded-full
                       hover:bg-emerald-500 shadow-lg shadow-emerald-900/40
                       transition-all duration-300 shrink-0"
          >
            Masuk Sekarang
          </motion.a>
        </div>
      </div>

      {/* ── Main Footer grid ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10
                        border-b border-white/5">

          {/* Brand col */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={34} />
              <span className="text-lg font-bold text-white tracking-tight">TrashSmart</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Sistem klasifikasi sampah berbasis AI untuk mendukung pengelolaan
              limbah yang lebih efisien dan berkelanjutan.
            </p>
            {/* Social */}
            <div className="flex items-center gap-2.5">
              {[
                { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: GithubIcon, href: 'https://github.com/atepginzo', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/8
                             flex items-center justify-center text-slate-400
                             hover:bg-emerald-500/20 hover:text-emerald-400
                             hover:border-emerald-500/30 transition-all duration-300"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-widest uppercase">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={link.internal || link.scroll ? (e) => handleLink(e, link) : undefined}
                      className="text-sm text-slate-400 hover:text-emerald-400
                                 transition-colors duration-200 inline-flex items-center group"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between
                        gap-3 text-xs text-slate-500">
          <p>&copy; {currentYear} TrashSmart &middot; Coding Camp DBS Foundation</p>
          <p className="font-mono tracking-widest">CC26-PSU179</p>
        </div>
      </div>
    </footer>
  );
}
