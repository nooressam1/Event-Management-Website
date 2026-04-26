import { useState, useEffect, useCallback } from "react";
import * as api from "../utils/budgetService";

const useBudget = (eventId) => {
  const [budget, setBudget] = useState({ totalBudget: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    if (!eventId) return;
    setLoading(true);
    api.fetchBudget(eventId)
      .then((b) => setBudget(b ?? { totalBudget: 0, items: [] }))
      .catch(() => setError("Failed to load budget."))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => { load(); }, [load]);

  const saveTotalBudget = async (value) => {
    const prev = budget.totalBudget;
    setBudget((b) => ({ ...b, totalBudget: value }));
    try {
      const updated = await api.saveTotalBudget(eventId, value);
      setBudget((b) => ({ ...b, totalBudget: updated.totalBudget }));
    } catch {
      setBudget((b) => ({ ...b, totalBudget: prev }));
      setError("Failed to save total budget.");
    }
  };

  const addItem = async (data) => {
    const tempId = `temp-${Date.now()}`;
    const tempItem = { _id: tempId, ...data, _optimistic: true };
    setBudget((b) => ({ ...b, items: [...b.items, tempItem] }));
    try {
      const item = await api.createItem(eventId, data);
      setBudget((b) => ({
        ...b,
        items: b.items.map((i) => (i._id === tempId ? item : i)),
      }));
    } catch (err) {
      setBudget((b) => ({ ...b, items: b.items.filter((i) => i._id !== tempId) }));
      setError(err?.response?.data?.message ?? "Failed to add item.");
    }
  };

  const updateItem = async (itemId, updates) => {
    const prev = budget.items.find((i) => i._id === itemId);
    setBudget((b) => ({
      ...b,
      items: b.items.map((i) => (i._id === itemId ? { ...i, ...updates } : i)),
    }));
    try {
      const item = await api.patchItem(eventId, itemId, updates);
      setBudget((b) => ({
        ...b,
        items: b.items.map((i) => (i._id === itemId ? item : i)),
      }));
    } catch {
      setBudget((b) => ({
        ...b,
        items: b.items.map((i) => (i._id === itemId ? prev : i)),
      }));
      setError("Failed to update item.");
    }
  };

  const deleteItem = async (itemId) => {
    const prev = budget.items.find((i) => i._id === itemId);
    setBudget((b) => ({ ...b, items: b.items.filter((i) => i._id !== itemId) }));
    try {
      await api.removeItem(eventId, itemId);
    } catch {
      setBudget((b) => ({
        ...b,
        items: [...b.items, prev].sort(
          (a, c) => new Date(a.createdAt) - new Date(c.createdAt)
        ),
      }));
      setError("Failed to delete item.");
    }
  };

  return { budget, loading, error, setError, saveTotalBudget, addItem, updateItem, deleteItem };
};

export default useBudget;
