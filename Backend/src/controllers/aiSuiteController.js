import {
  generateEventPlan,
  generateRSVPQuestions,
} from "../services/Event_Creator_Suite_Service/aiService.js";

// POST /api/suite/plan  — SSE streaming
export const streamEventPlan = async (req, res) => {
  const { title, description } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Event title is required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let reader;
  try {
    const groqRes = await generateEventPlan(title.trim(), description ?? "");

    if (!groqRes.ok) {
      const err = await groqRes.json().catch(() => ({}));
      res.write(
        `data: ${JSON.stringify({ error: err.error?.message ?? "Groq API error" })}\n\n`
      );
      return res.end();
    }

    reader = groqRes.body.getReader();
    const decoder = new TextDecoder();

    // Cancel stream if client disconnects
    req.on("close", () => reader.cancel().catch(() => {}));

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") {
          res.write("data: [DONE]\n\n");
          return res.end();
        }
        try {
          const parsed = JSON.parse(payload);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
        } catch {
          // Skip malformed SSE lines
        }
      }
    }
  } catch (err) {
    // Only write if headers not already finished
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }
  }

  if (!res.writableEnded) res.end();
};

// POST /api/suite/rsvp-questions  — JSON response
export const getRSVPQuestions = async (req, res) => {
  const { title, description, expectedAttendees } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Event title is required." });
  }

  try {
    const questions = await generateRSVPQuestions(
      title.trim(),
      description ?? "",
      expectedAttendees ?? ""
    );
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ message: err.message ?? "Failed to generate RSVP questions." });
  }
};
