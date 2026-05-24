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
const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Password tidak cocok. Silakan coba lagi.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1200);
  };

  /* Password strength */
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const strength = getStrength(form.password);
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][strength] || '';
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-forest-light', 'bg-forest'][strength] || '';

  const inputClass = `w-full px-4 py-3 text-sm bg-white border border-sage/30 rounded-xl
    text-heading placeholder-muted/50
    focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40
    transition-all duration-200`;

  const requirements = [
    { label: 'Minimal 8 karakter', met: form.password.length >= 8 },
    { label: 'Huruf kapital', met: /[A-Z]/.test(form.password) },
    { label: 'Angka', met: /[0-9]/.test(form.password) },
    { label: 'Karakter spesial', met: /[^A-Za-z0-9]/.test(form.password) },
  ];

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
                Buat Akun Baru
              </h1>
              <p className="text-sm text-muted">
                Daftar untuk mulai menggunakan TrashSmart
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">Nama Lengkap</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                       placeholder="Nama lengkap Anda" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                       placeholder="nama@email.com" required className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} name="password"
                         value={form.password} onChange={handleChange}
                         placeholder="Minimal 8 karakter" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors">
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : 'bg-sage/20'
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted">
                      Kekuatan: <span className="font-semibold">{strengthLabel}</span>
                    </p>
                  </div>
                )}
                {form.password && (
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    {requirements.map((req) => (
                      <div key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${
                        req.met ? 'text-forest' : 'text-muted/50'
                      }`}>
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-forest text-white' : 'bg-sage/15'
                        }`}>
                          {req.met && <CheckIcon />}
                        </span>
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">Konfirmasi Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword}
                       onChange={handleChange} placeholder="Ulangi password" required className={inputClass} />
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" required
                       className="mt-0.5 w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest/30 accent-forest" />
                <span className="text-xs text-muted leading-relaxed">
                  Saya menyetujui{' '}
                  <a href="#" className="text-forest font-semibold hover:underline">Syarat & Ketentuan</a>
                  {' '}dan{' '}
                  <a href="#" className="text-forest font-semibold hover:underline">Kebijakan Privasi</a>
                </span>
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
                    <UserPlusIcon />
                    Daftar Sekarang
                  </>
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-muted mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-forest font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
