import { useEffect, useState } from 'react';
import { socket } from '../socket'; // adjust this import as needed
import TypingIndicator from './TypingIndicator';
import OnlineUsers from './OnlineUsers'; // optional, you can inline online users UI

export default function ChatRoom() {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [privateRecipient, setPrivateRecipient] = useState(null);
  const [privateMsg, setPrivateMsg] = useState([]);

  // Get current user from localStorage (adjust based on your auth)
  const user = JSON.parse(localStorage.getItem('user'));

  // Join the main chat room on mount
  useEffect(() => {
    socket.emit('join-room', 'room1');
    socket.emit('join', { userId: user.id, username: user.username });

    // Listen for room messages
    socket.on('room-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    // Listen for private messages
    socket.on('private-message', (msg) => {
      setChat((prev) => [...prev, { ...msg, private: true }]);
    });

    // Listen for typing events
    socket.on('typing', ({ username }) => {
      setTypingUser(username);
      setTimeout(() => setTypingUser(''), 1500);
    });

    // Listen for online users list
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('room-message');
      socket.off('private-message');
      socket.off('typing');
      socket.off('online-users');
      socket.disconnect();
    };
  }, [user.id, user.username]);

  // Send message handler (room or private)
  const sendMsg = (e) => {
    e.preventDefault();
    if (privateRecipient && privateMsg.trim()) {
      // Send private message
      socket.emit('private-message', {
        content: privateMsg,
        toUserId: privateRecipient.userId,
        sender: user.username,
        timestamp: new Date().toISOString(),
      });
      setPrivateMsg('');
      setPrivateRecipient(null);
    } else if (!privateRecipient && msg.trim()) {
      // Send room message
      socket.emit('room-message', {
        room: 'room1',
        content: msg,
        sender: user.username,
        timestamp: new Date().toISOString(),
      });
      setMsg('');
    }
  };

  // Handle typing indicator for room
  const handleTyping = () => {
    socket.emit('typing', { room: 'room1', username: user.username, isTyping: true });
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar: Online users */}
      <div className="w-48 border-r p-4 bg-white">
        <h3 className="font-bold mb-2">Online Users</h3>
        {onlineUsers.filter(u => u.username !== user.username).length === 0 && (
          <p className="text-sm text-gray-500">No other users online</p>
        )}
        <ul>
          {onlineUsers
            .filter(u => u.username !== user.username)
            .map((u) => (
              <li key={u.userId} className="flex justify-between items-center mb-1">
                <span>{u.username}</span>
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => setPrivateRecipient(u)}
                >
                  Message
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex-1 overflow-y-auto p-4">
          {chat.map((c, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded ${c.private ? 'bg-yellow-100' : 'bg-white'}`}
            >
              <strong>{c.sender}</strong>{' '}
              <span className="text-sm text-gray-500">
                ({new Date(c.timestamp).toLocaleTimeString()})
                {c.private && ' [private]'}
              </span>
              <p>{c.content || c.text}</p>
            </div>
          ))}
          <TypingIndicator username={typingUser} />
        </div>

        {/* Message input form */}
        <form onSubmit={sendMsg} className="p-4 flex flex-col gap-2 bg-white border-t">
          {privateRecipient ? (
            <>
              <p>
                Private message to <strong>{privateRecipient.username}</strong>{' '}
                <button
                  type="button"
                  onClick={() => setPrivateRecipient(null)}
                  className="text-red-500 ml-2"
                >
                  Cancel
                </button>
              </p>
              <input
                className="p-2 border rounded"
                value={privateMsg}
                onChange={(e) => setPrivateMsg(e.target.value)}
                placeholder="Type your private message..."
              />
              <button type="submit" className="bg-green-500 text-white px-4 rounded">
                Send Private Message
              </button>
            </>
          ) : (
            <>
              <input
                className="flex-1 border p-2 rounded"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyPress={handleTyping}
                placeholder="Type your message here..."
              />
              <button className="bg-blue-500 text-white px-4 rounded">Send</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
