import { Router } from 'express';
import { Rating } from './rating.model';
import { Exchange } from '../exchanges/exchange.model';
import { User } from '../users/user.model';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { exchangeId, targetUserId, rating, reviewText } = req.body;
    if (!exchangeId || !targetUserId || !rating) {
      return res.status(400).json({ message: 'Exchange ID, target user, and rating (1-5) are required.' });
    }

    const exchange = await Exchange.findById(exchangeId);
    if (!exchange || exchange.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Ratings can only be submitted for COMPLETED exchanges.' });
    }

    const reviewerId = req.user?.userId;
    if (reviewerId === targetUserId) {
      return res.status(400).json({ message: 'You cannot rate yourself.' });
    }

    const newRating = await Rating.create({
      exchangeId,
      reviewerId,
      targetUserId,
      rating,
      reviewText: reviewText || ''
    });

    // Update target user average rating & rating count
    const allRatings = await Rating.find({ targetUserId });
    const avg = allRatings.reduce((acc, cur) => acc + cur.rating, 0) / allRatings.length;

    await User.findByIdAndUpdate(targetUserId, {
      ratingAverage: Math.round(avg * 10) / 10,
      ratingCount: allRatings.length
    });

    res.status(201).json(newRating);
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted a review for this exchange.' });
    }
    res.status(500).json({ message: err.message });
  }
});

export default router;
