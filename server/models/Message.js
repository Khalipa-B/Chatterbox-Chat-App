const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null means public message
  createdAt: { type: Date, default: Date.now },
  room: { type: String, default: null },
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: String, // e.g., 'like', 'love', 'laugh', etc.
    },
  ],
});
});


module.exports = mongoose.model('Message', messageSchema);
