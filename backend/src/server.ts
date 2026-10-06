import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { registerChatSocketHandlers } from './sockets/chat.socket';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

registerChatSocketHandlers(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` TimeBank API Server running on port ${PORT}`);
    console.log(` Base API URL: http://localhost:${PORT}/api`);
    console.log(` Socket.IO server ready`);
    console.log(`=================================================`);
  });
});
