import { useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

/**
 * @param {{ onComplete?: (questions: object[]) => void }} options
 */
const useRSVPQuestions = ({ onComplete } = {}) => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Always call the latest onComplete without re-creating generate
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const generate = async (title, description, expectedAttendees) => {
    setQuestions(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/suite/rsvp-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description, expectedAttendees }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to generate questions.");
      setQuestions(data.questions);
      onCompleteRef.current?.(data.questions);
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { questions, setQuestions, loading, error, generate };
};

export default useRSVPQuestions;
