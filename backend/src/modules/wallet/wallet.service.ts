import mongoose from 'mongoose';
import { Wallet } from './wallet.model';
import { CreditTransaction, TransactionType, TransactionDirection } from './transaction.model';

export class WalletService {
  static async getOrCreateWallet(userId: string) {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        cachedBalance: 5, // 5 welcome credits
        pendingBalance: 0,
        currency: 'TIME_CREDIT',
        status: 'ACTIVE'
      });

      // Record welcome bonus transaction
      const idempotencyKey = `welcome_bonus_${userId}`;
      await CreditTransaction.create({
        userId,
        amount: 5,
        type: 'BONUS',
        direction: 'INBOUND',
        description: 'Welcome Bonus: Initial 5 Time Credits',
        status: 'COMPLETED',
        idempotencyKey
      });
    }
    return wallet;
  }

  static async recordTransaction(params: {
    userId: string;
    amount: number;
    type: TransactionType;
    direction: TransactionDirection;
    description: string;
    idempotencyKey: string;
    exchangeId?: string;
  }) {
    const existing = await CreditTransaction.findOne({ idempotencyKey: params.idempotencyKey });
    if (existing) {
      return existing; // Idempotent return
    }

    const wallet = await this.getOrCreateWallet(params.userId);

    if (params.direction === 'OUTBOUND' && wallet.cachedBalance < params.amount) {
      throw new Error(`Insufficient Time Credits balance. Required: ${params.amount}, Available: ${wallet.cachedBalance}`);
    }

    const transaction = await CreditTransaction.create({
      userId: params.userId,
      amount: params.amount,
      type: params.type,
      direction: params.direction,
      exchangeId: params.exchangeId,
      description: params.description,
      status: 'COMPLETED',
      idempotencyKey: params.idempotencyKey
    });

    if (params.direction === 'INBOUND') {
      wallet.cachedBalance += params.amount;
    } else {
      wallet.cachedBalance -= params.amount;
    }
    await wallet.save();

    return transaction;
  }

  static async getTransactionHistory(userId: string) {
    return await CreditTransaction.find({ userId }).sort({ createdAt: -1 });
  }
}
