import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, AlertTriangle, Leaf, Recycle, Clock, Sparkles, CheckCircle2, ShieldAlert, Coins, RefreshCw } from 'lucide-react';
import { usePrediction } from '../hooks/usePrediction';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { fadeIn, slideInLeft, slideInRight, staggerContainer, scaleIn } from '../lib/animations';
import { useTheme } from '../contexts/ThemeContext';

const getCardTheme = (title, isDark) => {
  const key = title.toUpperCase();
  if (isDark) {
    const darkThemes = {
      'DAMPAK LINGKUNGAN': { bg: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.25)', titleColor: '#f87171' },
      'PENANGANAN TEPAT': { bg: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', titleColor: '#34d399' },
      'NILAI EKONOMIS': { bg: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', titleColor: '#fbbf24' },
      'KONVERSI KREATIF': { bg: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.25)', titleColor: '#60a5fa' }
    };
    return darkThemes[key] || { bg: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', titleColor: '#ffffff' };
  } else {
    const lightThemes = {
      'DAMPAK LINGKUNGAN': { bg: '#fff5f5', border: '1px solid #fecaca', titleColor: '#dc2626' },
      'PENANGANAN TEPAT': { bg: '#f0fdf4', border: '1px solid #bbf7d0', titleColor: '#16a34a' },
      'NILAI EKONOMIS': { bg: '#fffbeb', border: '1px solid #fde68a', titleColor: '#d97706' },
      'KONVERSI KREATIF': { bg: '#eff6ff', border: '1px solid #bfdbfe', titleColor: '#2563eb' }
    };
    return lightThemes[key] || { bg: '#ffffff', border: '1px solid #e2e8f0', titleColor: '#475569' };
  }
};

const CATEGORY_CONFIG = {
  organik: {
    label: 'Organik',
    icon: Leaf,
    color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
    primaryColor: '#059669',
    bgBadge: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400',
    bgPill: 'border-emerald-300 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400',
    description: 'Sampah alami yang mudah membusuk dan terurai secara alami oleh mikroorganisme.'
  },
  anorganik: {
    label: 'Anorganik',
    icon: Recycle,
    color: 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/30',
    primaryColor: '#0284C7',
    bgBadge: 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400',
    bgPill: 'border-sky-300 dark:border-sky-800/30 bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400',
    description: 'Sampah buatan manusia yang tidak mudah terurai secara alami dan dapat didaur ulang.'
  },
  b3: {
    label: 'Limbah B3',
    icon: AlertTriangle,
    color: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30',
    primaryColor: '#DC2626',
    bgBadge: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400',
    bgPill: 'border-red-300 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400',
    description: 'Bahan Berbahaya dan Beracun yang memerlukan penanganan khusus demi keamanan lingkungan.'
  }
};

const CATEGORY_TIPS = {
  organik: {
    title: 'AI Insight — Analisis Sampah',
    cards: [
      {
        title: 'Dampak Lingkungan',
        desc: 'Membusuk dalam 1–4 minggu. Menghasilkan emisi gas metana berbahaya jika menumpuk di TPA tanpa oksigen.',
        icon: AlertTriangle
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Pisahkan dari sampah anorganik agar kering, masukkan ke wadah tertutup atau komposter organik rumah tangga.',
        icon: CheckCircle2
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Berkisar Rp 500 – Rp 1.500 per kilogram jika diolah menjadi pupuk kompos matang atau pakan budidaya maggot.',
        icon: Coins
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Sangat ideal diolah kembali menjadi pupuk kompos organik cair, eco-enzyme pembersih, atau sumber biogas.',
        icon: RefreshCw
      }
    ]
  },
  anorganik: {
    title: 'AI Insight — Analisis Sampah',
    cards: [
      {
        title: 'Dampak Lingkungan',
        desc: 'Butuh 450 tahun terurai di alam. Menyumbang mikroplastik di rantai makanan jika hancur terfragmentasi.',
        icon: AlertTriangle
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Kosongkan cairan, bilas bersih, pisahkan tutup dari badan botol, lalu buang ke wadah sampah biru.',
        icon: CheckCircle2
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Berkisar Rp 1.500 – Rp 3.500 per kilogram di Bank Sampah terdekat tergantung pada kebersihan & jenis plastik.',
        icon: Coins
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Dapat didaur ulang menjadi produk bernilai guna tinggi seperti pot tanaman, wadah baru, hingga serat poliester.',
        icon: RefreshCw
      }
    ]
  },
  b3: {
    title: 'AI Insight — Analisis Sampah',
    cards: [
      {
        title: 'Dampak Lingkungan',
        desc: 'Zat kimia beracun sangat korosif atau beracun bagi manusia & merusak rantai makanan lingkungan jangka panjang.',
        icon: AlertTriangle
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Simpan di wadah khusus yang tahan bocor, pisahkan dari sampah umum, dan serahkan ke TPS khusus limbah B3.',
        icon: CheckCircle2
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Tidak bernilai jual karena tergolong limbah berbahaya yang regulasinya ketat dan memerlukan pemusnahan profesional.',
        icon: Coins
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Dinetralisasi melalui metode fisika-kimia khusus atau dikelola aman oleh lembaga pengolahan limbah berizin.',
        icon: RefreshCw
      }
    ]
  }
};

function BoundingBoxOverlay({ imageUrl, detections, categoryColor }) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const drawBoxes = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !detections?.length) return;

    const rect = img.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((det) => {
      if (!det.bbox) return;
      const { x, y, width, height } = det.bbox;
      const px = x * canvas.width;
      const py = y * canvas.height;
      const pw = width * canvas.width;
      const ph = height * canvas.height;

      ctx.strokeStyle = categoryColor || '#1D9E75';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      const text = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const textW = ctx.measureText(text).width + 18;

      const labelX = px;
      const labelY = py - 20;
      const labelW = textW;
      const labelH = 20;

      ctx.fillStyle = '#0a1f15';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelW, labelH, [5, 5, 0, 0]);
        ctx.fill();
      } else {
        ctx.fillRect(labelX, labelY, labelW, labelH);
      }

      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 11px system-ui';
      ctx.fillText(text, labelX + 9, labelY + 14);
    });
  };

  useEffect(() => {
    drawBoxes();
    window.addEventListener('resize', drawBoxes);
    return () => window.removeEventListener('resize', drawBoxes);
  }, [detections]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} className="overflow-hidden">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Hasil Deteksi"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        className="mx-auto block"
        onLoad={drawBoxes}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = usePrediction(id);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black flex flex-col justify-between transition-colors duration-300">
        <Navbar />
        <div className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-xl w-full bg-white dark:bg-[#111111] rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm p-8 text-center space-y-6 transition-colors duration-300">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Menganalisis Data Sampah...</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Mengambil detail hasil klasifikasi AI dari basis data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black flex flex-col justify-between transition-colors duration-300">
        <Navbar />
        <div className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-[#111111] rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-md p-8 text-center space-y-6 transition-colors duration-300">
            <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto animate-bounce-slow" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Analisis Tidak Ditemukan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">ID deteksi "{id}" tidak terdaftar atau telah kadaluarsa.</p>
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="w-full py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all duration-300 shadow-sm"
            >
              Coba Pindai Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prediction = data?.data;
  const result = prediction?.result || prediction || {};
  
  let categoryKey = (result.category || prediction?.category || 'organik').toLowerCase();
  if (categoryKey === 'residu') categoryKey = 'b3';
  
  const catConfig = CATEGORY_CONFIG[categoryKey] || CATEGORY_CONFIG.organik;
  const CatIcon = catConfig.icon;
  const detections = result.detections || prediction?.detections || [];

  const rawImageUrl = prediction?.imageUrl || prediction?.image_url;
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');
  const imageUrl = rawImageUrl
    ? rawImageUrl.startsWith('http') ? rawImageUrl : `${backendBase}${rawImageUrl}`
    : null;

  const rawConfidence = result.confidence ?? prediction?.confidence ?? 0;
  const confidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence;
  const label = result.label ?? prediction?.label ?? 'Tidak terdeteksi';
  const tipsConfig = CATEGORY_TIPS[categoryKey] || CATEGORY_TIPS.organik;

  return (
    <PageTransition>
      <div className="h-screen bg-[#F8FAFC] dark:bg-black text-slate-900 dark:text-white flex flex-col overflow-hidden p-0 transition-colors duration-300">
        <Navbar />

        <main className="flex-grow pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full overflow-hidden flex flex-col">
          {/* Page Header - Compact */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            style={{ height: '56px' }}
            className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60 dark:border-white/5 shrink-0 transition-colors duration-300"
          >
            <div>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 700 }} className="text-slate-900 dark:text-white leading-tight">
                Hasil Pemindaian
              </h1>
            </div>
            <div className="flex items-center gap-3 text-right">
              <span style={{ fontSize: '0.78rem' }} className="text-slate-400 dark:text-white/40 font-mono">
                ID: #{id?.slice(0, 8)}
              </span>
              <span style={{ fontSize: '0.78rem' }} className="text-slate-500 dark:text-white/50 flex items-center gap-1">
                <Clock size={12} className="inline" />
                {prediction?.createdAt ? new Date(prediction.createdAt).toLocaleString('id-ID', { 
                  day: '2-digit', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 'Baru'}
              </span>
            </div>
          </motion.div>

          {/* Main Content Grid - Fits in viewport */}
          <div className="result-grid flex-1 min-h-0 overflow-hidden">
            {/* LEFT COLUMN - Image + Bottom Strip */}
            <motion.div 
              variants={slideInLeft}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', minHeight: 0 }}
              className="flex flex-col"
            >
              {/* Image Area */}
              <div 
                style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', flex: 1, minHeight: 0 }}
                className="bg-white dark:bg-[#111111] border border-slate-200/60 dark:border-white/5 result-image-area transition-colors duration-300"
              >
                {imageUrl ? (
                  <BoundingBoxOverlay
                    imageUrl={imageUrl}
                    detections={detections}
                    categoryColor={catConfig.primaryColor}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 dark:bg-black/30 flex items-center justify-center transition-colors duration-300">
                    <span className="text-sm text-slate-400 dark:text-white/30">Citra tidak tersedia</span>
                  </div>
                )}
              </div>

              {/* Bottom strip */}
              <div 
                style={{ height: '80px', flexShrink: 0 }}
                className="flex flex-col justify-between"
              >
                {/* Row 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CatIcon size={22} style={{ color: catConfig.primaryColor }} />
                    <span style={{ fontSize: '1.35rem', fontWeight: 800 }} className="text-slate-900 dark:text-white transition-colors duration-300">
                      {catConfig.label}
                    </span>
                  </div>
                  <motion.span 
                    animate={{ scale: [0.8, 1.05, 1] }} 
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ 
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      backgroundColor: catConfig.primaryColor + '15',
                      color: catConfig.primaryColor,
                      borderColor: catConfig.primaryColor + '30'
                    }} 
                    className="px-2.5 py-0.5 rounded-full border shrink-0"
                  >
                    {((confidence || 0) * 100).toFixed(1)}%
                  </motion.span>
                </div>

                {/* Row 2 */}
                <div style={{ fontSize: '0.8rem' }} className="text-slate-500 dark:text-white/60 font-medium leading-none transition-colors duration-300">
                  Terdeteksi: {label}
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }} className="font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider whitespace-nowrap">
                    Tingkat Kepastian
                  </span>
                  <div className="flex-grow h-[5px] bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(confidence || 0) * 100}%` }}
                      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ backgroundColor: catConfig.primaryColor }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN - AI Insights + Actions */}
            <motion.div 
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}
              className="flex flex-col result-right-col"
            >
              <div className="flex-grow overflow-auto scrollbar-thin bg-white dark:bg-[#111111] border border-slate-200/60 dark:border-white/5 rounded-xl p-5 shadow-sm flex flex-col min-h-0 transition-colors duration-300">
                <div className="mb-3.5 pb-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-500" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }} className="text-slate-800 dark:text-white">
                      AI Insight — Analisis Sampah
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/30 transition-colors duration-300">
                    Gemini AI
                  </span>
                </div>

                {/* 2x2 Grid for AI Insight Cards */}
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-2.5 flex-1 min-h-0 overflow-auto scrollbar-thin result-insights-grid"
                >
                  {tipsConfig.cards.map((card, idx) => {
                    const CardIcon = card.icon;
                    const themeObj = getCardTheme(card.title, isDark);
                    return (
                      <motion.div
                        key={idx}
                        variants={scaleIn}
                        className="p-4 rounded-xl flex flex-col transition-all duration-300"
                        style={{ 
                          backgroundColor: themeObj.bg, 
                          border: themeObj.border,
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-2 shrink-0">
                          <CardIcon size={14} className="shrink-0" style={{ color: themeObj.titleColor }} />
                          <h4 
                            style={{ color: themeObj.titleColor, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em' }} 
                            className="uppercase"
                          >
                            {card.title}
                          </h4>
                        </div>
                        <p 
                          style={{ fontSize: '0.78rem', lineHeight: '1.5' }} 
                          className="text-slate-600 dark:text-white/70 line-clamp-5 overflow-hidden flex-grow transition-colors duration-300"
                        >
                          {card.desc}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Short description */}
              <p style={{ fontSize: '0.82rem', margin: '8px 0' }} className="text-slate-400 dark:text-white/30 truncate leading-none shrink-0">
                * Analisis ini dihasilkan secara otomatis oleh sistem AI TrashSmart berdasarkan citra yang dipindai.
              </p>

              {/* Action Buttons - Pinned to bottom */}
              <div 
                style={{ height: '44px', gap: '8px' }} 
                className="flex mt-auto shrink-0 result-buttons-row"
              >
                <button
                  onClick={() => navigate('/upload')}
                  style={{ fontSize: '0.88rem', fontWeight: 600, height: '100%' }}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-emerald-500 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-700 hover:text-white dark:hover:text-white transition-all duration-200 shadow-sm bg-transparent cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Pindai Baru
                </button>
                <button
                  onClick={() => navigate('/predictions')}
                  style={{ fontSize: '0.88rem', fontWeight: 600, height: '100%' }}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-md cursor-pointer border-none outline-none"
                >
                  <History size={16} />
                  Riwayat
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
