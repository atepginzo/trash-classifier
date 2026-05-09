import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ImagePlus, X, Loader2, AlertCircle } from 'lucide-react';
import { predictionService } from '../services/predictionService';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      return 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP.';
    }
    if (f.size > MAX_SIZE) {
      return 'Ukuran file terlalu besar (maks 10MB).';
    }
    return null;
  };

  const handleFile = (f) => {
    const err = validateFile(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
  };

  const handleClassify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await predictionService.uploadImage(file);
      if (res?.data?.id) {
        navigate(`/predictions/${res.data.id}`);
      } else {
        setError('Respons server tidak valid.');
      }
    } catch (err) {
      setError(err.message || 'Gagal mengklasifikasi gambar.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Upload Foto Sampah</h1>
          <p className="text-sm text-gray-500">Drag & drop atau klik untuk memilih gambar</p>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer overflow-hidden
            ${dragging ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-gray-300 hover:border-green-400 bg-gray-50/50'}
            ${preview ? 'p-2' : 'py-12'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          {preview ? (
            <div className="relative group">
              <img src={preview} alt="Preview" className="w-full h-56 object-cover rounded-lg" />
              <button
                onClick={(e) => { e.stopPropagation(); handleReset(); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dragging ? (
                <ImagePlus className="w-14 h-14 text-green-500 mx-auto animate-bounce" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              )}
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-green-600">Klik untuk upload</span> atau drag & drop
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP (maks 10MB)</p>
            </div>
          )}
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <ImagePlus className="w-4 h-4 text-green-500 shrink-0" />
              <span className="truncate text-gray-700">{file.name}</span>
            </div>
            <span className="text-gray-400 shrink-0 ml-2">{formatSize(file.size)}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleClassify}
            disabled={!file || loading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Klasifikasi'}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-all"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
