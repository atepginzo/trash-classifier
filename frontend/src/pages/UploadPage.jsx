import { useState, useRef, useEffect } from 'react';
import {
  Upload, Camera, X, Loader2, AlertCircle, RotateCcw, RefreshCw, Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import Navbar from '../components/Navbar';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const AUTO_SCAN_INTERVAL = 3000; // 3 detik

export default function UploadPage() {
  const navigate = useNavigate();
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
  const [cameraStatus, setCameraStatus] = useState('idle');
  
  // Live scan states
  const [liveScanActive, setLiveScanActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const scanIntervalRef = useRef(null);

  /* ── camera helpers ── */
  function terminateCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    stopLiveScan();
  }

  function stopLiveScan() {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setLiveScanActive(false);
    setScanLoading(false);
  }

  function revokePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  useEffect(() => () => { terminateCamera(); revokePreview(); }, []);
  useEffect(() => { if (activeTab !== 'camera') terminateCamera(); }, [activeTab]);

  function setPreviewFromSource(source) {
    revokePreview();
    const url = URL.createObjectURL(source);
    previewUrlRef.current = url;
    setPreview(url);
  }

  /* ── file validation ── */
  function validateFile(f) {
    if (!ALLOWED_TYPES.includes(f.type)) return 'Format tidak didukung. Gunakan JPG, PNG, atau WebP.';
    if (f.size > MAX_FILE_SIZE) return 'Ukuran file terlalu besar. Maksimal 10MB.';
    return null;
  }

  function processFile(f) {
    const err = validateFile(f);
    if (err) { setError(err); return; }
    setError(null);
    setFile(f);
    setPreviewFromSource(f);
  }

  /* ── drag & drop ── */
  function handleDrop(e) { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }
  function handleDragOver(e) { e.preventDefault(); setDragging(true); }
  function handleDragLeave(e) { e.preventDefault(); setDragging(false); }
  function handleFileInputChange(e) { const f = e.target.files[0]; if (f) processFile(f); }

  /* ── camera ── */
  async function activateCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { setCameraStatus('unsupported'); return; }
    try {
      setCameraStatus('starting');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) { 
        videoRef.current.srcObject = stream; 
        await videoRef.current.play(); 
      }
      setCameraStatus('active');
      startLiveScan();
    } catch { setCameraStatus('denied'); }
  }

  function startLiveScan() {
    setLiveScanActive(true);
    setScanResult(null);
    
    // Auto-capture setiap 3 detik
    scanIntervalRef.current = setInterval(() => {
      if (!scanLoading) {
        captureAndClassify();
      }
    }, AUTO_SCAN_INTERVAL);
  }

  async function captureAndClassify() {
    if (!videoRef.current || !canvasRef.current || scanLoading) return;
    
    setScanLoading(true);
    
    try {
      const v = videoRef.current, c = canvasRef.current;
      c.width = v.videoWidth; 
      c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0);
      
      const blob = await new Promise((resolve) => {
        c.toBlob(resolve, 'image/jpeg', 0.85);
      });
      
      if (!blob) {
        setScanLoading(false);
        return;
      }
      
      const file = new File([blob], 'live-scan.jpg', { type: 'image/jpeg' });
      const res = await predictionService.uploadImage(file);
      
      console.log('Live scan response:', res); // Debug log
      
      if (res.status === 'success' && res.data) {
        // Langsung navigate ke halaman detail hasil
        if (res.data.id) {
          navigate(`/predictions/${res.data.id}`);
        } else {
          // Fallback: tampilkan di panel jika tidak ada ID
          setScanResult(res.data);
          setError(null);
        }
      } else {
        throw new Error('Format respons tidak sesuai');
      }
    } catch (err) {
      console.error('Live scan error:', err);
      setError(err.message || 'Gagal menganalisis gambar');
    } finally {
      setScanLoading(false);
    }
  }

  /* ── submit → langsung navigate ke ResultPage ── */
  async function submitClassification() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predictionService.uploadImage(file);
      if (res.status === 'success' && res.data?.id) {
        navigate(`/predictions/${res.data.id}`);
      } else {
        throw new Error('Format respons dari server tidak sesuai.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengklasifikasi gambar.');
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
    setCameraStatus('idle');
    setScanResult(null);
    setScanLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function switchTab(tab) {
    if (tab === activeTab) return;
    resetAll(); setActiveTab(tab);
    if (tab === 'camera') setTimeout(activateCamera, 150);
  }

  const hasImage = !!file && !!preview;
  const canClassify = hasImage && !loading;

  return (
    <>
      <Navbar />
      <div
        style={{ minHeight: '100vh', backgroundColor: '#F5F0E8' }}
        className="flex flex-col items-center px-4 pt-28 pb-16 md:pt-32 md:pb-24"
      >
        {/* heading */}
        <div className="text-center mb-8 max-w-lg">
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#0F1A0A' }}
            className="text-3xl md:text-4xl font-bold mb-2">
            Deteksi Sampah
          </h1>
          <p style={{ color: '#6B7160' }} className="text-base leading-relaxed">
            Unggah atau foto sampah untuk mendapatkan klasifikasi AI
          </p>
        </div>

        {/* card */}
        <div style={{ 
          maxWidth: activeTab === 'camera' ? 1200 : 600, 
          backgroundColor: '#ffffff', 
          borderRadius: 12,
          transition: 'max-width 0.3s ease'
        }}
          className="w-full p-5 md:p-8">

          {/* tab switcher */}
          <div style={{ backgroundColor: '#f0ebe3', borderRadius: 999, padding: 4 }} className="flex mb-6">
            {[{ key: 'upload', label: 'Upload File', Icon: Upload }, { key: 'camera', label: 'Kamera', Icon: Camera }].map(({ key, label, Icon }) => (
              <button key={key} onClick={() => switchTab(key)} disabled={loading}
                style={{
                  backgroundColor: activeTab === key ? '#1a3d1a' : 'transparent',
                  color: activeTab === key ? '#ffffff' : '#3A3D35',
                  borderRadius: 999, border: 'none', outline: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease, color 0.2s ease',
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold">
                <Icon size={16} />{label}
              </button>
            ))}
          </div>

          {/* ── Upload tab ── */}
          {activeTab === 'upload' && (
            <>
              {!preview ? (
                <div
                  onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                  onClick={() => !loading && fileInputRef.current?.click()}
                  role="button" tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!loading) fileInputRef.current?.click(); } }}
                  style={{
                    border: `2px dashed ${dragging ? '#1a3d1a' : '#c5c5b8'}`,
                    backgroundColor: dragging ? '#e8f0e8' : '#fafaf7',
                    borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'border-color 0.2s ease, background-color 0.2s ease',
                  }}
                  className="flex flex-col items-center justify-center py-16 px-4"
                >
                  <Upload size={40} style={{ color: dragging ? '#1a3d1a' : '#A8B89C' }} />
                  <p style={{ color: '#3A3D35' }} className="mt-4 text-sm font-medium">
                    <span style={{ color: '#1a3d1a' }} className="font-semibold">Klik untuk upload</span>{' '}
                    atau drag & drop di sini
                  </p>
                  <p style={{ color: '#6B7160' }} className="text-xs mt-1.5">
                    Format: JPG, PNG, WebP — Maksimal 10MB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div style={{ maxWidth: 300, maxHeight: 300, borderRadius: 8, overflow: 'hidden', aspectRatio: '1/1', width: '100%' }}>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  {file && <p style={{ color: '#6B7160' }} className="text-xs mt-3 truncate max-w-[300px]">{file.name}</p>}
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileInputChange}
                accept=".jpg,.jpeg,.png,.webp" className="hidden" aria-label="Pilih file gambar" />
            </>
          )}

          {/* ── Camera tab (LIVE SCAN MODE) ── */}
          {activeTab === 'camera' && (
            <>
              {cameraStatus === 'unsupported' && (
                <div style={{ backgroundColor: '#fafaf7', borderRadius: 8, border: '1px solid #e0ddd5' }}
                  className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <AlertCircle size={40} style={{ color: '#a32d2d' }} />
                  <p style={{ color: '#3A3D35' }} className="mt-4 text-sm font-semibold">Kamera Tidak Didukung</p>
                  <p style={{ color: '#6B7160' }} className="text-xs mt-2 leading-relaxed max-w-xs">
                    Browser Anda tidak mendukung akses kamera. Gunakan mode upload file.
                  </p>
                </div>
              )}
              {cameraStatus === 'denied' && (
                <div style={{ backgroundColor: '#fafaf7', borderRadius: 8, border: '1px solid #e0ddd5' }}
                  className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <AlertCircle size={40} style={{ color: '#a32d2d' }} />
                  <p style={{ color: '#3A3D35' }} className="mt-4 text-sm font-semibold">Izin Kamera Ditolak</p>
                  <p style={{ color: '#6B7160' }} className="text-xs mt-2 leading-relaxed max-w-xs">
                    Izinkan akses kamera di pengaturan browser, lalu coba lagi.
                  </p>
                  <button onClick={activateCamera}
                    style={{ backgroundColor: '#1a3d1a', color: '#ffffff', borderRadius: 999, border: 'none' }}
                    className="mt-5 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <RefreshCw size={14} /> Coba Lagi
                  </button>
                </div>
              )}
              {(cameraStatus === 'idle' || cameraStatus === 'starting' || cameraStatus === 'active') && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Kamera Feed (Kiri) */}
                  <div className="flex-1">
                    <div style={{ borderRadius: 8, overflow: 'hidden', backgroundColor: '#1a1a1a', width: '100%', aspectRatio: '4/3', position: 'relative' }}>
                      <video ref={videoRef} autoPlay playsInline muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      
                      {/* Laser Scan Animation */}
                      {liveScanActive && (
                        <>
                          <div className="scan-laser" />
                          <div className="scan-corner corner-tl" />
                          <div className="scan-corner corner-tr" />
                          <div className="scan-corner corner-bl" />
                          <div className="scan-corner corner-br" />
                        </>
                      )}
                      
                      {cameraStatus === 'starting' && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(26,26,26,0.85)' }}>
                          <Loader2 size={28} style={{ color: '#ffffff' }} className="animate-spin" />
                          <p style={{ color: '#d0d0d0' }} className="text-xs mt-3">Memulai kamera...</p>
                        </div>
                      )}
                      
                      {/* Live Scan Indicator */}
                      {liveScanActive && (
                        <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,255,136,0.9)', borderRadius: 999, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffffff' }} className="animate-pulse" />
                          <span style={{ color: '#0F1A0A', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px' }}>LIVE SCAN</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hasil Klasifikasi (Kanan) */}
                  <div className="flex-1">
                    <div style={{ backgroundColor: '#fafaf7', borderRadius: 8, border: '1px solid #e0ddd5', minHeight: 300, position: 'relative' }} className="p-5">
                      <h3 style={{ color: '#0F1A0A', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                        Hasil Analisis Real-Time
                      </h3>
                      
                      {!scanResult && !scanLoading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Zap size={40} style={{ color: '#A8B89C' }} />
                          <p style={{ color: '#6B7160' }} className="text-sm mt-3">
                            Menunggu hasil scan...
                          </p>
                          <p style={{ color: '#A8B89C' }} className="text-xs mt-1">
                            Arahkan kamera ke sampah
                          </p>
                        </div>
                      )}
                      
                      {scanLoading && !scanResult && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div style={{ width: 40, height: 40, border: '3px solid #e0ddd5', borderTopColor: '#00ff88', borderRadius: '50%' }} className="animate-spin" />
                          <p style={{ color: '#6B7160' }} className="text-sm mt-4 animate-pulse">
                            Menganalisis...
                          </p>
                        </div>
                      )}
                      
                      {scanResult && (
                        <div className="scan-result-fade-in">
                          {/* Kategori */}
                          <div style={{ 
                            backgroundColor: scanResult.result?.category === 'Organik' ? '#e8f5e9' : 
                                           scanResult.result?.category === 'Anorganik' ? '#e3f2fd' : '#fff3e0',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 16
                          }}>
                            <div style={{ fontSize: 12, color: '#6B7160', marginBottom: 4 }}>Kategori Terdeteksi</div>
                            <div style={{ 
                              fontSize: 20, 
                              fontWeight: 700,
                              color: scanResult.result?.category === 'Organik' ? '#2e7d32' : 
                                     scanResult.result?.category === 'Anorganik' ? '#1565c0' : '#e65100'
                            }}>
                              {scanResult.result?.category || 'Unknown'}
                            </div>
                            {scanResult.result?.label && (
                              <div style={{ fontSize: 13, color: '#6B7160', marginTop: 4 }}>
                                {scanResult.result.label}
                              </div>
                            )}
                          </div>
                          
                          {/* Confidence Bar */}
                          {scanResult.result?.confidence && (
                            <div style={{ marginBottom: 16 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: '#6B7160' }}>Tingkat Keyakinan</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F1A0A' }}>
                                  {scanResult.result.confidence}%
                                </span>
                              </div>
                              <div style={{ width: '100%', height: 8, backgroundColor: '#e0ddd5', borderRadius: 999, overflow: 'hidden' }}>
                                <div 
                                  style={{ 
                                    width: `${scanResult.result.confidence}%`, 
                                    height: '100%', 
                                    backgroundColor: '#00ff88',
                                    transition: 'width 0.5s ease',
                                    borderRadius: 999
                                  }} 
                                  className="confidence-bar-animation"
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Tips Penanganan */}
                          {scanResult.result?.category && (
                            <div style={{ backgroundColor: '#ffffff', borderRadius: 8, padding: 12, border: '1px solid #e0ddd5' }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1A0A', marginBottom: 6 }}>
                                💡 Tips Penanganan
                              </div>
                              <p style={{ fontSize: 12, color: '#6B7160', lineHeight: 1.5 }}>
                                {scanResult.result.category === 'Organik' 
                                  ? 'Sampah organik dapat dikomposkan atau dijadikan pupuk alami. Pisahkan dari sampah lainnya.'
                                  : scanResult.result.category === 'Anorganik'
                                  ? 'Sampah anorganik dapat didaur ulang. Bersihkan dan pisahkan sesuai jenisnya sebelum dibuang.'
                                  : 'Sampah B3 harus dibuang di tempat khusus. Jangan dicampur dengan sampah biasa.'}
                              </p>
                            </div>
                          )}
                          
                          {/* Tombol Lihat Detail */}
                          {scanResult.id && (
                            <button 
                              onClick={() => navigate(`/predictions/${scanResult.id}`)}
                              style={{ 
                                width: '100%',
                                backgroundColor: '#1a3d1a', 
                                color: '#ffffff', 
                                borderRadius: 8, 
                                border: 'none',
                                padding: '10px 16px',
                                fontSize: 13,
                                fontWeight: 600,
                                marginTop: 16,
                                cursor: 'pointer'
                              }}
                            >
                              Lihat Detail Lengkap
                            </button>
                          )}
                        </div>
                      )}
                      
                      {scanLoading && scanResult && (
                        <div style={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          backgroundColor: 'rgba(0,255,136,0.9)', 
                          borderRadius: '0 0 0 8px',
                          padding: '4px 10px',
                          fontSize: 10,
                          fontWeight: 600,
                          color: '#0F1A0A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#0F1A0A' }} className="animate-pulse" />
                          Updating...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* error */}
          {error && activeTab === 'upload' && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #f5c6c6', borderRadius: 8 }}
              className="flex items-start gap-3 p-4 mt-5">
              <AlertCircle size={18} style={{ color: '#a32d2d', flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: '#7f1d1d' }} className="text-sm flex-1">{error}</p>
              <button onClick={submitClassification} disabled={loading || !file}
                style={{ color: '#a32d2d', background: 'none', border: 'none', cursor: loading || !file ? 'not-allowed' : 'pointer', flexShrink: 0 }}
                className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
                <RefreshCw size={13} /> Ulangi
              </button>
            </div>
          )}

          {/* action buttons - hanya untuk tab upload */}
          {activeTab === 'upload' && (
            <div className="flex gap-3 mt-6">
              <button onClick={submitClassification} disabled={!canClassify}
                style={{ backgroundColor: canClassify ? '#1a3d1a' : '#b0b0a8', color: '#ffffff', borderRadius: 999, border: 'none', cursor: canClassify ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s ease' }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Menganalisis...</> : 'Klasifikasi'}
              </button>
              <button onClick={resetAll} disabled={loading}
                style={{ backgroundColor: '#f0ebe3', color: '#3A3D35', borderRadius: 999, border: 'none', opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                className="px-5 py-3 text-sm font-medium flex items-center gap-2">
                <X size={14} /> Reset
              </button>
            </div>
          )}

          {loading && activeTab === 'upload' && (
            <div className="flex flex-col items-center mt-6 py-6">
              <div style={{ width: 44, height: 44, border: '3px solid #e0ddd5', borderTopColor: '#1a3d1a', borderRadius: '50%' }} className="animate-spin" />
              <p style={{ color: '#6B7160' }} className="mt-4 text-sm">Menganalisis gambar...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
