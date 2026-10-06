import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSkill extends Document {
  userId: mongoose.Types.ObjectId;
  skillName: string;
  category: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  mode: 'TEACH' | 'LEARN';
  description: string;
  availabilityDays: string[]; // e.g. ['Saturday', 'Sunday']
  createdAt: Date;
  updatedAt: Date;
}

const UserSkillSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    skillName: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    proficiency: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
      default: 'INTERMEDIATE'
    },
    mode: { type: String, enum: ['TEACH', 'LEARN'], required: true },
    description: { type: String, default: '' },
    availabilityDays: { type: [String], default: ['Saturday', 'Sunday'] }
  },
  { timestamps: true }
);

UserSkillSchema.index({ userId: 1, mode: 1 });
UserSkillSchema.index({ skillName: 'text', description: 'text' });

export const UserSkill = mongoose.model<IUserSkill>('UserSkill', UserSkillSchema);
