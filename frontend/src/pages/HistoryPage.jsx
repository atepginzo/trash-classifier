import { useNavigate, Link } from 'react-router-dom';
import { History, ChevronLeft, ChevronRight, Inbox, AlertTriangle, Leaf, Recycle, Trash2, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { usePredictions } from '../hooks/usePredictions';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const CATEGORY_CONFIG = {
  organik: { 
    label: 'Organik', 
    icon: Leaf, 
    color: 'bg-forest/5 text-forest border-forest/15',
    primaryColor: '#2D5016',
    bgBadge: 'bg-forest/10 text-forest',
    bgPill: 'border-forest bg-forest/5 text-forest'
  },
  anorganik: { 
    label: 'Anorganik', 
    icon: Recycle, 
    color: 'bg-blue/5 text-blue border-blue/15',
    primaryColor: '#1860a0',
    bgBadge: 'bg-blue/10 text-blue',
    bgPill: 'border-blue bg-blue/5 text-blue'
  },
  b3: { 
    label: 'Limbah B3', 
    icon: AlertTriangle, 
    color: 'bg-red-light text-red border-red/15',
    primaryColor: '#a32d2d',
    bgBadge: 'bg-red-light text-red',
    bgPill: 'border-red bg-red-light text-red'
  },
};

function SkeletonCards() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4 bg-white border border-sage/10 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          <div className="w-16 h-16 bg-cream rounded-xl shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-cream rounded w-1/3" />
            <div className="h-3 bg-cream rounded w-1/2" />
          </div>
          <div className="h-6 w-20 bg-cream rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { data, loading, error, page, setPage } = usePredictions();

  const predictions = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3
                            bg-forest/8 border border-forest/15
                            text-forest text-xs font-semibold tracking-wide">
              <History size={13} />
              Riwayat Aktivitas
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading tracking-tight">
              Daftar Prediksi AI
            </h1>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Temukan kembali hasil klasifikasi sampah dan rekomendasi pemilahan yang telah Anda lakukan.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-forest text-white rounded-full text-sm font-bold hover:bg-forest-dark transition-all duration-300 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            + Pindai Baru
          </Link>
        </div>

        {/* Outer Card Container */}
        <div className="bg-white border border-sage/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(45,80,22,0.02)] min-h-[420px] flex flex-col justify-between">
          
          {loading ? (
            <SkeletonCards />
          ) : error ? (
            <div className="text-center py-16 space-y-5 flex-grow flex flex-col items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-terracotta animate-bounce-slow" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-heading">Gagal Memuat Data</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  {error.message || 'Terjadi gangguan jaringan saat menghubungi server.'}
                </p>
              </div>
              <button
                onClick={() => setPage(page)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-forest text-white rounded-full font-bold hover:bg-forest-dark transition-all duration-300 shadow-sm cursor-pointer"
              >
                <RefreshCw size={15} />
                Coba Lagi
              </button>
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-16 space-y-5 flex-grow flex flex-col items-center justify-center">
              <Inbox className="w-16 h-16 text-sage/40" />
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-heading">Riwayat Masih Kosong</h3>
                <p className="text-sm text-muted max-w-sm mx-auto">
                  Anda belum pernah memindai sampah menggunakan asisten AI TrashSmart.
                </p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest text-white rounded-full font-bold hover:bg-forest-dark transition-all duration-300 shadow-md cursor-pointer"
              >
                Mulai Pindai Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              <div className="divide-y divide-sage/10 border border-sage/20 rounded-2xl bg-cream-light/30 overflow-hidden shadow-inner">
                {predictions.map((pred, i) => {
                  const result = pred.result || pred || {};
                  let category = (result.category || pred.category || 'organik').toLowerCase();
                  if (category === 'residu') category = 'b3';
                  const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.organik;
                  const CatIcon = catConfig.icon;
                  const confidence = result.confidence ?? pred.confidence ?? 0;
                  const label = result.label ?? pred.label ?? pred.topLabel ?? 'Tidak terdeteksi';

                  return (
                    <motion.div
                      key={pred.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => navigate(`/predictions/${pred.id}`)}
                      className="flex items-center gap-4 p-4 sm:p-5 hover:bg-white cursor-pointer transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-forest"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="w-16 h-16 bg-cream border border-sage/10 rounded-xl shrink-0 overflow-hidden shadow-sm relative">
                        {pred.imageUrl || pred.image_url ? (
                          <img
                            src={pred.imageUrl || pred.image_url}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sage">
                            <Leaf className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Info Metadata */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-heading truncate group-hover:text-forest transition-colors duration-150">
                          {label}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted mt-1">
                          <Clock size={12} />
                          <span>{pred.createdAt ? new Date(pred.createdAt).toLocaleString('id-ID') : '-'}</span>
                        </div>
                      </div>

                      {/* Status / Category Badges */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${catConfig.color}`}>
                          <CatIcon size={12} />
                          {catConfig.label}
                        </span>
                        <span className="text-xs font-mono font-bold bg-cream-light border border-sage/15 px-2.5 py-1 rounded-lg text-muted shadow-sm hidden sm:inline-block">
                          {((confidence || 0) * 100).toFixed(0)}% Akurasi
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && predictions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sage/10 pt-6 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-sage/35 text-body rounded-full text-sm font-bold hover:bg-forest/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              <span className="text-sm font-medium text-body order-first sm:order-none">
                Halaman <span className="font-bold text-forest">{page}</span> dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-sage/35 text-body rounded-full text-sm font-bold hover:bg-forest/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                Berikutnya
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
