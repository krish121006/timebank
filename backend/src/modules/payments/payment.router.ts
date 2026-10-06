import { Router } from 'express';
import { PaymentService } from './payment.service';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.post('/order', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { plan } = req.body;
    const order = await PaymentService.createOrder(
      req.user?.userId!,
      plan || 'PREMIUM_MONTHLY'
    );
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/buy-credits', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { pack } = req.body;
    const order = await PaymentService.createCreditPackOrder(
      req.user?.userId!,
      pack || 'PACK_5'
    );
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/verify', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { orderId, paymentId } = req.body;
    const result = await PaymentService.verifyPayment({
      userId: req.user?.userId!,
      orderId,
      paymentId
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
