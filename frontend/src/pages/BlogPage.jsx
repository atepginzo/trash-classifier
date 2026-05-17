import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/* Icons */
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* Full articles data */
const ALL_ARTICLES = [
  {
    id: 1, category: 'Penelitian AI',
    title: 'Optimasi Klasifikasi Sampah dengan YOLOv8 untuk Sistem Daur Ulang Otomatis',
    excerpt: 'Model YOLOv8 menunjukkan akurasi 94.7% dalam mendeteksi 6 kategori sampah secara real-time pada conveyor belt industri daur ulang. Studi ini membandingkan performa dengan YOLOv5 dan Faster R-CNN.',
    author: 'Zhang et al.', source: 'IEEE Access, 2024', date: '15 Mar 2025', readTime: '8 min',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 2, category: 'Lingkungan',
    title: 'Dampak Ekonomi Sirkular terhadap Pengurangan Limbah Plastik di Asia Tenggara',
    excerpt: 'Studi menunjukkan implementasi ekonomi sirkular dapat mengurangi limbah plastik laut hingga 65% di kawasan ASEAN pada tahun 2030 dengan investasi infrastruktur yang tepat.',
    author: 'Wijaya & Putri', source: 'Waste Management Journal, 2024', date: '28 Feb 2025', readTime: '12 min',
    tag: 'bg-terracotta/10 text-terracotta',
  },
  {
    id: 3, category: 'Teknologi',
    title: 'Smart Waste Management: Integrasi IoT dan Deep Learning untuk Kota Cerdas',
    excerpt: 'Sensor IoT dikombinasikan dengan model CNN mampu mengoptimalkan rute pengangkutan sampah dan mengurangi biaya operasional hingga 40%.',
    author: 'Kumar et al.', source: 'Sensors MDPI, 2024', date: '10 Feb 2025', readTime: '10 min',
    tag: 'bg-[#5B21B6]/10 text-[#5B21B6]',
  },
  {
    id: 4, category: 'Daur Ulang',
    title: 'Chemical Recycling: Teknologi Pirolisis untuk Mengubah Sampah Plastik Menjadi Bahan Bakar',
    excerpt: 'Metode pirolisis katalitik berhasil mengkonversi 85% limbah plastik campuran menjadi bahan bakar cair berkualitas tinggi dengan emisi karbon 60% lebih rendah.',
    author: 'Chen & Liu', source: 'Resources, Conservation and Recycling, 2024', date: '22 Jan 2025', readTime: '15 min',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 5, category: 'Penelitian AI',
    title: 'Transfer Learning pada Deteksi Sampah: Perbandingan EfficientNet vs MobileNet',
    excerpt: 'EfficientNet-B4 dengan transfer learning mencapai F1-score 0.96 pada dataset TrashNet, mengungguli MobileNetV3 dalam akurasi namun lebih lambat.',
    author: 'Park & Kim', source: 'arXiv Preprint, 2024', date: '05 Jan 2025', readTime: '7 min',
    tag: 'bg-terracotta/10 text-terracotta',
  },
  {
    id: 6, category: 'Kebijakan',
    title: 'Extended Producer Responsibility: Evaluasi Kebijakan Pengelolaan Sampah di Indonesia',
    excerpt: 'Analisis implementasi EPR di 5 kota besar Indonesia menunjukkan peningkatan tingkat daur ulang dari 12% menjadi 34% dalam 2 tahun.',
    author: 'Setiawan et al.', source: 'Journal of Cleaner Production, 2024', date: '18 Dec 2024', readTime: '11 min',
    tag: 'bg-[#5B21B6]/10 text-[#5B21B6]',
  },
  {
    id: 7, category: 'Teknologi',
    title: 'Hyperspectral Imaging untuk Identifikasi Jenis Polimer pada Proses Sortasi Sampah',
    excerpt: 'Teknologi hyperspectral imaging mampu membedakan 12 jenis polimer plastik dengan akurasi 98.2%, meningkatkan kualitas material daur ulang.',
    author: 'Schmidt et al.', source: 'Waste Management, 2024', date: '02 Dec 2024', readTime: '9 min',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 8, category: 'Lingkungan',
    title: 'Microplastic Detection in Soil: Dampak Kontaminasi Mikroplastik pada Ekosistem Tanah',
    excerpt: 'Penelitian menemukan konsentrasi mikroplastik di tanah pertanian Indonesia mencapai 2.400 partikel per kilogram, mempengaruhi kesuburan tanah.',
    author: 'Rahmawati & Hakim', source: 'Environmental Pollution, 2024', date: '15 Nov 2024', readTime: '13 min',
    tag: 'bg-terracotta/10 text-terracotta',
  },
  {
    id: 9, category: 'Penelitian AI',
    title: 'Mask R-CNN vs YOLOv8: Studi Komparatif untuk Segmentasi Sampah pada Citra Kompleks',
    excerpt: 'Mask R-CNN lebih unggul untuk segmentasi detail pada objek tumpang tindih, sementara YOLOv8 30x lebih cepat untuk deteksi real-time.',
    author: 'Li & Wang', source: 'Pattern Recognition, 2024', date: '01 Nov 2024', readTime: '14 min',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 10, category: 'Kebijakan',
    title: 'Insentif Berbasis Aplikasi Mobile untuk Meningkatkan Partisipasi Masyarakat dalam Daur Ulang',
    excerpt: 'Program reward digital melalui aplikasi mobile berhasil meningkatkan partisipasi warga dalam pemilahan sampah sebesar 78% di Kota Bandung.',
    author: 'Nugroho et al.', source: 'Sustainability MDPI, 2024', date: '20 Oct 2024', readTime: '8 min',
    tag: 'bg-[#5B21B6]/10 text-[#5B21B6]',
  },
  {
    id: 11, category: 'Daur Ulang',
    title: 'Enzyme-Based Recycling: Dekonstruksi Biologis PET Menjadi Monomer Murni',
    excerpt: 'Enzim PETase generasi terbaru mampu mendekomposisi botol PET dalam 24 jam, menghasilkan monomer murni untuk produksi plastik baru.',
    author: 'Tournier et al.', source: 'Nature, 2024', date: '08 Oct 2024', readTime: '16 min',
    tag: 'bg-terracotta/10 text-terracotta',
  },
  {
    id: 12, category: 'Lingkungan',
    title: 'Life Cycle Assessment: Perbandingan Dampak Lingkungan antara Reuse vs Recycle Tekstil',
    excerpt: 'LCA komprehensif menunjukkan reuse pakaian menghemat 70% emisi karbon dibandingkan recycling serat, mendorong model bisnis second-hand.',
    author: 'Anderson & Berg', source: 'Journal of Industrial Ecology, 2024', date: '25 Sep 2024', readTime: '10 min',
    tag: 'bg-forest/10 text-forest',
  },
];

