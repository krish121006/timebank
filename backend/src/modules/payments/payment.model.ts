import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  plan: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY' | 'CREDIT_PACK';
  creditPack?: 'PACK_5' | 'PACK_15' | 'PACK_30';
  status: 'CREATED' | 'PAID' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const PaymentOrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true, unique: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    plan: { type: String, enum: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY', 'CREDIT_PACK'], default: 'PREMIUM_MONTHLY' },
    creditPack: { type: String, enum: ['PACK_5', 'PACK_15', 'PACK_30'] },
    status: { type: String, enum: ['CREATED', 'PAID', 'FAILED'], default: 'CREATED' }
  },
  { timestamps: true }
);

export const PaymentOrder = mongoose.model<IPaymentOrder>('PaymentOrder', PaymentOrderSchema);

// Drop legacy Razorpay index automatically if exists in MongoDB collection
PaymentOrder.cleanIndexes().catch(() => { });
PaymentOrder.collection.dropIndex('razorpayOrderId_1').catch(() => { });
