import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './modules/auth/auth.router';
import profileRouter from './modules/profiles/profile.router';
import skillRouter from './modules/skills/skill.router';
import matchingRouter from './modules/matching/matching.router';
import exchangeRouter from './modules/exchanges/exchange.router';
import walletRouter from './modules/wallet/wallet.router';
import chatRouter from './modules/chat/chat.router';
import reputationRouter from './modules/reputation/reputation.router';
import paymentRouter from './modules/payments/payment.router';
import adminRouter from './modules/admin/admin.router';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Module Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/skills', skillRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/exchanges', exchangeRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/chat', chatRouter);
app.use('/api/reputation', reputationRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/admin', adminRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'TimeBank API Server', timestamp: new Date() });
});

export default app;
