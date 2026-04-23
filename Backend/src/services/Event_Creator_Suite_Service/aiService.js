const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

const headers = () => ({
  Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  "Content-Type": "application/json",
});

const PLAN_SYSTEM = `You are an expert event planner. Write a detailed, structured event plan.
Use these exact markdown section headers in order:
## Overview
## Timeline
## Logistics
## Contingency Notes
Be specific, practical, and professional. Use bullet points where appropriate.`;

const RSVP_SYSTEM = `You are an expert event coordinator generating RSVP form questions.
Return ONLY a valid JSON array — no markdown fences, no explanation, no extra text.
Each element must have exactly these fields:
  "question": string
  "type": "text" | "select" | "checkbox" | "number"
  "required": boolean
  "options": string[]   (non-empty only for "select" and "checkbox"; omit or use [] for others)
Generate 6–8 questions relevant to the specific event.`;

/**
 * Returns the raw fetch Response with a streaming body (stream: true).
 * Caller is responsible for consuming/piping the SSE stream.
 */
export const generateEventPlan = (title, description) =>
  fetch(GROQ_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: PLAN_SYSTEM },
        {
          role: "user",
          content: `Event title: "${title}"\nDescription: ${description || "No description provided."}`,
        },
      ],
    }),
  });

/**
 * Calls Groq, parses the JSON array of RSVP questions, and returns it.
 * Throws on network error, non-OK response, or malformed JSON.
 */
export const generateRSVPQuestions = async (title, description, expectedAttendees) => {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [
        { role: "system", content: RSVP_SYSTEM },
        {
          role: "user",
          content: `Event title: "${title}"\nDescription: ${description || "No description provided."}\nExpected attendees: ${expectedAttendees || "unknown"}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message ?? `Groq API error (${res.status})`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  // Strip any accidental markdown fences
  const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Model returned malformed JSON. Please try again.");
  }
};
