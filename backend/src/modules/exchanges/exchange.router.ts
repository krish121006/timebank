import { Router } from 'express';
import { ExchangeService } from './exchange.service';
import { Exchange } from './exchange.model';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const exchanges = await Exchange.find({
      $or: [{ requesterId: userId }, { providerId: userId }]
    })
      .populate('requesterId', 'name username avatarUrl ratingAverage')
      .populate('providerId', 'name username avatarUrl ratingAverage')
      .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { providerId, skillName, durationHours, notes } = req.body;
    if (!providerId || !skillName) {
      return res.status(400).json({ message: 'Provider ID and skill name are required.' });
    }

    const exchange = await ExchangeService.createExchangeRequest({
      requesterId: req.user?.userId!,
      providerId,
      skillName,
      durationHours: durationHours || 1,
      notes
    });

    res.status(201).json(exchange);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/status', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { status, scheduledAt, reason } = req.body;
    const exchange = await ExchangeService.updateStatus(
      req.params.id,
      req.user?.userId!,
      status,
      { scheduledAt, reason }
    );
    res.json(exchange);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
