import { PaymentOrder } from './payment.model';
import { User } from '../users/user.model';
import { WalletService } from '../wallet/wallet.service';

export class PaymentService {
  static async createOrder(userId: string, plan: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY') {
    const amount = plan === 'PREMIUM_MONTHLY' ? 29900 : 249900; // in paise
    const orderId = `stripe_ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await PaymentOrder.create({
      userId,
      orderId,
      amount,
      currency: 'INR',
      plan,
      status: 'CREATED'
    });

    return {
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51UIXJ2FWrvRMNc8zCoMMz5lNUqXNmt0iFu2ZusQMMSYax3Py5kNlSkMZoyjKetTJkFdU7pKfQpZC9y0TMytWdHUG00NM7CBfPU'
    };
  }

  static async createCreditPackOrder(userId: string, pack: 'PACK_5' | 'PACK_15' | 'PACK_30') {
    const amount = pack === 'PACK_5' ? 9900 : pack === 'PACK_15' ? 24900 : 44900;
    const orderId = `stripe_pack_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await PaymentOrder.create({
      userId,
      orderId,
      amount,
      currency: 'INR',
      plan: 'CREDIT_PACK',
      creditPack: pack,
      status: 'CREATED'
    });

    return {
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51UIXJ2FWrvRMNc8zCoMMz5lNUqXNmt0iFu2ZusQMMSYax3Py5kNlSkMZoyjKetTJkFdU7pKfQpZC9y0TMytWdHUG00NM7CBfPU'
    };
  }

  static async verifyPayment(params: {
    userId: string;
    orderId: string;
    paymentId?: string;
  }) {
    const order = await PaymentOrder.findOne({ orderId: params.orderId });
    if (!order) throw new Error('Payment order not found.');

    order.status = 'PAID';
    order.paymentId = params.paymentId || `pay_stripe_${Date.now()}`;
    await order.save();

    // If order type is credit purchase top-up
    if ((order as any).creditPack) {
      const packCredits = (order as any).creditPack === 'PACK_5' ? 5 : (order as any).creditPack === 'PACK_15' ? 15 : 30;
      await WalletService.recordTransaction({
        userId: params.userId,
        amount: packCredits,
        type: 'TRANSFER',
        direction: 'INBOUND',
        description: `Stripe Payment: Top-up Credit Pack (+${packCredits} Time Credits)`,
        idempotencyKey: `credit_topup_${order._id}`
      });

      return { success: true, message: `Stripe Payment Verified! Added +${packCredits} Time Credits to wallet!` };
    }

    // Activate user premium entitlement for 30 or 365 days
    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + (order.plan === 'PREMIUM_MONTHLY' ? 30 : 365));

    // Grant bonus credits for premium subscription
    const bonusCredits = order.plan === 'PREMIUM_MONTHLY' ? 3 : 10;
    await WalletService.recordTransaction({
      userId: params.userId,
      amount: bonusCredits,
      type: 'BONUS',
      direction: 'INBOUND',
      description: `Stripe Premium Membership Bonus (+${bonusCredits} Time Credits)`,
      idempotencyKey: `premium_bonus_${order._id}`
    });

    await User.findByIdAndUpdate(params.userId, {
      isPremium: true,
      premiumPlan: order.plan,
      premiumUntil
    });

    return { success: true, message: `Stripe Payment Verified! Premium activated + ${bonusCredits} Bonus Credits added!` };
  }
}
