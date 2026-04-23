import Event from "../../models/Event.js";
import * as svc from "../services/Event_Creator_Suite_Service/budgetService.js";

const ownerCheck = async (eventId, userId) => {
  const event = await Event.findOne({ _id: eventId, organizer: userId });
  if (!event) throw Object.assign(new Error("Event not found"), { status: 404 });
};

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    res.status(err.status ?? 500).json({ message: err.message ?? "Server error" });
  }
};

export const getBudget = handle(async (req, res) => {
  await ownerCheck(req.params.eventId, req.user.id);
  const budget = await svc.getBudget(req.params.eventId);
  res.json({ success: true, budget });
});

export const upsertBudget = handle(async (req, res) => {
  await ownerCheck(req.params.eventId, req.user.id);
  const { totalBudget } = req.body;
  if (totalBudget == null || isNaN(Number(totalBudget))) {
    return res.status(400).json({ message: "totalBudget must be a number." });
  }
  const budget = await svc.upsertTotalBudget(req.params.eventId, Number(totalBudget));
  res.json({ success: true, budget });
});

export const addItem = handle(async (req, res) => {
  await ownerCheck(req.params.eventId, req.user.id);
  const { label, category, estimated, actual } = req.body;
  if (!label?.trim()) return res.status(400).json({ message: "label is required." });
  if (estimated == null || isNaN(Number(estimated))) {
    return res.status(400).json({ message: "estimated amount is required." });
  }
  const item = await svc.addItem(req.params.eventId, {
    label: label.trim(),
    category,
    estimated: Number(estimated),
    actual: actual != null ? Number(actual) : null,
  });
  res.status(201).json({ success: true, item });
});

export const updateItem = handle(async (req, res) => {
  await ownerCheck(req.params.eventId, req.user.id);
  const updates = {};
  if (req.body.label     !== undefined) updates.label     = req.body.label;
  if (req.body.category  !== undefined) updates.category  = req.body.category;
  if (req.body.estimated !== undefined) updates.estimated = Number(req.body.estimated);
  if (req.body.actual    !== undefined) {
    updates.actual = req.body.actual === null ? null : Number(req.body.actual);
  }
  const item = await svc.updateItem(req.params.eventId, req.params.itemId, updates);
  res.json({ success: true, item });
});

export const deleteItem = handle(async (req, res) => {
  await ownerCheck(req.params.eventId, req.user.id);
  await svc.deleteItem(req.params.eventId, req.params.itemId);
  res.json({ success: true });
});
