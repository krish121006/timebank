import { Router } from 'express';
import { MatchingService } from './matching.service';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.post('/search', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { query, category, availabilityDay } = req.body;
    const matches = await MatchingService.findMatches({
      query,
      requesterUserId: req.user?.userId,
      category,
      availabilityDay
    });
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/parse', async (req, res) => {
  try {
    const { promptText } = req.body;
    if (!promptText) return res.status(400).json({ message: 'Prompt text is required' });
    const parsed = MatchingService.parseNaturalLanguageRequest(promptText);
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
