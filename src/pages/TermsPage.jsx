import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsPage() {
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
              Syarat & Ketentuan
            </h1>
            <p className="text-muted text-sm mb-8">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div className="prose prose-lg max-w-none">
              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Penerimaan Ketentuan</h2>
                <p className="text-body leading-relaxed">
                  Dengan mengakses dan menggunakan TrashSmart, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak boleh menggunakan layanan kami.
                </p>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Penggunaan Layanan</h2>
                <ul className="space-y-2 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda harus berusia minimal 13 tahun untuk menggunakan layanan ini</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda bertanggung jawab atas keamanan akun dan kata sandi Anda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda tidak boleh menggunakan layanan untuk tujuan ilegal atau tidak sah</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda tidak boleh mengganggu atau merusak layanan kami</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Konten Pengguna</h2>
                <p className="text-body leading-relaxed mb-4">
                  Dengan mengunggah gambar atau konten lainnya ke TrashSmart:
                </p>
                <ul className="space-y-2 text-body">
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda memberikan kami lisensi untuk menggunakan konten tersebut untuk meningkatkan layanan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda menjamin bahwa Anda memiliki hak untuk mengunggah konten tersebut</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-forest mt-1">•</span>
                    <span>Anda bertanggung jawab atas konten yang Anda unggah</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Batasan Tanggung Jawab</h2>
                <p className="text-body leading-relaxed">
                  TrashSmart menyediakan layanan klasifikasi sampah berbasis AI sebagaimana adanya. Kami tidak menjamin akurasi 100% dari hasil klasifikasi. Pengguna harus menggunakan penilaian mereka sendiri dalam mengelola sampah.
                </p>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 mb-6 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Perubahan Ketentuan</h2>
                <p className="text-body leading-relaxed">
                  Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Penggunaan layanan yang berkelanjutan setelah perubahan berarti Anda menerima ketentuan yang diperbarui.
                </p>
              </div>

              <div className="bg-white border border-sage/20 rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-heading mb-4">Kontak</h2>
                <p className="text-body leading-relaxed">
                  Untuk pertanyaan tentang syarat dan ketentuan ini, hubungi kami di{' '}
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
