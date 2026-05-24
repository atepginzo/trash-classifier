import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';

export function usePredictions(initialPage = 1, limit = 10) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    predictionService
      .getPredictions({ page, limit })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [page, limit]);

  useEffect(() => {
    const cancel = fetch();
    return cancel;
  }, [fetch]);

  return { data, loading, error, page, setPage };
}
