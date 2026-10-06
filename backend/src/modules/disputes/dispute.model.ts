import mongoose, { Schema, Document } from 'mongoose';

export interface IDispute extends Document {
  exchangeId: mongoose.Types.ObjectId;
  raisedByUserId: mongoose.Types.ObjectId;
  reason: string;
  status: 'OPEN' | 'RESOLVED_REFUND' | 'RESOLVED_PAY' | 'DISMISSED';
  resolutionNotes?: string;
  resolvedByUserId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema(
  {
    exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange', required: true },
    raisedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED_REFUND', 'RESOLVED_PAY', 'DISMISSED'],
      default: 'OPEN'
    },
    resolutionNotes: { type: String, default: '' },
    resolvedByUserId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Dispute = mongoose.model<IDispute>('Dispute', DisputeSchema);
