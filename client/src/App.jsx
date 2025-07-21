import { useEffect } from 'react';
import { socket } from './socket';

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('🟢 Connected:', socket.id);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-gray-100">
      <h1 className="text-2xl font-bold">Chatterbox: Real-Time Chat App 🚀</h1>
    </div>
  );
}

export default App;
