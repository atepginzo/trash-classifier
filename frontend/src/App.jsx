import { useState, useRef } from 'react'
import { Upload, Trash2, CheckCircle2, AlertCircle, RefreshCcw, ImageIcon, Loader2 } from 'lucide-react'
import { predictionService } from './api/predictionService'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file terlalu besar (Maks 5MB)')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)
    try {
      const response = await predictionService.predict(selectedFile)
      if (response.status === 'success') {
        setResult(response.data)
      } else {
        setError(response.message || 'Gagal mengklasifikasi gambar')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
            <Trash2 className="w-8 h-8" />
            Trash Classifier
          </h1>
          <p className="text-gray-500 italic">"Clean environment starts with smart sorting"</p>
        </div>

        {/* Upload Area */}
        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center space-y-4 transition-all cursor-pointer overflow-hidden
            ${previewUrl ? 'border-green-400 bg-white' : 'border-green-200 bg-green-50/50 hover:border-green-400'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
          
          {previewUrl ? (
            <div className="relative group">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg shadow-sm" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <p className="text-white text-sm font-medium">Ganti Gambar</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-1 mt-2">
                <p className="text-sm font-medium text-gray-700">Klik untuk upload foto sampah</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Klasifikasi'}
          </button>
          <button 
            onClick={handleReset}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 text-green-700 font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Hasil Klasifikasi
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Jenis Sampah:</span>
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  {result.label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Kepercayaan:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {(result.confidence * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            Frontend MVP v1.0 • PIC: Full-Stack
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
