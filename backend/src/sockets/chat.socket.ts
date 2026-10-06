import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Conversation } from '../modules/chat/chat.model';

export const registerChatSocketHandlers = (io: Server) => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    try {
      const secret = process.env.JWT_SECRET || 'timebank_super_secret_jwt_key_2026_safe';
      const decoded = jwt.verify(token, secret) as any;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;

    socket.on('join_conversation', (exchangeId: string) => {
      socket.join(`exchange_${exchangeId}`);
    });

    socket.on('send_message', async (data: { exchangeId: string; text: string }) => {
      try {
        const conversation = await Conversation.findOne({
          exchangeId: data.exchangeId,
          participants: user.userId
        });

        if (!conversation) return;

        const newMsg = {
          senderId: user.userId,
          text: data.text,
          read: false,
          createdAt: new Date()
        };

        conversation.messages.push(newMsg as any);
        await conversation.save();

        io.to(`exchange_${data.exchangeId}`).emit('new_message', {
          exchangeId: data.exchangeId,
          message: newMsg,
          senderUsername: user.username
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect handling
    });
  });
};