const CATEGORIES = ['Semua', 'Penelitian AI', 'Lingkungan', 'Teknologi', 'Daur Ulang', 'Kebijakan'];

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = ALL_ARTICLES.filter((a) => {
    const matchCat = activeFilter === 'Semua' || a.category === activeFilter;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center px-4 mb-8 sm:mb-12"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase
                           bg-forest/8 text-forest rounded-full mb-4">
            Blog & Artikel
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-heading tracking-tight mb-3">
            Riset & Wawasan Terbaru
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto">
            Kumpulan penelitian dan artikel terkini seputar pengelolaan sampah, teknologi AI, daur ulang, dan keberlanjutan lingkungan
          </p>
        </motion.div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="relative max-w-md mx-auto mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"><SearchIcon /></span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                   placeholder="Cari artikel..."
                   className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-sage/25 rounded-xl
                              text-heading placeholder-muted/50
                              focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40
                              transition-all duration-200" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                      className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 ${
                        activeFilter === cat
                          ? 'bg-forest text-white border-forest'
                          : 'bg-white text-muted border-sage/25 hover:border-forest/30 hover:text-forest'
                      }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted text-lg">Tidak ada artikel ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="bg-white border border-sage/20 rounded-2xl overflow-hidden
                             shadow-[0_2px_16px_rgba(0,0,0,0.04)]
                             hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1
                             transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${article.tag}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-muted">{article.date}</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-heading leading-snug mb-2.5
                                   group-hover:text-forest transition-colors duration-200 line-clamp-3">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 mb-4 px-2.5 py-1.5 bg-cream-light rounded-lg w-fit">
                      <ExternalIcon />
                      <span className="text-xs text-muted font-medium">{article.source}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-sage/15">
                      <span className="text-xs font-medium text-body">{article.author}</span>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <ClockIcon />
                        {article.readTime}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
