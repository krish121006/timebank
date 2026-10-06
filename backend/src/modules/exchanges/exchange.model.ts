import mongoose, { Schema, Document } from 'mongoose';

export type ExchangeStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'PENDING_CONFIRMATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface IExchange extends Document {
  requesterId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  skillName: string;
  durationHours: number;
  creditAmount: number;
  scheduledAt?: Date;
  status: ExchangeStatus;
  notes?: string;
  completionState: {
    requesterConfirmed: boolean;
    providerConfirmed: boolean;
  };
  disputeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeSchema: Schema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skillName: { type: String, required: true },
    durationHours: { type: Number, default: 1 },
    creditAmount: { type: Number, default: 1 },
    scheduledAt: { type: Date },
    status: {
      type: String,
      enum: [
        'REQUESTED',
        'ACCEPTED',
        'SCHEDULED',
        'IN_PROGRESS',
        'PENDING_CONFIRMATION',
        'COMPLETED',
        'CANCELLED',
        'DISPUTED'
      ],
      default: 'REQUESTED'
    },
    notes: { type: String, default: '' },
    completionState: {
      requesterConfirmed: { type: Boolean, default: false },
      providerConfirmed: { type: Boolean, default: false }
    },
    disputeReason: { type: String }
  },
  { timestamps: true }
);

ExchangeSchema.index({ requesterId: 1, status: 1 });
ExchangeSchema.index({ providerId: 1, status: 1 });

export const Exchange = mongoose.model<IExchange>('Exchange', ExchangeSchema);
