import { useEffect, useState } from "react";
import { getEventAnalytics } from "../utils/analyticsService";

const useEventAnalytics = (eventId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;

    setLoading(true);
    getEventAnalytics(eventId)
      .then((data) => {
        if (cancelled) return;
        setAnalytics(data.analytics);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ?? "Failed to load analytics.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { analytics, loading, error };
};

export default useEventAnalytics;
