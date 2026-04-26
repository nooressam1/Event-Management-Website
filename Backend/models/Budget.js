import mongoose from "mongoose";

const budgetItemSchema = new mongoose.Schema(
  {
    category: { type: String, default: "General" },
    label:    { type: String, required: true },
    estimated:{ type: Number, default: 0 },
    actual:   { type: Number, default: 0 },
    note:     { type: String, default: "" },
  },
  { _id: true }
);

const budgetSchema = new mongoose.Schema(
  {
    eventId:     { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, unique: true },
    totalBudget: { type: Number, default: 0 },
    items:       [budgetItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Budget", budgetSchema);
