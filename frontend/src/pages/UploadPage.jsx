import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  X,
  Loader2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const CLASS_LABELS = ['Anorganik', 'B3', 'Organik'];

const CLASS_CONFIG = {
  Anorganik: {
    color: '#1860a0',
    bgLight: '#eef4fa',
    icon: '♻️',
    penanganan: [
      'Pisahkan dari sampah organik dan B3 sebelum dibuang',
      'Bersihkan dari sisa makanan atau cairan yang menempel',
      'Kumpulkan di tempat sampah khusus anorganik (warna kuning)',
      'Dapat didaur ulang: plastik, kertas, logam, kaca, karet',
      'Serahkan ke bank sampah atau pengepul untuk didaur ulang',
    ],
  },
  B3: {
    color: '#a32d2d',
    bgLight: '#fdf2f2',
    icon: '⚠️',
    penanganan: [
      'Jangan buang bersama sampah rumah tangga biasa',
      'Simpan di wadah tertutup rapat dan beri label "B3"',
      'Jauhkan dari jangkauan anak-anak dan hewan peliharaan',
      'Serahkan ke fasilitas pengelolaan limbah B3 terdekat',
      'Contoh: baterai, lampu neon, cat, pestisida, obat kadaluarsa, elektronik',
    ],
  },
  Organik: {
    color: '#2d6a2d',
    bgLight: '#f0f7f0',
    icon: '🌱',
    penanganan: [
      'Buang di tempat sampah organik (warna hijau)',
      'Dapat diolah menjadi kompos untuk menyuburkan tanah',
      'Pisahkan dari sampah anorganik dan B3',
      'Cacah menjadi potongan kecil untuk mempercepat pengomposan',
      'Contoh: sisa makanan, daun kering, ranting, kulit buah, ampas kopi',
    ],
  },
};

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const previewUrlRef = useRef(null);

  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('idle');

  function terminateCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function revokePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      terminateCamera();
      revokePreview();
    };
  }, []);

  useEffect(() => {
    if (activeTab !== 'camera') {
      terminateCamera();
    }
  }, [activeTab]);



  function setPreviewFromSource(source) {
    revokePreview();
    const url = URL.createObjectURL(source);
    previewUrlRef.current = url;
    setPreview(url);
  }

  function validateFile(f) {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.';
    }
    if (f.size > MAX_FILE_SIZE) {
      return 'Ukuran file terlalu besar. Maksimal 10MB.';
    }
    return null;
  }

  function processFile(f) {
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
    setPreviewFromSource(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function handleFileInputChange(e) {
    const f = e.target.files[0];
    if (f) processFile(f);
  }



  async function activateCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unsupported');
      return;
    }
    try {
      setCameraStatus('starting');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraStatus('active');
    } catch {
      setCameraStatus('denied');
    }
  }

  function captureFrame() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], 'kamera.jpg', {
          type: 'image/jpeg',
        });
        setFile(capturedFile);
        setPreviewFromSource(blob);
        setCameraStatus('captured');
        terminateCamera();
      },
      'image/jpeg',
      0.92
    );
  }

  function retakePhoto() {
    setFile(null);
    revokePreview();
    setPreview(null);
    setResult(null);
    setError(null);
    activateCamera();
  }

  async function submitClassification() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const statusText = response.statusText || 'Unknown';
        throw new Error(
          `Server merespons dengan status ${response.status} (${statusText}).`
        );
      }
      const data = await response.json();
      if (
        !data.class ||
        typeof data.confidence !== 'number' ||
        !Array.isArray(data.all_scores) ||
        data.all_scores.length !== 3
      ) {
        throw new Error('Format respons dari server tidak sesuai.');
      }
      setResult(data);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          'Tidak dapat terhubung ke server. Pastikan server API berjalan di ' +
            API_URL
        );
      } else {
        setError(err.message || 'Terjadi kesalahan saat mengklasifikasi gambar.');
      }
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    terminateCamera();
    setFile(null);
    revokePreview();
    setPreview(null);
    setDragging(false);
    setLoading(false);
    setError(null);
    setResult(null);
    setCameraStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function switchTab(tab) {
    if (tab === activeTab) return;
    resetAll();
    setActiveTab(tab);
    if (tab === 'camera') {
      setTimeout(activateCamera, 150);
    }
  }

  function formatConfidence(value) {
    return (value * 100).toFixed(1);
  }

  const hasImage = !!file && !!preview;
  const canClassify = hasImage && !loading && !result;

  return (
    <>
      <Navbar />
      <div
        style={{ minHeight: '100vh', backgroundColor: '#F5F0E8' }}
        className="flex flex-col items-center px-4 pt-28 pb-16 md:pt-32 md:pb-24"
      >
        <div className="text-center mb-8 max-w-lg">
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              color: '#0F1A0A',
            }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            Deteksi Sampah
          </h1>
          <p style={{ color: '#6B7160' }} className="text-base leading-relaxed">
            Unggah atau foto sampah untuk mendapatkan klasifikasi AI
          </p>
        </div>

        <div
          style={{
            maxWidth: 600,
            backgroundColor: '#ffffff',
            borderRadius: 12,
          }}
          className="w-full p-5 md:p-8"
        >
          {!result && (
            <div
              style={{
                backgroundColor: '#f0ebe3',
                borderRadius: 999,
                padding: 4,
              }}
              className="flex mb-6"
            >
              {[
                { key: 'upload', label: 'Upload File', Icon: Upload },
                { key: 'camera', label: 'Kamera', Icon: Camera },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  disabled={loading}
                  style={{
                    backgroundColor:
                      activeTab === key ? '#1a3d1a' : 'transparent',
                    color: activeTab === key ? '#ffffff' : '#3A3D35',
                    borderRadius: 999,
                    border: 'none',
                    outline: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold"
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'upload' && !result && (
            <>
              {!preview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => !loading && fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!loading) fileInputRef.current?.click();
                    }
                  }}
                  style={{
                    border: `2px dashed ${dragging ? '#1a3d1a' : '#c5c5b8'}`,
                    backgroundColor: dragging ? '#e8f0e8' : '#fafaf7',
                    borderRadius: 8,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                  }}
                  className="flex flex-col items-center justify-center py-16 px-4"
                >
                  <Upload
                    size={40}
                    style={{ color: dragging ? '#1a3d1a' : '#A8B89C' }}
                  />
                  <p
                    style={{ color: '#3A3D35' }}
                    className="mt-4 text-sm font-medium"
                  >
                    <span
                      style={{ color: '#1a3d1a' }}
                      className="font-semibold"
                    >
                      Klik untuk upload
                    </span>{' '}
                    atau drag & drop di sini
                  </p>
                  <p
                    style={{ color: '#6B7160' }}
                    className="text-xs mt-1.5"
                  >
                    Format: JPG, PNG, WebP — Maksimal 10MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      maxWidth: 300,
                      maxHeight: 300,
                      borderRadius: 8,
                      overflow: 'hidden',
                      aspectRatio: '1 / 1',
                      width: '100%',
                    }}
                  >
                    <img
                      src={preview}
                      alt="Preview gambar yang dipilih"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  {file && (
                    <p
                      style={{ color: '#6B7160' }}
                      className="text-xs mt-3 truncate max-w-[300px]"
                    >
                      {file.name}
                    </p>
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                aria-label="Pilih file gambar"
              />
            </>
          )}

          {activeTab === 'camera' && !result && (
            <>
              {cameraStatus === 'unsupported' && (
                <div
                  style={{
                    backgroundColor: '#fafaf7',
                    borderRadius: 8,
                    border: '1px solid #e0ddd5',
                  }}
                  className="flex flex-col items-center justify-center py-16 px-6 text-center"
                >
                  <AlertCircle size={40} style={{ color: '#a32d2d' }} />
                  <p
                    style={{ color: '#3A3D35' }}
                    className="mt-4 text-sm font-semibold"
                  >
                    Kamera Tidak Didukung
                  </p>
                  <p
                    style={{ color: '#6B7160' }}
                    className="text-xs mt-2 leading-relaxed max-w-xs"
                  >
                    Browser Anda tidak mendukung akses kamera. Gunakan browser
                    modern seperti Chrome, Firefox, atau Safari, atau gunakan
                    mode upload file.
                  </p>
                </div>
              )}

              {cameraStatus === 'denied' && (
                <div
                  style={{
                    backgroundColor: '#fafaf7',
                    borderRadius: 8,
                    border: '1px solid #e0ddd5',
                  }}
                  className="flex flex-col items-center justify-center py-16 px-6 text-center"
                >
                  <AlertCircle size={40} style={{ color: '#a32d2d' }} />
                  <p
                    style={{ color: '#3A3D35' }}
                    className="mt-4 text-sm font-semibold"
                  >
                    Izin Kamera Ditolak
                  </p>
                  <p
                    style={{ color: '#6B7160' }}
                    className="text-xs mt-2 leading-relaxed max-w-xs"
                  >
                    Izinkan akses kamera di pengaturan browser Anda, lalu
                    tekan tombol di bawah untuk mencoba lagi.
                  </p>
                  <button
                    onClick={activateCamera}
                    style={{
                      backgroundColor: '#1a3d1a',
                      color: '#ffffff',
                      borderRadius: 999,
                      border: 'none',
                    }}
                    className="mt-5 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    Coba Lagi
                  </button>
                </div>
              )}

              {(cameraStatus === 'idle' ||
                cameraStatus === 'starting' ||
                cameraStatus === 'active') && (
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      borderRadius: 8,
                      overflow: 'hidden',
                      backgroundColor: '#1a1a1a',
                      width: '100%',
                      maxWidth: 300,
                      aspectRatio: '1 / 1',
                    }}
                    className="relative"
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {cameraStatus === 'starting' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(26,26,26,0.85)',
                        }}
                      >
                        <Loader2
                          size={28}
                          style={{ color: '#ffffff' }}
                          className="animate-spin"
                        />
                        <p
                          style={{ color: '#d0d0d0' }}
                          className="text-xs mt-3"
                        >
                          Memulai kamera...
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={captureFrame}
                    disabled={cameraStatus !== 'active'}
                    style={{
                      backgroundColor:
                        cameraStatus === 'active' ? '#1a3d1a' : '#b0b0a8',
                      color: '#ffffff',
                      borderRadius: 999,
                      border: 'none',
                      cursor:
                        cameraStatus === 'active' ? 'pointer' : 'not-allowed',
                    }}
                    className="mt-5 px-8 py-2.5 text-sm font-semibold flex items-center gap-2"
                  >
                    <Camera size={16} />
                    Ambil Foto
                  </button>
                </div>
              )}

              {cameraStatus === 'captured' && preview && (
                <div className="flex flex-col items-center">
                  <div
                    style={{
                      maxWidth: 300,
                      maxHeight: 300,
                      borderRadius: 8,
                      overflow: 'hidden',
                      aspectRatio: '1 / 1',
                      width: '100%',
                    }}
                  >
                    <img
                      src={preview}
                      alt="Foto yang diambil dari kamera"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                  <button
                    onClick={retakePhoto}
                    style={{
                      color: '#1a3d1a',
                      borderRadius: 999,
                      border: '1.5px solid #1a3d1a',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                    }}
                    className="mt-5 px-6 py-2 text-sm font-semibold flex items-center gap-2"
                  >
                    <RotateCcw size={14} />
                    Ulangi
                  </button>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #f5c6c6',
                borderRadius: 8,
              }}
              className="flex items-start gap-3 p-4 mt-5"
            >
              <AlertCircle
                size={18}
                style={{
                  color: '#a32d2d',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <p style={{ color: '#7f1d1d' }} className="text-sm flex-1">
                {error}
              </p>
              <button
                onClick={submitClassification}
                disabled={loading || !file}
                style={{
                  color: '#a32d2d',
                  background: 'none',
                  border: 'none',
                  cursor: loading || !file ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
                className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap"
              >
                <RefreshCw size={13} />
                Ulangi
              </button>
            </div>
          )}

          {!result && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitClassification}
                disabled={!canClassify}
                style={{
                  backgroundColor: canClassify ? '#1a3d1a' : '#b0b0a8',
                  color: '#ffffff',
                  borderRadius: 999,
                  border: 'none',
                  cursor: canClassify ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s ease',
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  'Klasifikasi'
                )}
              </button>
              <button
                onClick={resetAll}
                disabled={loading}
                style={{
                  backgroundColor: '#f0ebe3',
                  color: '#3A3D35',
                  borderRadius: 999,
                  border: 'none',
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                className="px-5 py-3 text-sm font-medium flex items-center gap-2"
              >
                <X size={14} />
                Reset
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center mt-6 py-6">
              <div
                style={{
                  width: 44,
                  height: 44,
                  border: '3px solid #e0ddd5',
                  borderTopColor: '#1a3d1a',
                  borderRadius: '50%',
                }}
                className="animate-spin"
              />
              <p style={{ color: '#6B7160' }} className="mt-4 text-sm">
                Menganalisis gambar...
              </p>
            </div>
          )}

          {result && (
            <div>
              {preview && (
                <div className="flex justify-center mb-6">
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={preview}
                      alt="Gambar yang dianalisis"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="text-center mb-5">
                <span style={{ fontSize: 36, display: 'inline-block' }}>
                  {CLASS_CONFIG[result.class]?.icon}
                </span>
                <h2
                  style={{
                    color: CLASS_CONFIG[result.class]?.color,
                    fontFamily: 'var(--font-serif)',
                  }}
                  className="text-2xl md:text-3xl font-bold mt-1"
                >
                  {result.class}
                </h2>
                <p
                  style={{ color: '#6B7160' }}
                  className="text-sm mt-1 font-medium"
                >
                  Confidence: {formatConfidence(result.confidence)}%
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#f0ebe3',
                  borderRadius: 999,
                  overflow: 'hidden',
                  height: 10,
                }}
                className="mb-6"
              >
                <div
                  style={{
                    width: `${formatConfidence(result.confidence)}%`,
                    backgroundColor: CLASS_CONFIG[result.class]?.color,
                    height: '100%',
                    borderRadius: 999,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: '#fafaf7',
                  borderRadius: 8,
                  border: '1px solid #e0ddd5',
                }}
                className="p-4 md:p-5 mb-5"
              >
                <p
                  style={{ color: '#3A3D35', letterSpacing: '0.05em' }}
                  className="text-xs font-semibold mb-4 uppercase"
                >
                  Skor Semua Kelas
                </p>
                {CLASS_LABELS.map((label, idx) => {
                  const score = result.all_scores[idx];
                  const config = CLASS_CONFIG[label];
                  const isTopResult = label === result.class;
                  return (
                    <div key={label} className="mb-3.5 last:mb-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          style={{
                            color: '#3A3D35',
                            fontWeight: isTopResult ? 600 : 400,
                          }}
                          className="text-sm"
                        >
                          {config.icon} {label}
                        </span>
                        <span
                          style={{
                            color: config.color,
                            fontWeight: 600,
                          }}
                          className="text-sm"
                        >
                          {formatConfidence(score)}%
                        </span>
                      </div>
                      <div
                        style={{
                          backgroundColor: '#e0ddd5',
                          borderRadius: 999,
                          height: 6,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${formatConfidence(score)}%`,
                            backgroundColor: config.color,
                            height: '100%',
                            borderRadius: 999,
                            transition: 'width 0.6s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {CLASS_CONFIG[result.class] && (
                <div
                  style={{
                    backgroundColor: CLASS_CONFIG[result.class].bgLight,
                    borderRadius: 8,
                    borderLeft: `4px solid ${CLASS_CONFIG[result.class].color}`,
                  }}
                  className="p-4 md:p-5 mb-6"
                >
                  <p
                    style={{
                      color: CLASS_CONFIG[result.class].color,
                      letterSpacing: '0.05em',
                    }}
                    className="text-xs font-semibold mb-3 uppercase"
                  >
                    Cara Penanganan — {result.class}
                  </p>
                  <ul className="space-y-2.5">
                    {CLASS_CONFIG[result.class].penanganan.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span
                          style={{
                            color: CLASS_CONFIG[result.class].color,
                            flexShrink: 0,
                            marginTop: 1,
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{ color: '#3A3D35' }}
                          className="text-sm leading-relaxed"
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={resetAll}
                style={{
                  backgroundColor: '#1a3d1a',
                  color: '#ffffff',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw size={14} />
                Klasifikasi Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
