import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-24 lg:pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-4">
              Kebijakan Privasi
            </h1>
            <p className="text-muted text-sm mb-8">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div className="prose prose-lg max-w-none">
              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Pendahuluan</h2>
                <p className="text-body leading-relaxed mb-4">
                  TrashSmart berkomitmen untuk melindungi privasi pengguna. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
                </p>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Informasi yang Kami Kumpulkan</h2>
                <ul className="space-y-2 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Data gambar sampah yang Anda unggah untuk klasifikasi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Informasi akun seperti email dan nama</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Data penggunaan aplikasi untuk analitik dan peningkatan layanan</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Penggunaan Informasi</h2>
                <p className="text-body leading-relaxed mb-4">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="space-y-2 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Menyediakan layanan klasifikasi sampah berbasis AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Meningkatkan akurasi model machine learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Memberikan analitik dan laporan kepada pengguna</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Berkomunikasi dengan Anda terkait layanan kami</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Keamanan Data</h2>
                <p className="text-body leading-relaxed">
                  Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
                </p>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Hubungi Kami</h2>
                <p className="text-body leading-relaxed">
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di{' '}
                  <a href="mailto:ecosortdbs@gmail.com" className="text-forest font-semibold hover:underline">
                    ecosortdbs@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
