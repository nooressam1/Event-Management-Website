import mongoose from "mongoose";

export const CATEGORIES = ["Venue", "Catering", "Marketing", "Equipment", "Staff", "Other"];

const BudgetItemSchema = new mongoose.Schema(
  {
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },
    label:     { type: String, required: true, trim: true },
    category:  { type: String, enum: CATEGORIES, default: "Other" },
    estimated: { type: Number, required: true, min: 0 },
    actual:    { type: Number, default: null, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("BudgetItem", BudgetItemSchema);
