const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const uploadRoutes = require('./routes/upload');



dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.use('/api', uploadRoutes);


// Socket.io events here...

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Mongo connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error('Mongo connection error:', err));

  const Message = require('./models/Message');

io.on('connection', (socket) => {
  // ... other socket handlers ...

  socket.on('send-message', async (msg) => {
    try {
      const newMsg = new Message({
        text: msg.text,
        sender: msg.sender,  // client must send sender's userId
        room: msg.room || null,
      });
      await newMsg.save();

      io.emit('receive-message', {
        _id: newMsg._id,
        text: newMsg.text,
        sender: msg.sender,
        createdAt: newMsg.createdAt,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
});

io.on('connection', (socket) => {
  // ... existing handlers ...

  socket.on('private-message', async (msg) => {
    try {
      const newMsg = new Message({
        text: msg.text,
        sender: msg.sender,
        receiver: msg.receiver,
      });
      await newMsg.save();

      // Emit message only to sender and receiver
      for (const [socketId, user] of Object.entries(onlineUsers)) {
        if (user.userId === msg.sender || user.userId === msg.receiver) {
          io.to(socketId).emit('receive-private-message', newMsg);
        }
      }
    } catch (error) {
      console.error('Error saving private message:', error);
    }
  });
});

// Join a chat room
socket.on('join-room', (room) => {
  socket.join(room);
});

// Leave a chat room
socket.on('leave-room', (room) => {
  socket.leave(room);
});

// Send message to a room
socket.on('room-message', ({ room, content }) => {
  io.to(room).emit('room-message', {
    content,
    sender: socket.username,
    timestamp: new Date().toISOString(),
  });
});

socket.on('message-read', ({ messageId, room }) => {
  io.to(room).emit('message-read', { messageId, readerId: socket.userId });
});


// Save user info and track online users
socket.on('join', ({ userId, username }) => {
  socket.userId = userId;
  socket.username = username;
  onlineUsers[userId] = socket.id; // Map userId to socket.id for private messaging
  io.emit('online-users', Object.keys(onlineUsers));
});

// Private message event
socket.on('private-message', ({ content, toUserId }) => {
  const targetSocketId = onlineUsers[toUserId];
  if (targetSocketId) {
    io.to(targetSocketId).emit('private-message', {
      content,
      fromUserId: socket.userId,
      fromUsername: socket.username,
      timestamp: new Date().toISOString(),
    });
  }
});

// Cleanup on disconnect
socket.on('disconnect', () => {
  delete onlineUsers[socket.userId];
  io.emit('online-users', Object.keys(onlineUsers));
});


