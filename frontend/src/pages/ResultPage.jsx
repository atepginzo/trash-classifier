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
    color: 'bg-forest/5 text-forest border-forest/15',
    primaryColor: '#2D5016',
    bgBadge: 'bg-forest/10 text-forest',
    bgPill: 'border-forest bg-forest/5 text-forest',
    description: 'Sampah alami yang mudah membusuk dan terurai secara alami oleh mikroorganisme.'
  },
  anorganik: {
    label: 'Anorganik',
    icon: Recycle,
    color: 'bg-blue/5 text-blue border-blue/15',
    primaryColor: '#1860a0',
    bgBadge: 'bg-blue/10 text-blue',
    bgPill: 'border-blue bg-blue/5 text-blue',
    description: 'Sampah buatan manusia yang tidak mudah terurai secara alami dan dapat didaur ulang.'
  },
  b3: {
    label: 'Limbah B3',
    icon: AlertTriangle,
    color: 'bg-red-light text-red border-red/15',
    primaryColor: '#a32d2d',
    bgBadge: 'bg-red-light text-red',
    bgPill: 'border-red bg-red-light text-red',
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
        color: 'bg-red-light/60 text-red border border-red/10'
      },
      {
        title: 'Penanganan Tepat',
        desc: 'Pisahkan dari sampah anorganik agar kering, masukkan ke wadah tertutup atau komposter organik rumah tangga.',
        icon: CheckCircle2,
        color: 'bg-green-light/60 text-green border border-green/10'
      },
      {
        title: 'Nilai Ekonomis',
        desc: 'Berkisar Rp 500 – Rp 1.500 per kilogram jika diolah menjadi pupuk kompos matang atau pakan budidaya maggot.',
        icon: Coins,
        color: 'bg-terracotta/5 text-terracotta border border-terracotta/10'
      },
      {
        title: 'Konversi Kreatif',
        desc: 'Sangat ideal diolah kembali menjadi pupuk kompos organik cair, eco-enzyme pembersih, atau sumber biogas.',
        icon: RefreshCw,
        color: 'bg-blue-light/60 text-blue border border-blue/10'
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

      // Color scheme matches the category color
      ctx.strokeStyle = categoryColor || '#2D5016';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';

      // Draw double border effect
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(px, py, pw, ph);
      ctx.setLineDash([]);
      ctx.strokeRect(px, py, pw, ph);

      // Draw prediction label
      const text = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const textW = ctx.measureText(text).width + 12;

      const rx = px;
      const ry = py - 22;
      const rw = textW;
      const rh = 20;

      ctx.fillStyle = categoryColor || '#2D5016';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(rx, ry, rw, rh, 4);
        ctx.fill();
      } else {
        ctx.fillRect(rx, ry, rw, rh);
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, px + 6, py - 8);
    });
  };

  useEffect(() => {
    drawBoxes();
    window.addEventListener('resize', drawBoxes);
    return () => window.removeEventListener('resize', drawBoxes);
  }, [detections]);

  return (
    <div className="relative inline-block w-full overflow-hidden rounded-2xl border border-sage/20 bg-cream-light/40 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Hasil Deteksi"
        className="w-full h-auto max-h-[420px] object-contain mx-auto block"
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
      <div className="min-h-screen bg-cream flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-sage/20 shadow-sm p-8 text-center space-y-6">
            <div className="w-16 h-16 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-heading">Menganalisis Data Sampah...</h2>
              <p className="text-sm text-muted">Mengambil detail hasil klasifikasi AI dari basis data.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-sage/20 shadow-md p-8 text-center space-y-6">
            <ShieldAlert className="w-16 h-16 text-terracotta mx-auto animate-bounce-slow" />
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-heading">Analisis Tidak Ditemukan</h2>
              <p className="text-sm text-muted">ID deteksi "{id}" tidak terdaftar atau telah kadaluarsa.</p>
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="w-full py-3 bg-forest text-white rounded-full font-bold hover:bg-forest-dark transition-all duration-300 shadow-sm"
            >
              Coba Pindai Ulang
            </button>
          </div>
        </div>
        <Footer />
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
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heading tracking-tight">
              Hasil Pemindaian
            </h1>
            <p className="text-xs sm:text-sm text-muted font-mono mt-1">
              ID Pindaian: #{id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-sage/20 text-muted shadow-sm">
              <Clock size={13} />
              {prediction?.createdAt ? new Date(prediction.createdAt).toLocaleString('id-ID') : 'Baru saja'}
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Scanned Image */}
          <div className="lg:col-span-6 bg-white border border-sage/20 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(45,80,22,0.02)] space-y-4">
            <div className="flex items-center justify-between border-b border-sage/10 pb-4">
              <span className="font-bold text-sm text-heading uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-forest animate-pulse" />
                Citra Terdeteksi
              </span>
              <span className="text-xs text-muted font-medium">
                {prediction?.originalFilename || 'Hasil-Pindai.jpg'}
              </span>
            </div>

            {imageUrl ? (
              <BoundingBoxOverlay
                imageUrl={imageUrl}
                detections={detections}
                categoryColor={catConfig.primaryColor}
              />
            ) : (
              <div className="w-full h-64 bg-cream-light rounded-2xl flex items-center justify-center border border-dashed border-sage/30">
                <span className="text-sm text-muted">Gambar tidak tersedia</span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI Analysis & Educational tips */}
          <div className="lg:col-span-6 space-y-6">

            {/* Category Analysis Card */}
            <div className="bg-white border border-sage/20 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-[0_4px_20px_rgba(45,80,22,0.02)] space-y-6">

              {/* Category Badge & Headline */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 sm:gap-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-muted uppercase tracking-wider block">Kategori Dominan</span>
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-2xl ${catConfig.color} border shrink-0`}>
                      <CatIcon size={28} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-heading leading-none mb-1">
                        {catConfig.label}
                      </h2>
                      <span className="text-sm font-semibold text-forest mb-2 block">
                        Terdeteksi: {label}
                      </span>
                      <span className="text-xs text-muted leading-relaxed block max-w-sm">
                        {catConfig.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Confidence Score Badge */}
                <div className="flex items-center sm:items-end justify-between sm:justify-start sm:flex-col gap-2 border-t border-dashed border-sage/10 pt-4 sm:border-t-0 sm:pt-0 shrink-0">
                  <span className="text-xs font-semibold text-muted">Akurasi AI</span>
                  <span className={`inline-flex px-3.5 py-1.5 rounded-xl text-sm font-bold border ${catConfig.bgPill}`}>
                    {((confidence || 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="space-y-2 border-t border-sage/10 pt-5">
                <div className="flex justify-between text-xs font-semibold text-body">
                  <span>Tingkat Kepastian</span>
                  <span>{((confidence || 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-cream rounded-full overflow-hidden border border-sage/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(confidence || 0) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ backgroundColor: catConfig.primaryColor }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>

              {/* Detailed Detections List */}
              {detections.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-heading uppercase tracking-wider">
                    Daftar Objek Terdeteksi
                  </h3>
                  <div className="divide-y divide-sage/10 border border-sage/20 rounded-2xl bg-cream-light/30 overflow-hidden">
                    {detections.map((det, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-white/40 transition-colors duration-150">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 size={16} style={{ color: catConfig.primaryColor }} />
                          <span className="text-sm text-body font-semibold">{det.label}</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-white border border-sage/15 px-2.5 py-1 rounded-lg text-muted shadow-sm">
                          {(det.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Insight — Analisis Sampah (4-Card Dashboard Grid) */}
            <div className="bg-white border border-sage/20 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-[0_4px_20px_rgba(45,80,22,0.02)] space-y-6">
              <div className="flex items-center gap-2 border-b border-sage/10 pb-4">
                <Sparkles size={18} className="text-forest shrink-0" />
                <h3 className="font-serif text-lg font-bold text-heading">
                  {tipsConfig.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tipsConfig.cards.map((card, idx) => {
                  const CardIcon = card.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border ${card.color} flex flex-col justify-start transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]`}
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <CardIcon size={16} className="shrink-0" />
                        <h4 className="font-bold text-xs uppercase tracking-wider">
                          {card.title}
                        </h4>
                      </div>
                      <p className="text-xs text-body leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={() => navigate('/upload')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 border-2 border-forest text-forest rounded-full font-bold hover:bg-forest hover:text-white transition-all duration-300 shadow-sm cursor-pointer text-center text-sm"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" />
                Pindai Baru
              </button>
              <Link
                to="/predictions"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-forest text-white rounded-full font-bold hover:bg-forest-dark transition-all duration-300 shadow-md cursor-pointer text-center text-sm"
              >
                <History className="w-5 h-5 shrink-0" />
                Lihat Riwayat
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
