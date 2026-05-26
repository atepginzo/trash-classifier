import { useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, History, AlertTriangle, Leaf, Recycle, Trash2, Clock, Sparkles, CheckCircle2, ShieldAlert, Coins, RefreshCw } from 'lucide-react';
import { usePrediction } from '../hooks/usePrediction';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const CATEGORY_CONFIG = {
  organik: {
    label: 'Organik',
    icon: Leaf,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    primaryColor: '#059669',
    bgBadge: 'bg-emerald-50 text-emerald-700',
    bgPill: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    description: 'Sampah alami yang mudah membusuk dan terurai secara alami oleh mikroorganisme.'
  },
  anorganik: {
    label: 'Anorganik',
    icon: Recycle,
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    primaryColor: '#0284C7',
    bgBadge: 'bg-sky-50 text-sky-700',
    bgPill: 'border-sky-300 bg-sky-50 text-sky-700',
    description: 'Sampah buatan manusia yang tidak mudah terurai secara alami dan dapat didaur ulang.'
  },
  b3: {
    label: 'Limbah B3',
    icon: AlertTriangle,
    color: 'bg-red-50 text-red-600 border-red-200',
    primaryColor: '#DC2626',
    bgBadge: 'bg-red-50 text-red-600',
    bgPill: 'border-red-300 bg-red-50 text-red-600',
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
        icon: AlertTriangle,
        color: 'bg-red-50 text-red-600 border border-red-100'
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Pisahkan dari sampah anorganik agar kering, masukkan ke wadah tertutup atau komposter organik rumah tangga.',
        icon: CheckCircle2,
        color: 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Berkisar Rp 500 – Rp 1.500 per kilogram jika diolah menjadi pupuk kompos matang atau pakan budidaya maggot.',
        icon: Coins,
        color: 'bg-amber-50 text-amber-700 border border-amber-100'
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Sangat ideal diolah kembali menjadi pupuk kompos organik cair, eco-enzyme pembersih, atau sumber biogas.',
        icon: RefreshCw,
        color: 'bg-sky-50 text-sky-700 border border-sky-100'
      }
    ]
  },
  anorganik: {
    title: 'AI Insight — Analisis Sampah',
    cards: [
      {
        title: 'Dampak Lingkungan',
        desc: 'Butuh 450 tahun terurai di alam. Menyumbang mikroplastik di rantai makanan jika hancur terfragmentasi.',
        icon: AlertTriangle,
        color: 'bg-red-light/60 text-red border border-red/10'
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Kosongkan cairan, bilas bersih, pisahkan tutup dari badan botol, lalu buang ke wadah sampah biru.',
        icon: CheckCircle2,
        color: 'bg-green-light/60 text-green border border-green/10'
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Berkisar Rp 1.500 – Rp 3.500 per kilogram di Bank Sampah terdekat tergantung pada kebersihan & jenis plastik.',
        icon: Coins,
        color: 'bg-terracotta/5 text-terracotta border border-terracotta/10'
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Dapat didaur ulang menjadi produk bernilai guna tinggi seperti pot tanaman, wadah baru, hingga serat poliester.',
        icon: RefreshCw,
        color: 'bg-blue-light/60 text-blue border border-blue/10'
      }
    ]
  },
  b3: {
    title: 'AI Insight — Analisis Sampah',
    cards: [
      {
        title: 'Dampak Lingkungan',
        desc: 'Zat kimia beracun sangat korosif atau beracun bagi manusia & merusak rantai makanan lingkungan jangka panjang.',
        icon: AlertTriangle,
        color: 'bg-red-light/60 text-red border border-red/10'
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Simpan di wadah khusus yang tahan bocor, pisahkan dari sampah umum, dan serahkan ke TPS khusus limbah B3.',
        icon: CheckCircle2,
        color: 'bg-green-light/60 text-green border border-green/10'
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Tidak bernilai jual karena tergolong limbah berbahaya yang regulasinya ketat dan memerlukan pemusnahan profesional.',
        icon: Coins,
        color: 'bg-terracotta/5 text-terracotta border border-terracotta/10'
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Dinetralisasi melalui metode fisika-kimia khusus atau dikelola aman oleh lembaga pengolahan limbah berizin.',
        icon: RefreshCw,
        color: 'bg-blue-light/60 text-blue border border-blue/10'
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

      // Bounding box border
      ctx.strokeStyle = categoryColor || '#2d9e6b';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      // Label ABOVE the box
      const text = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const textW = ctx.measureText(text).width + 20;

      const labelX = px;
      const labelY = py - 24;
      const labelW = textW;
      const labelH = 22;

      // Background for label
      ctx.fillStyle = '#1e3a2f';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelW, labelH, [6, 6, 0, 0]);
        ctx.fill();
      } else {
        ctx.fillRect(labelX, labelY, labelW, labelH);
      }

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px system-ui';
      ctx.fillText(text, labelX + 10, labelY + 15);
    });
  };

  useEffect(() => {
    drawBoxes();
    window.addEventListener('resize', drawBoxes);
    return () => window.removeEventListener('resize', drawBoxes);
  }, [detections]);

  return (
    <div className="relative inline-block w-full overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50/40">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Hasil Deteksi"
        className="w-full h-auto max-h-[360px] object-contain mx-auto block"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-800">Menganalisis Data Sampah...</h2>
              <p className="text-sm text-slate-500">Mengambil detail hasil klasifikasi AI dari basis data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/60 shadow-md p-8 text-center space-y-6">
            <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto animate-bounce-slow" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-800">Analisis Tidak Ditemukan</h2>
              <p className="text-sm text-slate-500">ID deteksi "{id}" tidak terdaftar atau telah kadaluarsa.</p>
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

  // Resolve imageUrl: path relatif → URL absolut
  const rawImageUrl = prediction?.imageUrl || prediction?.image_url;
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '');
  const imageUrl = rawImageUrl
    ? rawImageUrl.startsWith('http') ? rawImageUrl : `${backendBase}${rawImageUrl}`
    : null;

  const confidence = result.confidence ?? prediction?.confidence ?? 0;
  const label = result.label ?? prediction?.label ?? 'Tidak terdeteksi';
  const tipsConfig = CATEGORY_TIPS[categoryKey] || CATEGORY_TIPS.organik;

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full overflow-hidden flex flex-col">
        {/* Page Header - Compact */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60">
          <div>
            <h1 style={{ fontSize: '1.375rem' }} className="font-semibold text-slate-900 leading-tight">
              Hasil Pemindaian
            </h1>
          </div>
          <div className="flex items-center gap-3 text-right">
            <span style={{ fontSize: '0.8rem' }} className="text-slate-400 font-mono">
              ID: #{id?.slice(0, 8)}
            </span>
            <span style={{ fontSize: '0.8rem' }} className="text-slate-500">
              {prediction?.createdAt ? new Date(prediction.createdAt).toLocaleString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : 'Baru'}
            </span>
          </div>
        </div>

        {/* Main Content Grid - Fits in viewport */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1.2fr',
            gap: '1.5rem',
            maxHeight: 'calc(100vh - 140px)',
            overflow: 'hidden'
          }}
          className="result-grid"
        >
          {/* LEFT COLUMN - Image + Classification */}
          <div className="flex flex-col gap-4 overflow-auto scrollbar-thin">
            {/* Image with Bounding Box */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm">
              <div className="mb-3">
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }} className="font-bold text-slate-400 uppercase">
                  Citra Terdeteksi
                </span>
              </div>
              
              {imageUrl ? (
                <BoundingBoxOverlay
                  imageUrl={imageUrl}
                  detections={detections}
                  categoryColor={catConfig.primaryColor}
                />
              ) : (
                <div className="w-full h-48 bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
                  <span className="text-sm text-slate-400">Gambar tidak tersedia</span>
                </div>
              )}
            </div>

            {/* Classification Result */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-lg ${catConfig.color} border shrink-0`}>
                  <CatIcon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 style={{ fontSize: '1.5rem' }} className="font-bold text-slate-800 leading-tight mb-1">
                    {catConfig.label}
                  </h2>
                  <span style={{ fontSize: '0.85rem' }} className="text-slate-500">
                    Terdeteksi: {label}
                  </span>
                </div>
                <span 
                  style={{ 
                    fontSize: '1.25rem',
                    backgroundColor: catConfig.primaryColor + '15',
                    color: catConfig.primaryColor,
                    borderColor: catConfig.primaryColor + '30'
                  }} 
                  className="font-semibold px-3 py-1 rounded-full border-2"
                >
                  {((confidence || 0) * 100).toFixed(1)}%
                </span>
              </div>

              {/* Confidence Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }} className="font-semibold text-slate-400 uppercase">
                    Tingkat Kepastian
                  </span>
                  <span style={{ fontSize: '0.85rem' }} className="font-semibold text-slate-600">
                    {((confidence || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(confidence || 0) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ backgroundColor: catConfig.primaryColor }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>

              {/* Detections List */}
              {detections.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    {detections.map((det, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} style={{ color: catConfig.primaryColor }} />
                          <span className="text-slate-600 font-medium">{det.label}</span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - AI Insights + Actions */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 overflow-auto scrollbar-thin">
              <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm h-full flex flex-col">
                <div className="mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-emerald-500" />
                    <h3 style={{ fontSize: '0.95rem' }} className="font-bold text-slate-800">
                      AI Insight — Analisis Sampah
                    </h3>
                  </div>
                </div>

                {/* 2x2 Grid for AI Insight Cards */}
                <div 
                  style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: '0.875rem',
                    flex: 1
                  }}
                >
                  {tipsConfig.cards.map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border ${card.color} flex flex-col`}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <CardIcon size={14} className="shrink-0" />
                          <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }} className="font-bold uppercase">
                            {card.title}
                          </h4>
                        </div>
                        <p style={{ fontSize: '0.82rem', lineHeight: '1.55' }} className="text-slate-600">
                          {card.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons - Pinned to bottom */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => navigate('/upload')}
                style={{ fontSize: '0.9rem' }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-emerald-500 text-emerald-600 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-200 shadow-sm"
              >
                <ArrowLeft size={18} />
                Pindai Baru
              </button>
              <button
                onClick={() => navigate('/predictions')}
                style={{ fontSize: '0.9rem' }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-md"
              >
                <History size={18} />
                Riwayat
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
