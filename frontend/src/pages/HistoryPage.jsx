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
    color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
    primaryColor: '#059669',
    bgBadge: 'bg-emerald-50 text-emerald-700',
    bgPill: 'border-emerald-300 bg-emerald-50 text-emerald-700'
  },
  anorganik: { 
    label: 'Anorganik', 
    icon: Recycle, 
    color: 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/30',
    primaryColor: '#0284C7',
    bgBadge: 'bg-sky-50 text-sky-700',
    bgPill: 'border-sky-300 bg-sky-50 text-sky-700'
  },
  b3: { 
    label: 'Limbah B3', 
    icon: AlertTriangle, 
    color: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30',
    primaryColor: '#DC2626',
    bgBadge: 'bg-red-50 text-red-600',
    bgPill: 'border-red-300 bg-red-50 text-red-600'
  },
};

function SkeletonCards() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4 bg-white dark:bg-[#111111] border border-slate-100 dark:border-white/5 rounded-2xl p-4 shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-colors duration-300">
          <div className="w-16 h-16 bg-slate-100 dark:bg-white/10 rounded-xl shrink-0 transition-colors duration-300" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-slate-100 dark:bg-white/10 rounded w-1/3 transition-colors duration-300" />
            <div className="h-3 bg-slate-100 dark:bg-white/10 rounded w-1/2 transition-colors duration-300" />
          </div>
          <div className="h-6 w-20 bg-slate-100 dark:bg-white/10 rounded-full transition-colors duration-300" />
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
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black flex flex-col justify-between transition-colors duration-300">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Page Title & Breadcrumb */}
        <div className="flex flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3
                            bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50
                            text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide transition-colors duration-300">
              <History size={13} />
              Riwayat Aktivitas
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300 truncate">
              Daftar Prediksi AI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed transition-colors duration-300 hidden sm:block">
              Temukan kembali hasil klasifikasi sampah dan rekomendasi pemilahan yang telah Anda lakukan.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 text-white rounded-full text-xs sm:text-sm font-bold hover:bg-emerald-700 transition-all duration-300 shadow-sm cursor-pointer"
          >
            + Pindai Baru
          </Link>
        </div>

        {/* Outer Card Container */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200/60 dark:border-white/5 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] min-h-[420px] flex flex-col justify-between transition-colors duration-300">
          
          {loading ? (
            <SkeletonCards />
          ) : error ? (
            <div className="text-center py-16 space-y-5 flex-grow flex flex-col items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 animate-bounce-slow" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Gagal Memuat Data</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto transition-colors duration-300">
                  {error.message || 'Terjadi gangguan jaringan saat menghubungi server.'}
                </p>
              </div>
              <button
                onClick={() => setPage(page)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all duration-300 shadow-sm cursor-pointer"
              >
                <RefreshCw size={15} />
                Coba Lagi
              </button>
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-16 space-y-5 flex-grow flex flex-col items-center justify-center">
              <Inbox className="w-16 h-16 text-slate-300 dark:text-slate-600" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Riwayat Masih Kosong</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto transition-colors duration-300">
                  Anda belum pernah memindai sampah menggunakan asisten AI TrashSmart.
                </p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all duration-300 shadow-md cursor-pointer"
              >
                Mulai Pindai Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              <div className="divide-y divide-slate-100 dark:divide-white/5 border border-slate-200/60 dark:border-white/5 rounded-2xl bg-slate-50/30 dark:bg-[#1a1a1a] overflow-hidden shadow-inner transition-colors duration-300">
                {predictions.map((pred, i) => {
                  const result = pred.result || pred || {};
                  let category = (result.category || pred.category || 'organik').toLowerCase();
                  if (category === 'residu') category = 'b3';
                  const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.organik;
                  const CatIcon = catConfig.icon;
                  const confidence = result.confidence ?? pred.confidence ?? 0;
                  const label = result.label ?? pred.label ?? pred.topLabel ?? 'Tidak terdeteksi';

                  const rawImageUrl = pred.imageUrl || pred.image_url;
                  const imageUrl = rawImageUrl
                    ? rawImageUrl.startsWith('http') ? rawImageUrl : `${backendBase}${rawImageUrl}`
                    : null;

                  return (
                    <motion.div
                      key={pred.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => navigate(`/predictions/${pred.id}`)}
                      className="flex items-center gap-4 p-4 sm:p-5 hover:bg-white dark:hover:bg-[#222222] cursor-pointer transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-emerald-500"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="w-16 h-16 bg-slate-50 dark:bg-black border border-slate-100 dark:border-white/5 rounded-xl shrink-0 overflow-hidden shadow-sm relative transition-colors duration-300">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Leaf className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Info Metadata */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-800 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-150">
                          {label}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors duration-300">
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
                        <span className="text-xs font-mono font-bold bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 shadow-sm hidden sm:inline-block transition-colors duration-300">
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-white/10 pt-6 mt-6 transition-colors duration-300">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-full text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 order-first sm:order-none transition-colors duration-300">
                Halaman <span className="font-bold text-emerald-600 dark:text-emerald-400">{page}</span> dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-full text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
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
