import mongoose from 'mongoose';

const FinanceSnapshotSchema = new mongoose.Schema(
  {
    profileKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    state: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FinanceSnapshot =
  mongoose.models.FinanceSnapshot || mongoose.model('FinanceSnapshot', FinanceSnapshotSchema);
