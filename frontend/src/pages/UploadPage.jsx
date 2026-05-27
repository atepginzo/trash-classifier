import { useState, useRef, useEffect } from 'react';
import {
  Upload, Camera, X, Loader2, AlertCircle, RefreshCw, Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { predictionService } from '../services/predictionService';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../contexts/ThemeContext';

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

  const [activeTab, setActiveTab] = useState('camera'); // Default ke kamera
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

  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
  
  // Auto-start camera on mount if camera tab is active
  useEffect(() => {
    if (activeTab === 'camera' && cameraStatus === 'idle') {
      setTimeout(activateCamera, 300);
    }
  }, [activeTab]);

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

  /* ── submit ── */
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
    <PageTransition>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-6 md:pt-24 md:pb-8 min-h-screen bg-[#F8FAFC] dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
        
        {/* heading */}
        <div className="text-center mb-6 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight transition-colors duration-300 text-slate-900 dark:text-white">
            Deteksi Sampah
          </h1>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300">
            Unggah atau foto sampah untuk mendapatkan klasifikasi AI secara real-time
          </p>
        </div>

        {/* card */}
        <div 
          style={{ 
            maxWidth: activeTab === 'camera' ? 1200 : 600, 
            transition: 'max-width 0.3s ease'
          }}
          className="w-full p-4 md:p-6 bg-white dark:bg-[#111111] border border-slate-200/60 dark:border-white/5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)] upload-card transition-colors duration-300"
        >

          {/* tab switcher */}
          <div className="flex mb-5 bg-slate-100 dark:bg-white/5 rounded-full p-1 upload-tabs transition-colors duration-300">
            {[
              { key: 'upload', label: 'Upload File', Icon: Upload }, 
              { key: 'camera', label: 'Kamera', Icon: Camera }
            ].map(({ key, label, Icon }) => (
              <button 
                key={key} 
                onClick={() => switchTab(key)} 
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-full border-none outline-none transition-all duration-300 ${
                  activeTab === key 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                <Icon size={16} />{label}
              </button>
            ))}
          </div>

          {/* tab content with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'camera' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'camera' ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'upload' ? (
                <>
                  {!preview ? (
                    <div
                      onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                      onClick={() => !loading && fileInputRef.current?.click()}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!loading) fileInputRef.current?.click(); } }}
                      className={`flex flex-col items-center justify-center py-12 px-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                        dragging 
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                          : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5'
                      }`}
                      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      <Upload size={40} className={dragging ? 'text-emerald-500' : 'text-slate-400 dark:text-white/40'} />
                      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Klik untuk upload</span>{' '}
                        atau drag & drop di sini
                      </p>
                      <p className="text-xs text-slate-400 dark:text-white/40 mt-1">
                        Format: JPG, PNG, WebP — Maksimal 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4">
                      <div className="relative max-w-[240px] max-h-[240px] rounded-xl overflow-hidden aspect-square w-full shadow-md border border-slate-200 dark:border-white/5">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover block" />
                      </div>
                      {file && <p className="text-xs text-slate-500 dark:text-white/40 mt-3 truncate max-w-[220px] font-medium">{file.name}</p>}
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileInputChange}
                    accept=".jpg,.jpeg,.png,.webp" className="hidden" aria-label="Pilih file gambar" />
                </>
              ) : (
                <>
                  {cameraStatus === 'unsupported' && (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl transition-colors duration-300">
                      <AlertCircle size={40} className="text-red-500 dark:text-red-400" />
                      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">Kamera Tidak Didukung</p>
                      <p className="text-xs text-slate-500 dark:text-white/60 mt-2 leading-relaxed max-w-xs">
                        Browser Anda tidak mendukung akses kamera. Gunakan mode upload file.
                      </p>
                    </div>
                  )}
                  {cameraStatus === 'denied' && (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl transition-colors duration-300">
                      <AlertCircle size={40} className="text-red-500 dark:text-red-400" />
                      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-white">Izin Kamera Ditolak</p>
                      <p className="text-xs text-slate-500 dark:text-white/60 mt-2 leading-relaxed max-w-xs">
                        Izinkan akses kamera di pengaturan browser, lalu coba lagi.
                      </p>
                      <button onClick={activateCamera}
                        className="mt-5 px-6 py-2.5 text-sm font-semibold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full border-none outline-none cursor-pointer shadow-md transition-all duration-300">
                        <RefreshCw size={14} /> Coba Lagi
                      </button>
                    </div>
                  )}
                  {(cameraStatus === 'idle' || cameraStatus === 'starting' || cameraStatus === 'active') && (
                    <div className="upload-camera-layout flex flex-col lg:flex-row gap-6">
                      {/* Kamera Feed (Kiri) */}
                      <div className="flex-1">
                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/5 shadow-md">
                          <video ref={videoRef} autoPlay playsInline muted
                            className="w-full h-full object-cover block" />
                          
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-20">
                              <Loader2 size={28} className="text-white animate-spin" />
                              <p className="text-xs text-slate-300 mt-3">Memulai kamera...</p>
                            </div>
                          )}
                          
                          {/* Live Scan Indicator */}
                          {liveScanActive && (
                            <div className="absolute top-4 left-4 bg-emerald-500/90 dark:bg-emerald-400/95 text-[#0F1A0A] text-[11px] font-bold tracking-wider rounded-full px-3 py-1.5 flex items-center gap-2 shadow-md">
                              <div className="w-2 h-2 rounded-full bg-white animate-blink-dot" />
                              <span>LIVE SCAN</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Hasil Klasifikasi (Kanan) */}
                      <div className="flex-1">
                        <div className="relative p-5 min-h-[300px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl transition-colors duration-300">
                          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4 tracking-tight">
                            Hasil Analisis Real-Time
                          </h3>
                          
                          {!scanResult && !scanLoading && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <motion.div
                                animate={{ opacity: [1, 0.35, 1], scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                              >
                                <Zap size={40} className="text-slate-400 dark:text-white/30" />
                              </motion.div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 font-medium">
                                Menunggu hasil scan<span className="loading-dots"></span>
                              </p>
                              <p className="text-xs text-slate-400 dark:text-white/30 mt-1">
                                Arahkan kamera ke sampah
                              </p>
                            </div>
                          )}
                          
                          {scanLoading && !scanResult && (
                            <div className="flex flex-col items-center justify-center py-12">
                              <div className="w-10 h-10 border-[3px] border-slate-200 dark:border-white/10 border-t-emerald-500 rounded-full animate-spin" />
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 animate-pulse font-medium">
                                Menganalisis...
                              </p>
                            </div>
                          )}
                          
                          {scanResult && (
                            <div className="scan-result-fade-in">
                              {/* Kategori */}
                              <div 
                                className={`rounded-xl p-4 mb-4 transition-colors duration-300 ${
                                  scanResult.result?.category === 'Organik' 
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400' 
                                    : scanResult.result?.category === 'Anorganik' 
                                    ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400' 
                                    : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400'
                                }`}
                              >
                                <div className="text-[11px] font-semibold opacity-70 mb-1">Kategori Terdeteksi</div>
                                <div className="text-xl font-extrabold tracking-tight">
                                  {scanResult.result?.category || 'Unknown'}
                                </div>
                                {scanResult.result?.label && (
                                  <div className="text-xs opacity-80 mt-1">
                                    {scanResult.result.label}
                                  </div>
                                )}
                              </div>
                              
                              {/* Confidence Bar */}
                              {scanResult.result?.confidence && (
                                <div className="mb-4">
                                  <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-slate-500 dark:text-slate-400">Tingkat Keyakinan</span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                      {scanResult.result.confidence}%
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                      style={{ width: `${scanResult.result.confidence}%` }} 
                                      className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full confidence-bar-animation"
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {/* Tips Penanganan */}
                              {scanResult.result?.category && (
                                <div className="p-3.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/5 rounded-xl transition-colors duration-300 animate-fade-in">
                                  <div className="text-xs font-bold text-slate-800 dark:text-white mb-1.5 flex items-center gap-1.5">
                                    <span>💡</span> Tips Penanganan
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
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
                                  className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-full border-none outline-none cursor-pointer shadow-md shadow-emerald-950/20 transition-all duration-300"
                                >
                                  Lihat Detail Lengkap
                                </button>
                              )}
                            </div>
                          )}
                          
                          {scanLoading && scanResult && (
                            <div className="absolute top-4 right-4 bg-emerald-400/90 text-[#064E3B] text-[10px] font-bold rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0F1A0A] animate-blink-dot" />
                              <span>UPDATING...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* error */}
          {error && activeTab === 'upload' && (
            <div className="flex items-start gap-3 p-4 mt-5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl transition-colors duration-300">
              <AlertCircle size={18} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200 flex-1 leading-relaxed">{error}</p>
              <button onClick={submitClassification} disabled={loading || !file}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 bg-transparent border-none cursor-pointer whitespace-nowrap"
                style={{ cursor: loading || !file ? 'not-allowed' : 'pointer' }}
              >
                <RefreshCw size={13} /> Ulangi
              </button>
            </div>
          )}

          {/* action buttons - hanya untuk tab upload */}
          {activeTab === 'upload' && (
            <div className="flex gap-3 mt-6">
              <button onClick={submitClassification} disabled={!canClassify}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-full border-none outline-none shadow-md transition-all duration-300 ${
                  canClassify 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-950/20' 
                    : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-white/20 cursor-not-allowed'
                }`}
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Menganalisis...</> : 'Klasifikasi'}
              </button>
              <button onClick={resetAll} disabled={loading}
                className="px-6 py-3.5 text-sm font-semibold flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-full border-none cursor-pointer transition-colors duration-300"
                style={{ opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                <X size={14} /> Reset
              </button>
            </div>
          )}

          {loading && activeTab === 'upload' && (
            <div className="flex flex-col items-center mt-6 py-6 border-t border-slate-100 dark:border-white/5">
              <div className="w-10 h-10 border-[3px] border-slate-200 dark:border-white/10 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 animate-pulse">Menganalisis gambar...</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
