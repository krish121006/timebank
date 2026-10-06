export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
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
  premiumUntil?: string;
  ratingAverage: number;
  ratingCount: number;
  completedExchangesCount: number;
}

export interface UserSkill {
  _id: string;
  userId: User | string;
  skillName: string;
  category: string;
  proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  mode: 'TEACH' | 'LEARN';
  description: string;
  availabilityDays: string[];
}

export interface Wallet {
  _id: string;
  userId: string;
  cachedBalance: number;
  pendingBalance: number;
  currency: 'TIME_CREDIT';
  status: 'ACTIVE' | 'FROZEN';
}

export interface CreditTransaction {
  _id: string;
  userId: string;
  amount: number;
  type: 'EARN' | 'SPEND' | 'TRANSFER' | 'REFUND' | 'ADJUSTMENT' | 'BONUS';
  direction: 'INBOUND' | 'OUTBOUND';
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export type ExchangeStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'PENDING_CONFIRMATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface Exchange {
  _id: string;
  requesterId: User;
  providerId: User;
  skillName: string;
  durationHours: number;
  creditAmount: number;
  scheduledAt?: string;
  status: ExchangeStatus;
  notes?: string;
  completionState: {
    requesterConfirmed: boolean;
    providerConfirmed: boolean;
  };
  disputeReason?: string;
  createdAt: string;
}

export interface SmartMatchCandidate {
  candidateUser: User;
  skill: UserSkill;
  matchScore: number;
  reasons: string[];
}
