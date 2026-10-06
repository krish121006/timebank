import { Exchange, ExchangeStatus } from './exchange.model';
import { WalletService } from '../wallet/wallet.service';
import { User } from '../users/user.model';
import { Conversation } from '../chat/chat.model';

export class ExchangeService {
  static async createExchangeRequest(params: {
    requesterId: string;
    providerId: string;
    skillName: string;
    durationHours: number;
    notes?: string;
  }) {
    if (params.requesterId === params.providerId) {
      throw new Error('You cannot request an exchange with yourself.');
    }

    const creditAmount = params.durationHours;
    const requesterWallet = await WalletService.getOrCreateWallet(params.requesterId);
    if (requesterWallet.cachedBalance < creditAmount) {
      throw new Error(`Insufficient Time Credits. You need ${creditAmount} credits for this exchange.`);
    }

    const exchange = await Exchange.create({
      requesterId: params.requesterId,
      providerId: params.providerId,
      skillName: params.skillName,
      durationHours: params.durationHours,
      creditAmount,
      status: 'REQUESTED',
      notes: params.notes || ''
    });

    // Create associated conversation
    await Conversation.create({
      exchangeId: exchange._id,
      participants: [params.requesterId, params.providerId],
      messages: []
    });

    return exchange;
  }

  static async updateStatus(exchangeId: string, userId: string, newStatus: ExchangeStatus, data?: any) {
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) throw new Error('Exchange not found');

    const isRequester = exchange.requesterId.toString() === userId;
    const isProvider = exchange.providerId.toString() === userId;

    if (!isRequester && !isProvider) {
      throw new Error('Not authorized to modify this exchange.');
    }

    // State machine transitions
    if (newStatus === 'ACCEPTED' && exchange.status === 'REQUESTED') {
      if (!isProvider) throw new Error('Only the provider can accept an exchange request.');
      exchange.status = 'ACCEPTED';
    } else if (newStatus === 'SCHEDULED') {
      exchange.status = 'SCHEDULED';
      if (data?.scheduledAt) {
        exchange.scheduledAt = new Date(data.scheduledAt);
      }
    } else if (newStatus === 'IN_PROGRESS') {
      exchange.status = 'IN_PROGRESS';
    } else if (newStatus === 'PENDING_CONFIRMATION') {
      exchange.status = 'PENDING_CONFIRMATION';
      if (isRequester) exchange.completionState.requesterConfirmed = true;
      if (isProvider) exchange.completionState.providerConfirmed = true;
    } else if (newStatus === 'CANCELLED') {
      if (['COMPLETED'].includes(exchange.status)) {
        throw new Error('Cannot cancel an already completed exchange.');
      }
      exchange.status = 'CANCELLED';
    } else if (newStatus === 'DISPUTED') {
      exchange.status = 'DISPUTED';
      exchange.disputeReason = data?.reason || 'Exchange dispute raised.';
    }

    await exchange.save();

    // Check completion settlement condition
    if (
      exchange.status === 'PENDING_CONFIRMATION' ||
      newStatus === 'COMPLETED'
    ) {
      if (isRequester) exchange.completionState.requesterConfirmed = true;
      if (isProvider) exchange.completionState.providerConfirmed = true;

      // Settle if both confirmed or explicit complete call
      if (
        newStatus === 'COMPLETED' ||
        (exchange.completionState.requesterConfirmed && exchange.completionState.providerConfirmed)
      ) {
        await this.settleExchange(exchange);
      } else {
        await exchange.save();
      }
    }

    return exchange;
  }

  private static async settleExchange(exchange: any) {
    if (exchange.status === 'COMPLETED') return; // Already settled

    const amount = exchange.creditAmount;
    const exchangeIdStr = exchange._id.toString();

    // Provider EARN credit
    await WalletService.recordTransaction({
      userId: exchange.providerId.toString(),
      amount,
      type: 'EARN',
      direction: 'INBOUND',
      description: `Earned ${amount} Time Credit(s) teaching ${exchange.skillName}`,
      idempotencyKey: `exchange_earn_${exchangeIdStr}`,
      exchangeId: exchangeIdStr
    });

    // Requester SPEND credit
    await WalletService.recordTransaction({
      userId: exchange.requesterId.toString(),
      amount,
      type: 'SPEND',
      direction: 'OUTBOUND',
      description: `Spent ${amount} Time Credit(s) learning ${exchange.skillName}`,
      idempotencyKey: `exchange_spend_${exchangeIdStr}`,
      exchangeId: exchangeIdStr
    });

    exchange.status = 'COMPLETED';
    await exchange.save();

    // Update user stats
    await User.findByIdAndUpdate(exchange.providerId, { $inc: { completedExchangesCount: 1 } });
    await User.findByIdAndUpdate(exchange.requesterId, { $inc: { completedExchangesCount: 1 } });
  }
}
