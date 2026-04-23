import Budget from "../../../models/Budget.js";
import BudgetItem from "../../../models/BudgetItem.js";

export const getBudget = async (eventId) => {
  const budget = await Budget.findOne({ eventId });
  if (!budget) return { totalBudget: 0, items: [] };
  const items = await BudgetItem.find({ budgetId: budget._id }).sort({ createdAt: 1 });
  return { ...budget.toJSON(), items };
};

export const upsertTotalBudget = async (eventId, totalBudget) => {
  const budget = await Budget.findOneAndUpdate(
    { eventId },
    { $set: { totalBudget } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return budget;
};

export const addItem = async (eventId, { label, category, estimated, actual }) => {
  let budget = await Budget.findOne({ eventId });
  if (!budget) budget = await Budget.create({ eventId, totalBudget: 0 });

  const item = await BudgetItem.create({
    budgetId: budget._id,
    label,
    category: category || "Other",
    estimated,
    actual: actual != null ? actual : null,
  });
  return item;
};

export const updateItem = async (eventId, itemId, updates) => {
  const budget = await Budget.findOne({ eventId });
  if (!budget) throw Object.assign(new Error("Budget not found"), { status: 404 });

  const item = await BudgetItem.findOneAndUpdate(
    { _id: itemId, budgetId: budget._id },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!item) throw Object.assign(new Error("Item not found"), { status: 404 });
  return item;
};

export const deleteItem = async (eventId, itemId) => {
  const budget = await Budget.findOne({ eventId });
  if (!budget) throw Object.assign(new Error("Budget not found"), { status: 404 });

  const result = await BudgetItem.findOneAndDelete({ _id: itemId, budgetId: budget._id });
  if (!result) throw Object.assign(new Error("Item not found"), { status: 404 });
};
