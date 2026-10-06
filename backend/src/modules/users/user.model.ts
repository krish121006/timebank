import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  bio?: string;
  timezone: string;
  languages: string[];
  experienceYears?: number;
  avatarUrl?: string;
  role: 'MEMBER' | 'ADMIN';
  isVerified: boolean;
  isPremium: boolean;
  premiumPlan?: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY' | 'NONE';
  premiumUntil?: Date;
  ratingAverage: number;
  ratingCount: number;
  completedExchangesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    timezone: { type: String, default: 'UTC' },
    languages: { type: [String], default: ['English'] },
    experienceYears: { type: Number, default: 1 },
    avatarUrl: { type: String, default: '' },
    role: { type: String, enum: ['MEMBER', 'ADMIN'], default: 'MEMBER' },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    premiumPlan: { type: String, enum: ['PREMIUM_MONTHLY', 'PREMIUM_YEARLY', 'NONE'], default: 'NONE' },
    premiumUntil: { type: Date },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    completedExchangesCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
