import { Sparkles, RefreshCw, Loader2, AlertCircle, CheckCircle2, Coins, TriangleAlert } from 'lucide-react';

/**
 * Konfigurasi 4 kartu per kategori — warna & ikon mengikuti desain AI Insight lama.
 */
const CARD_SCHEMA = [
  {
    key: 'dampak',
    title: 'Dampak Lingkungan',
    Icon: TriangleAlert,
    colorClass: 'bg-red-50 text-red-700 border border-red-100',
    iconColor: '#b91c1c',
  },
  {
    key: 'penanganan',
    title: 'Penanganan Tepat',
    Icon: CheckCircle2,
    colorClass: 'bg-green-50 text-green-800 border border-green-100',
    iconColor: '#15803d',
  },
  {
    key: 'ekonomi',
    title: 'Nilai Ekonomis',
    Icon: Coins,
    colorClass: 'bg-amber-50 text-amber-800 border border-amber-100',
    iconColor: '#b45309',
  },
  {
    key: 'konversi',
    title: 'Konversi Kreatif',
    Icon: RefreshCw,
    colorClass: 'bg-blue-50 text-blue-800 border border-blue-100',
    iconColor: '#1d4ed8',
  },
];

/**
 * Panel Ulasan AI (GenAI) — 4-card grid layout.
 * Menerima `tips` sebagai object { dampak, penanganan, ekonomi, konversi }
 * atau string (fallback plain text).
 *
 * Props:
 * - tips: object | string | null
 * - loading: boolean
 * - error: string | null
 * - onRetry: () => void
 * - primaryColor: string — warna aksen header sesuai kategori
 * - className: string
 */
export default function AiTipsPanel({
  tips,
  loading,
  error,
  onRetry,
  primaryColor = '#2D5016',
  className = '',
}) {
  // Normalkan tips ke object
  const tipsObj = tips && typeof tips === 'object' ? tips : null;

  return (
    <div
      className={`rounded-3xl border border-sage/20 bg-white shadow-[0_4px_20px_rgba(45,80,22,0.02)] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-sage/10">
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: primaryColor }} className="shrink-0" />
          <h3 className="font-serif font-bold text-base text-heading">
            AI Insight — Analisis Sampah
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: `${primaryColor}18`,
              color: primaryColor,
            }}
          >
            Gemini AI
          </span>
          {!loading && onRetry && (
            <button
              onClick={onRetry}
              title="Muat ulang"
              className="p-1.5 rounded-lg hover:bg-cream transition-colors duration-150 cursor-pointer"
              style={{ color: primaryColor }}
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2
              size={26}
              className="animate-spin"
              style={{ color: primaryColor }}
            />
            <p className="text-xs text-muted">Gemini AI sedang menyusun analisis...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
            <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  Coba Lagi
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4-Card Grid */}
        {tipsObj && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CARD_SCHEMA.map(({ key, title, Icon, colorClass, iconColor }) => {
              const content = tipsObj[key];
              if (!content) return null;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl flex flex-col gap-2.5 transition-all duration-300 hover:shadow-sm ${colorClass}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={15} style={{ color: iconColor }} className="shrink-0" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">
                      {title}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {content}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Fallback: jika tips adalah string biasa (bukan object) */}
        {tips && typeof tips === 'string' && !loading && (
          <p className="text-sm text-body leading-relaxed">{tips}</p>
        )}
      </div>
    </div>
  );
}
