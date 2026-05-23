import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Leaf, Rocket, Handshake } from 'lucide-react'

const BriefcaseIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-24 lg:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-forest/10 flex items-center justify-center text-forest">
                <BriefcaseIcon />
              </div>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-4">
              Karir di TrashSmart
            </h1>
            <p className="text-muted text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Kami sedang membangun tim yang passionate tentang keberlanjutan dan teknologi
            </p>

            <div className="bg-white border border-sage/20 rounded-2xl p-8 sm:p-12 shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-sage-light/40 flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-bold text-heading mb-3">
                  Segera Hadir
                </h2>
                <p className="text-body leading-relaxed mb-8">
                  Saat ini kami belum membuka lowongan pekerjaan. Namun, kami selalu mencari talenta terbaik untuk bergabung dengan tim kami.
                </p>
                <p className="text-sm text-muted mb-6">
                  Tertarik untuk bergabung? Kirimkan CV dan portfolio Anda ke:
                </p>
                <a
                  href="mailto:ecosortdbs@gmail.com?subject=Lamaran%20Kerja%20-%20TrashSmart"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white text-sm font-semibold rounded-xl
                             hover:bg-forest-dark transition-all duration-300 shadow-lg shadow-forest/20"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                  Kirim Lamaran
                </a>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Leaf, title: 'Misi Berkelanjutan', desc: 'Berkontribusi pada lingkungan yang lebih baik', color: 'text-forest bg-forest/10' },
                { icon: Rocket, title: 'Teknologi Modern', desc: 'Bekerja dengan AI dan teknologi terkini', color: 'text-terracotta bg-terracotta/10' },
                { icon: Handshake, title: 'Tim Solid', desc: 'Lingkungan kerja yang kolaboratif', color: 'text-[#5B21B6] bg-[#5B21B6]/10' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                    className="bg-white border border-sage/20 rounded-xl p-6 shadow-sm flex flex-col items-center text-center"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-semibold text-heading mb-2">{item.title}</h3>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
