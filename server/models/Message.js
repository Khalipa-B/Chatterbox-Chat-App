const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null means public message
  room: { type: String, default: null },
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: String, // e.g., 'like', 'love', 'laugh', etc.
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
