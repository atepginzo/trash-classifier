/* Social media icons */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* Login icon */
const LoginIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="14" height="14" rx="3" />
    <circle cx="10" cy="8.5" r="2.2" /><path d="M5.5 16c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kontak" className="bg-forest-dark overflow-hidden">

      {/* ======== CTA Banner Strip ======== */}
      <div className="bg-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight">
              Mulai kelola sampah lebih cerdas
            </h3>
            <p className="text-sm sm:text-base text-white/50 max-w-md">
              Bergabung bersama organisasi pengelola limbah yang sudah menggunakan TrashSmart
            </p>
          </div>
          <a href="/login"
             className="inline-flex items-center gap-2.5 px-6 py-3 bg-transparent border border-white/30
                        text-white font-semibold text-sm rounded-lg
                        hover:bg-white/10 hover:border-white/50
                        transition-all duration-300 shrink-0">
            <LoginIcon />
            Masuk Sekarang
          </a>
        </div>
      </div>

      {/* ======== Main Footer ======== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
                  <path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.005-1.775L16.8 9.5" />
                  <path d="M14.469 3.592a1.835 1.835 0 00-1.563-.887h-.002a1.834 1.834 0 00-1.563.892L7.196 9.5" />
                </svg>
              </div>
              <span className="font-serif text-lg font-semibold text-white">TrashSmart</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
              Sistem klasifikasi sampah berbasis AI untuk mendukung pengelolaan limbah yang lebih efisien dan berkelanjutan.
            </p>
            <div className="flex items-center gap-3">
              {[FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/8 border border-white/10
                                              flex items-center justify-center text-white/50
                                              hover:bg-white/15 hover:text-white hover:border-white/25
                                              transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">Navigasi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Tentang', href: '/#tentang' },
                { label: 'Edukasi', href: '/#edukasi' },
                { label: 'Cara Pakai', href: '/#cara-pakai' },
                { label: 'Tim', href: '/team' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-white/50 hover:text-white transition-colors duration-200">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">Kontak</h4>
            <ul className="space-y-2.5">
              {['Email kami', 'WhatsApp', 'Telepon'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/50 hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider">Perusahaan</h4>
            <ul className="space-y-2.5">
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Karir'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/50 hover:text-white transition-colors duration-200">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>&copy; {currentYear} TrashSmart &middot; Coding Camp DBS Foundation</p>
          <p className="font-mono tracking-wider">CC26-PSU179</p>
        </div>
      </div>
    </footer>
  );
}
