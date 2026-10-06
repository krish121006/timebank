import { Router } from 'express';
import { Conversation } from './chat.model';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.get('/conversation/:exchangeId', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const conversation = await Conversation.findOne({
      exchangeId: req.params.exchangeId,
      participants: req.user?.userId
    }).populate('participants', 'name username avatarUrl');

    if (!conversation) return res.status(404).json({ message: 'Conversation not found or access denied.' });
    res.json(conversation);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/conversation/:exchangeId/messages', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text is required' });

    const conversation = await Conversation.findOne({
      exchangeId: req.params.exchangeId,
      participants: req.user?.userId
    });

    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const newMsg = {
      senderId: req.user?.userId as any,
      text,
      read: false,
      createdAt: new Date()
    };

    conversation.messages.push(newMsg as any);
    await conversation.save();

    res.status(201).json(newMsg);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
