import { useNavigate, Link } from 'react-router-dom';
import { History, ChevronLeft, ChevronRight, Inbox, AlertTriangle, Leaf, Recycle, Trash2 } from 'lucide-react';
import { usePredictions } from '../hooks/usePredictions';

const CATEGORY_CONFIG = {
  organik: { label: 'Organik', icon: Leaf, color: 'bg-green-100 text-green-700' },
  anorganik: { label: 'Anorganik', icon: Recycle, color: 'bg-blue-100 text-blue-700' },
  residu: { label: 'Residu', icon: Trash2, color: 'bg-amber-100 text-amber-700' },
};

function SkeletonCards() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4 bg-gray-100 rounded-xl p-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Riwayat Prediksi</h1>
          </div>
          <SkeletonCards />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">Gagal Memuat Data</h2>
          <p className="text-sm text-gray-500">{error.message || 'Terjadi kesalahan saat mengambil data.'}</p>
          <button
            onClick={() => setPage(page)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center p-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">Riwayat Prediksi</h1>
          </div>
          <Link
            to="/upload"
            className="text-sm text-green-600 font-medium hover:underline"
          >
            + Upload Baru
          </Link>
        </div>
        {predictions.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Inbox className="w-16 h-16 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">Belum ada prediksi</p>
            <p className="text-sm text-gray-400">Upload foto sampah untuk memulai klasifikasi</p>
            <Link
              to="/upload"
              className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Upload Sekarang
            </Link>
          </div>
        )}
        {predictions.length > 0 && (
          <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
            {predictions.map((pred) => {
              const category = pred.category?.toLowerCase() || 'organik';
              const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.organik;
              const CatIcon = catConfig.icon;

              return (
                <div
                  key={pred.id}
                  onClick={() => navigate(`/predictions/${pred.id}`)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                    {pred.imageUrl || pred.image_url ? (
                      <img
                        src={pred.imageUrl || pred.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Leaf className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {pred.label || pred.topLabel || 'Tidak ada label'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {pred.createdAt ? new Date(pred.createdAt).toLocaleString('id-ID') : '-'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${catConfig.color}`}>
                    <CatIcon className="w-3 h-3" />
                    {catConfig.label}
                  </span>
                  <span className="text-xs font-mono text-gray-500 shrink-0">
                    {((pred.confidence || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {predictions.length > 0 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <span className="text-sm text-gray-500">
              Halaman <span className="font-semibold text-gray-800">{page}</span> dari {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
