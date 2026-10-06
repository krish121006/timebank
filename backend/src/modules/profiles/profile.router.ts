import { Router } from 'express';
import { User } from '../users/user.model';
import { UserSkill } from '../skills/skill.model';
import { Rating } from '../reputation/rating.model';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    const skills = await UserSkill.find({ userId: req.user?.userId });
    res.json({ user, skills });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/me', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { name, bio, timezone, languages, experienceYears, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(timezone && { timezone }),
        ...(languages && { languages }),
        ...(experienceYears !== undefined && { experienceYears }),
        ...(avatarUrl !== undefined && { avatarUrl })
      },
      { new: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'Profile not found' });

    const skills = await UserSkill.find({ userId: user._id });
    const reviews = await Rating.find({ targetUserId: user._id }).populate('reviewerId', 'name username avatarUrl');

    res.json({ user, skills, reviews });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
