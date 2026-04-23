import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true,
    },
    totalBudget: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Budget", BudgetSchema);
