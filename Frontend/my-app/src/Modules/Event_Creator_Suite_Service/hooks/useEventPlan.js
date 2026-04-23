import { useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

/**
 * @param {{ onComplete?: (fullPlan: string) => void }} options
 */
const useEventPlan = ({ onComplete } = {}) => {
  const [plan, setPlan] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  // Always call the latest onComplete without re-creating generate
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const generate = async (title, description) => {
    setPlan("");
    setError(null);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    let buffer = "";
    let aborted = false;
    let hasError = false;

    try {
      const res = await fetch(`${API}/api/suite/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Failed to generate plan.");
        hasError = true;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let finished = false;

      while (!finished) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") { finished = true; break; }
          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) {
              setError(parsed.error);
              hasError = true;
              finished = true;
              break;
            }
            if (parsed.content) {
              buffer += parsed.content;
              setPlan((prev) => prev + parsed.content);
            }
          } catch { /* ignore malformed SSE lines */ }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") { aborted = true; }
      else { setError(err.message ?? "Something went wrong."); hasError = true; }
    } finally {
      setStreaming(false);
      if (!aborted && !hasError && buffer) onCompleteRef.current?.(buffer);
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  return { plan, setPlan, streaming, error, generate, cancel };
};

export default useEventPlan;
