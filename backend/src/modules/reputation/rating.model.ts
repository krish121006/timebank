import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  exchangeId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  rating: number; // 1 - 5
  reviewText: string;
  createdAt: Date;
}

const RatingSchema = new Schema(
  {
    exchangeId: { type: Schema.Types.ObjectId, ref: 'Exchange', required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, default: '' }
  },
  { timestamps: true }
);

RatingSchema.index({ exchangeId: 1, reviewerId: 1 }, { unique: true });

export const Rating = mongoose.model<IRating>('Rating', RatingSchema);
