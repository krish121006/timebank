import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'EARN' | 'SPEND' | 'TRANSFER' | 'REFUND' | 'ADJUSTMENT' | 'BONUS';
export type TransactionDirection = 'INBOUND' | 'OUTBOUND';

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  direction: TransactionDirection;
  exchangeId?: mongoose.Types.ObjectId;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  idempotencyKey: string;
  createdAt: Date;
}

const CreditTransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['EARN', 'SPEND', 'TRANSFER', 'REFUND', 'ADJUSTMENT', 'BONUS'],
      required: true
    },
    direction: { type: String, enum: ['INBOUND', 'OUTBOUND'], required: true },
    exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange' },
    description: { type: String, required: true },
    status: { type: String, enum: ['COMPLETED', 'PENDING', 'CANCELLED'], default: 'COMPLETED' },
    idempotencyKey: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

CreditTransactionSchema.index({ userId: 1, createdAt: -1 });

export const CreditTransaction = mongoose.model<ICreditTransaction>(
  'CreditTransaction',
  CreditTransactionSchema
);
