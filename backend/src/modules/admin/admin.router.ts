import { Router } from 'express';
import { User } from '../users/user.model';
import { Exchange } from '../exchanges/exchange.model';
import { CreditTransaction } from '../wallet/transaction.model';
import { Dispute } from '../disputes/dispute.model';
import { authenticateJWT, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT, requireAdmin);

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/exchanges', async (req, res) => {
  try {
    const exchanges = await Exchange.find()
      .populate('requesterId', 'name username')
      .populate('providerId', 'name username')
      .sort({ createdAt: -1 });
    res.json(exchanges);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await CreditTransaction.find()
      .populate('userId', 'name username')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/disputes', async (req, res) => {
  try {
    const disputes = await Dispute.find()
      .populate('exchangeId')
      .populate('raisedByUserId', 'name username')
      .sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
