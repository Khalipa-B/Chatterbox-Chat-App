const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const User = require('./models/User');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Mongo connected"));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Map of connected users
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log("🔌 New socket:", socket.id);

  socket.on('join', async ({ userId, username }) => {
    onlineUsers[socket.id] = { userId, username };
    await User.findByIdAndUpdate(userId, { online: true });
    io.emit('online-users', Object.values(onlineUsers));
  });

  socket.on('send-message', (msg) => {
    const { text, sender } = msg;
    const timestamp = new Date().toISOString();
    io.emit('receive-message', { text, sender, timestamp });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', async () => {
    const user = onlineUsers[socket.id];
    if (user) {
      await User.findByIdAndUpdate(user.userId, { online: false });
      delete onlineUsers[socket.id];
      io.emit('online-users', Object.values(onlineUsers));
    }
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
