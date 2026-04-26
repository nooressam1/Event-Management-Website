import Groq from "groq-sdk";
import Budget from "../../models/Budget.js";
import Event from "../../models/Event.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Budget ──────────────────────────────────────────────────────────────────

// GET /api/suite/budget/:eventId
export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId },
      { $setOnInsert: { eventId: req.params.eventId } },
      { upsert: true, new: true }
    );
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/suite/budget/:eventId  — set totalBudget
export const saveTotalBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId },
      { $set: { totalBudget: req.body.totalBudget } },
      { upsert: true, new: true }
    );
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/suite/budget/:eventId/items
export const addBudgetItem = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId },
      { $push: { items: req.body } },
      { upsert: true, new: true }
    );
    const item = budget.items[budget.items.length - 1];
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/suite/budget/:eventId/items/:itemId
export const updateBudgetItem = async (req, res) => {
  try {
    const updates = {};
    for (const [k, v] of Object.entries(req.body)) {
      updates[`items.$.${k}`] = v;
    }
    const budget = await Budget.findOneAndUpdate(
      { eventId: req.params.eventId, "items._id": req.params.itemId },
      { $set: updates },
      { new: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: "Item not found" });
    const item = budget.items.id(req.params.itemId);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/suite/budget/:eventId/items/:itemId
export const deleteBudgetItem = async (req, res) => {
  try {
    await Budget.findOneAndUpdate(
      { eventId: req.params.eventId },
      { $pull: { items: { _id: req.params.itemId } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── AI — Event Plan (streaming SSE) ─────────────────────────────────────────

// POST /api/suite/plan
export const generatePlan = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const stream = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are an expert event planner. When given an event title and description, produce a concise, actionable event plan in markdown. Include sections: Overview, Timeline, Logistics, Marketing, and Contingency.",
        },
        {
          role: "user",
          content: `Event Title: ${title}\nDescription: ${description ?? "No description provided."}`,
        },
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
  } finally {
    res.end();
  }
};

// ─── AI — RSVP Questions ──────────────────────────────────────────────────────

// POST /api/suite/rsvp-questions
export const generateRsvpQuestions = async (req, res) => {
  const { title, description, expectedAttendees } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            'You are an event management assistant. Generate 4-6 relevant RSVP questions for the given event. Return ONLY a JSON array. Each object must have: "label" (string), "fieldType" ("text"|"multiple_choice"|"yes_no"), "required" (boolean). No markdown, no explanation.',
        },
        {
          role: "user",
          content: `Event: ${title}\nDescription: ${description ?? ""}\nExpected attendees: ${expectedAttendees ?? "unknown"}`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    const jsonStart = raw.indexOf("[");
    const jsonEnd = raw.lastIndexOf("]") + 1;
    const questions = JSON.parse(raw.slice(jsonStart, jsonEnd));
    res.json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Suite Data (plan, rsvpQuestions, flyerSettings on event doc) ─────────────

// PATCH /api/events/:id/suite-data
// Merges keys into suiteData individually — never overwrites unrelated keys
export const saveSuiteData = async (req, res) => {
  try {
    const updates = {};
    for (const key of Object.keys(req.body)) {
      updates[`suiteData.${key}`] = req.body[key];
    }
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      { $set: updates },
      { new: true }
    );
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, suiteData: event.suiteData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
