import { useEffect, useState } from 'react';
import { socket } from '../socket';
import TypingIndicator from './TypingIndicator';
import OnlineUsers from './OnlineUsers';

export default function ChatRoom() {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState('');
  const [online, setOnline] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    socket.emit('join', { userId: user.id, username: user.username });

    socket.on('receive-message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on('typing', ({ username }) => {
      setTypingUser(username);
      setTimeout(() => setTypingUser(''), 1500);
    });

    socket.on('online-users', (users) => {
      setOnline(users);
    });

    return () => socket.disconnect();
  }, []);

  const sendMsg = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    socket.emit('send-message', { text: msg, sender: user.username });
    setMsg('');
  };

  const handleTyping = () => {
    socket.emit('typing', { username: user.username });
  };

  return (
    <div className="h-screen flex">
      <OnlineUsers users={online} />
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex-1 overflow-y-auto p-4">
          {chat.map((c, i) => (
            <div key={i} className="mb-2">
              <strong>{c.sender}</strong> <span className="text-sm text-gray-500">({new Date(c.timestamp).toLocaleTimeString()})</span>
              <p>{c.text}</p>
            </div>
          ))}
          <TypingIndicator username={typingUser} />
        </div>
        <form onSubmit={sendMsg} className="p-4 flex gap-2 bg-white border-t">
          <input className="flex-1 border p-2 rounded" value={msg} onChange={(e) => setMsg(e.target.value)} onKeyPress={handleTyping} />
          <button className="bg-blue-500 text-white px-4 rounded">Send</button>
        </form>
      </div>
    </div>
  );
}
