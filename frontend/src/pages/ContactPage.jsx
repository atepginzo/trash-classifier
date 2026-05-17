import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* Icons */
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

/* Social icons */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const CONTACT_INFO = [
  { Icon: MailIcon, label: 'Email', value: 'trashsmart.team@gmail.com', color: 'bg-forest/10 text-forest' },
  { Icon: PhoneIcon, label: 'Telepon', value: '+62 812-3456-7890', color: 'bg-terracotta/10 text-terracotta' },
  { Icon: MapPinIcon, label: 'Lokasi', value: 'Jakarta, Indonesia', color: 'bg-[#5B21B6]/10 text-[#5B21B6]' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', message: '', agree: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ firstName: '', lastName: '', email: '', phone: '', message: '', agree: false });
  };

  const inputClass = `w-full px-4 py-3 text-sm bg-white border border-sage/30 rounded-xl
    text-heading placeholder-muted/50
    focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40
    transition-all duration-200`;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4 mb-12 sm:mb-16"
        >
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-3">
            Hubungi Kami
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            Apakah Anda memiliki pertanyaan atau masukan terkait aplikasi klasifikasi sampah?
            Tim kami siap membantu Anda.
          </p>
        </motion.div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

            {/* ======== Left: Contact Info ======== */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2 bg-white border border-sage/20 rounded-2xl p-6 sm:p-8
                         shadow-[0_2px_16px_rgba(0,0,0,0.04)] h-fit"
            >
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-6">
                Informasi Kontak
              </h2>

              <div className="space-y-5 mb-8">
                {CONTACT_INFO.map(({ Icon, label, value, color }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <Icon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading">{label}</p>
                      <p className="text-sm text-muted">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-heading mb-3">Ikuti Kami</p>
                <div className="flex items-center gap-2.5">
                  {[FacebookIcon, TwitterIcon, YoutubeIcon, InstagramIcon].map((Icon, i) => (
                    <a key={i} href="#" className="w-9 h-9 rounded-full bg-cream border border-sage/20
                                                   flex items-center justify-center text-muted
                                                   hover:bg-forest hover:text-white hover:border-forest
                                                   transition-all duration-300">
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ======== Right: Contact Form ======== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="lg:col-span-3 bg-white border border-sage/20 rounded-2xl p-6 sm:p-8
                         shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
            >
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-6">
                Kirim Pesan
              </h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-forest/10 border border-forest/20 rounded-xl text-sm text-forest font-medium"
                >
                  Pesan berhasil dikirim! Kami akan segera menghubungi Anda.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">Nama Depan</label>
                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                           placeholder="John" required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-heading mb-1.5">Nama Belakang</label>
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                           placeholder="Doe" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                         placeholder="user@gmail.com" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1.5">Nomor Telepon</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                         placeholder="+62 812 345 789" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1.5">Pesan</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                            placeholder="Tulis pesan Anda di sini..." required rows={4}
                            className={`${inputClass} resize-y min-h-[100px]`} />
                </div>
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} required
                         className="mt-0.5 w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest/30 accent-forest" />
                  <span className="text-xs text-muted leading-relaxed">
                    Saya setuju dengan{' '}
                    <a href="#" className="text-forest font-semibold hover:underline">kebijakan privasi</a>
                    {' '}TrashSmart
                  </span>
                </label>
                <button type="submit"
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5
                                   bg-forest text-white text-sm font-semibold rounded-xl
                                   hover:bg-forest-dark active:scale-[0.98]
                                   transition-all duration-300 shadow-lg shadow-forest/20">
                  <SendIcon />
                  Kirim Pesan
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
