import { useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, History, AlertTriangle, Leaf, Recycle, Trash2, Clock } from 'lucide-react';
import { usePrediction } from '../hooks/usePrediction';

const CATEGORY_CONFIG = {
  organik: { label: 'Organik', icon: Leaf, color: 'bg-green-100 text-green-700 border-green-300' },
  anorganik: { label: 'Anorganik', icon: Recycle, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  residu: { label: 'Residu', icon: Trash2, color: 'bg-amber-100 text-amber-700 border-amber-300' },
};

function BoundingBoxOverlay({ imageUrl, detections }) {
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
      const { x, y, width, height } = det.bbox;
      const px = x * canvas.width;
      const py = y * canvas.height;
      const pw = width * canvas.width;
      const ph = height * canvas.height;

      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      // Label background
      const text = `${det.label} ${(det.confidence * 100).toFixed(0)}%`;
      ctx.font = 'bold 12px sans-serif';
      const textW = ctx.measureText(text).width + 8;
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(px, py - 20, textW, 20);

      // Label text
      ctx.fillStyle = '#fff';
      ctx.fillText(text, px + 4, py - 6);
    });
  };

  useEffect(() => {
    drawBoxes();
    window.addEventListener('resize', drawBoxes);
    return () => window.removeEventListener('resize', drawBoxes);
  }, [detections]);

  return (
    <div className="relative inline-block w-full">
      <img
        ref={imgRef}
        src={imageUrl}
        alt="Prediction"
        className="w-full rounded-lg object-contain max-h-80"
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

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-200 rounded-lg" />
      <div className="h-20 bg-gray-200 rounded-lg" />
      <div className="h-40 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = usePrediction(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">Prediksi Tidak Ditemukan</h2>
          <p className="text-sm text-gray-500">{error.message || `ID "${id}" tidak ditemukan.`}</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Kembali ke Upload
          </button>
        </div>
      </div>
    );
  }

  const prediction = data?.data;
  const category = prediction?.category?.toLowerCase() || 'organik';
  const catConfig = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.organik;
  const CatIcon = catConfig.icon;
  const detections = prediction?.detections || [];
  const imageUrl = prediction?.imageUrl || prediction?.image_url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Hasil Prediksi</h1>
          <span className="text-xs text-gray-400 font-mono">#{id}</span>
        </div>
        {imageUrl && (
          <BoundingBoxOverlay imageUrl={imageUrl} detections={detections} />
        )}
        <div className={`rounded-xl border p-5 space-y-3 ${catConfig.color}`}>
          <div className="flex items-center gap-2 font-bold text-lg">
            <CatIcon className="w-6 h-6" />
            {catConfig.label}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Confidence:</span>
            <span className="font-semibold">{((prediction?.confidence || 0) * 100).toFixed(2)}%</span>
          </div>
          {prediction?.createdAt && (
            <div className="flex items-center gap-1 text-xs opacity-75">
              <Clock className="w-3 h-3" />
              {new Date(prediction.createdAt).toLocaleString('id-ID')}
            </div>
          )}
        </div>
        {detections.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Objek Terdeteksi</h3>
            <div className="divide-y divide-gray-100 border rounded-lg">
              {detections.map((det, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-700 font-medium">{det.label}</span>
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                    {(det.confidence * 100).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload
          </button>
          <Link
            to="/predictions"
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <History className="w-4 h-4" />
            Riwayat
          </Link>
        </div>
      </div>
    </div>
  );
}
