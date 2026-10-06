import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  cachedBalance: number;
  pendingBalance: number;
  currency: 'TIME_CREDIT';
  status: 'ACTIVE' | 'FROZEN';
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    cachedBalance: { type: Number, default: 5 }, // 5 initial welcome credits
    pendingBalance: { type: Number, default: 0 },
    currency: { type: String, default: 'TIME_CREDIT' },
    status: { type: String, enum: ['ACTIVE', 'FROZEN'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);
