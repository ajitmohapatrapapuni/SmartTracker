import { useCallback, useEffect, useState } from "react";

export function useRecords(service) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRecords(await service.list());
    } catch (err) {
      setError(err.message || "Could not load data.");
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => { refresh(); }, [refresh]);
  return { records, setRecords, loading, error, refresh };
}
