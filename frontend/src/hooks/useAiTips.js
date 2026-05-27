import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';

/**
 * Hook reusable untuk mengambil tips AI dari Gemini berdasarkan kategori sampah.
 * Bisa digunakan oleh komponen Kamera maupun Upload.
 *
 * @param {string|null} kategori - Kategori sampah (misal: "Organik", "Anorganik", "B3")
 * @returns {{ tips: string|null, loading: boolean, error: string|null, refetch: Function }}
 */
export function useAiTips(kategori) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTips = useCallback(async (cat) => {
    if (!cat) return;
    setLoading(true);
    setError(null);
    setTips(null);
    try {
      const res = await predictionService.getAiTips(cat);
      setTips(res?.data?.tips || null);
    } catch (err) {
      console.error('[useAiTips] Error:', err);
      setError('Gagal mengambil ulasan AI. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (kategori) {
      fetchTips(kategori);
    } else {
      setTips(null);
      setError(null);
    }
  }, [kategori, fetchTips]);

  const refetch = useCallback(() => {
    if (kategori) fetchTips(kategori);
  }, [kategori, fetchTips]);

  return { tips, loading, error, refetch };
}
