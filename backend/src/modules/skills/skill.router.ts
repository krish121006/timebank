import { Router } from 'express';
import { UserSkill } from './skill.model';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

// Get catalog of all offered/requested skills
router.get('/', async (req, res) => {
  try {
    const { mode, category, search } = req.query;
    const filter: any = {};
    if (mode) filter.mode = mode;
    if (category) filter.category = category;
    if (search) {
      filter.skillName = { $regex: search as string, $options: 'i' };
    }

    const skills = await UserSkill.find(filter).populate('userId', 'name username ratingAverage ratingCount avatarUrl');
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Create new user skill offer or request
router.post('/me', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { skillName, category, proficiency, mode, description, availabilityDays } = req.body;
    if (!skillName || !mode) {
      return res.status(400).json({ message: 'Skill name and mode (TEACH/LEARN) are required.' });
    }

    const newSkill = await UserSkill.create({
      userId: req.user?.userId,
      skillName,
      category: category || 'General',
      proficiency: proficiency || 'INTERMEDIATE',
      mode,
      description: description || '',
      availabilityDays: availabilityDays || ['Saturday', 'Sunday']
    });

    res.status(201).json(newSkill);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user skill
router.delete('/me/:id', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const skill = await UserSkill.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!skill) return res.status(404).json({ message: 'Skill not found or unauthorized' });
    res.json({ message: 'Skill removed successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
