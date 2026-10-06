import { Router } from 'express';
import { WalletService } from './wallet.service';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const wallet = await WalletService.getOrCreateWallet(req.user?.userId!);
    res.json(wallet);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/transactions', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const history = await WalletService.getTransactionHistory(req.user?.userId!);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
