import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* Blog articles data */
const BLOG_ARTICLES = [
  {
    id: 1,
    category: 'Penelitian AI',
    title: 'Optimasi Klasifikasi Sampah dengan YOLOv8 untuk Sistem Daur Ulang Otomatis',
    excerpt: 'Model YOLOv8 menunjukkan akurasi 94.7% dalam mendeteksi 6 kategori sampah secara real-time pada conveyor belt industri daur ulang.',
    author: 'Zhang et al.',
    source: 'IEEE Access, 2024',
    date: '15 Mar 2025',
    readTime: '8 min',
    color: 'bg-forest/8',
    accent: 'text-forest',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 2,
    category: 'Lingkungan',
    title: 'Dampak Ekonomi Sirkular terhadap Pengurangan Limbah Plastik di Asia Tenggara',
    excerpt: 'Studi menunjukkan implementasi ekonomi sirkular dapat mengurangi limbah plastik laut hingga 65% di kawasan ASEAN pada tahun 2030.',
    author: 'Wijaya & Putri',
    source: 'Waste Management Journal, 2024',
    date: '28 Feb 2025',
    readTime: '12 min',
    color: 'bg-terracotta/8',
    accent: 'text-terracotta',
    tag: 'bg-terracotta/10 text-terracotta',
  },
  {
    id: 3,
    category: 'Teknologi',
    title: 'Smart Waste Management: Integrasi IoT dan Deep Learning untuk Kota Cerdas',
    excerpt: 'Sensor IoT dikombinasikan dengan model CNN mampu mengoptimalkan rute pengangkutan sampah dan mengurangi biaya operasional hingga 40%.',
    author: 'Kumar et al.',
    source: 'Sensors MDPI, 2024',
    date: '10 Feb 2025',
    readTime: '10 min',
    color: 'bg-[#5B21B6]/8',
    accent: 'text-[#5B21B6]',
    tag: 'bg-[#5B21B6]/10 text-[#5B21B6]',
  },
  {
    id: 4,
    category: 'Daur Ulang',
    title: 'Chemical Recycling: Teknologi Pirolisis untuk Mengubah Sampah Plastik Menjadi Bahan Bakar',
    excerpt: 'Metode pirolisis katalitik berhasil mengkonversi 85% limbah plastik campuran menjadi bahan bakar cair berkualitas tinggi.',
    author: 'Chen & Liu',
    source: 'Resources, Conservation and Recycling, 2024',
    date: '22 Jan 2025',
    readTime: '15 min',
    color: 'bg-forest/8',
    accent: 'text-forest',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 5,
    category: 'Penelitian AI',
    title: 'Transfer Learning pada Deteksi Sampah: Perbandingan EfficientNet vs MobileNet',
    excerpt: 'EfficientNet-B4 dengan transfer learning mencapai F1-score 0.96 pada dataset TrashNet, mengungguli MobileNetV3 dalam akurasi.',
    author: 'Park & Kim',
    source: 'arXiv Preprint, 2024',
    date: '05 Jan 2025',
    readTime: '7 min',
    color: 'bg-terracotta/8',
    accent: 'text-terracotta',
    tag: 'bg-terracotta/10 text-terracotta',
  },
  {
    id: 6,
    category: 'Kebijakan',
    title: 'Extended Producer Responsibility: Evaluasi Kebijakan Pengelolaan Sampah di Indonesia',
    excerpt: 'Analisis implementasi EPR di 5 kota besar Indonesia menunjukkan peningkatan tingkat daur ulang dari 12% menjadi 34% dalam 2 tahun.',
    author: 'Setiawan et al.',
    source: 'Journal of Cleaner Production, 2024',
    date: '18 Dec 2024',
    readTime: '11 min',
    color: 'bg-[#5B21B6]/8',
    accent: 'text-[#5B21B6]',
    tag: 'bg-[#5B21B6]/10 text-[#5B21B6]',
  },
  {
    id: 7,
    category: 'Teknologi',
    title: 'Hyperspectral Imaging untuk Identifikasi Jenis Polimer pada Proses Sortasi Sampah',
    excerpt: 'Teknologi hyperspectral imaging mampu membedakan 12 jenis polimer plastik dengan akurasi 98.2%, meningkatkan kualitas daur ulang.',
    author: 'Schmidt et al.',
    source: 'Waste Management, 2024',
    date: '02 Dec 2024',
    readTime: '9 min',
    color: 'bg-forest/8',
    accent: 'text-forest',
    tag: 'bg-forest/10 text-forest',
  },
  {
    id: 8,
    category: 'Lingkungan',
    title: 'Microplastic Detection in Soil: Dampak Kontaminasi Mikroplastik pada Ekosistem Tanah',
    excerpt: 'Penelitian terbaru menemukan konsentrasi mikroplastik di tanah pertanian Indonesia mencapai 2.400 partikel per kilogram.',
    author: 'Rahmawati & Hakim',
    source: 'Environmental Pollution, 2024',
    date: '15 Nov 2024',
    readTime: '13 min',
    color: 'bg-terracotta/8',
    accent: 'text-terracotta',
    tag: 'bg-terracotta/10 text-terracotta',
  },
];

/* Arrow icons */
const ArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
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

export default function BlogSection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  return (
    <section id="blog" className="relative py-20 sm:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase
                             bg-forest/8 text-forest rounded-full mb-4">
              Blog & Artikel
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-heading tracking-tight leading-tight">
              Riset & Wawasan Terbaru
            </h2>
            <p className="text-muted text-base sm:text-lg mt-2 max-w-lg">
              Kumpulan penelitian dan artikel terkini seputar pengelolaan sampah, AI, dan keberlanjutan
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button onClick={() => scroll(-1)} disabled={!canScrollLeft}
                    className="w-10 h-10 rounded-full border border-sage/30 flex items-center justify-center
                               text-muted hover:bg-forest hover:text-white hover:border-forest
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all duration-200">
              <ArrowLeft />
            </button>
            <button onClick={() => scroll(1)} disabled={!canScrollRight}
                    className="w-10 h-10 rounded-full border border-sage/30 flex items-center justify-center
                               text-muted hover:bg-forest hover:text-white hover:border-forest
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all duration-200">
              <ArrowRight />
            </button>
          </div>
        </motion.div>
        <div className="relative">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {BLOG_ARTICLES.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="min-w-[320px] sm:min-w-[350px] max-w-[380px] bg-white border border-sage/20
                           rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)]
                           hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1
                           transition-all duration-300 flex flex-col group cursor-pointer"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className={`h-1.5 ${article.color.replace('/8', '')}`} />

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
        </div>
        <div className="flex sm:hidden items-center justify-center gap-3 mt-6">
          <button onClick={() => scroll(-1)} disabled={!canScrollLeft}
                  className="w-10 h-10 rounded-full border border-sage/30 flex items-center justify-center
                             text-muted disabled:opacity-30 transition-all">
            <ArrowLeft />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScrollRight}
                  className="w-10 h-10 rounded-full border border-sage/30 flex items-center justify-center
                             text-muted disabled:opacity-30 transition-all">
            <ArrowRight />
          </button>
        </div>
        <div className="text-center mt-8">
          <a href="/blog"
             className="inline-flex items-center gap-2 text-sm font-semibold text-forest
                        hover:underline underline-offset-4 transition-colors">
            Lihat semua artikel
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
