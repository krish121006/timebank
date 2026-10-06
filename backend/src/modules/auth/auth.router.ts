import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model';
import { WalletService } from '../wallet/wallet.service';
import { authenticateJWT, AuthRequest } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, bio, timezone, languages, role } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'Username, email, password, and name are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email is already taken.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      passwordHash,
      name,
      bio: bio || '',
      timezone: timezone || 'UTC',
      languages: languages || ['English'],
      role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER'
    });

    // Initialize user wallet with 5 welcome credits
    await WalletService.getOrCreateWallet(user._id.toString());

    const tokenSecret = process.env.JWT_SECRET || 'timebank_super_secret_jwt_key_2026_safe';
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, role: user.role },
      tokenSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium,
        premiumPlan: user.premiumPlan
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername.toLowerCase() }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Ensure wallet exists
    await WalletService.getOrCreateWallet(user._id.toString());

    const tokenSecret = process.env.JWT_SECRET || 'timebank_super_secret_jwt_key_2026_safe';
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, role: user.role },
      tokenSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium,
        premiumPlan: user.premiumPlan
      }
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error during login.' });
  }
});

router.get('/me', authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
