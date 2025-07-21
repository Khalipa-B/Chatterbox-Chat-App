import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/chat');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="mb-2 w-full border p-2" placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="mb-2 w-full border p-2" type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        <p className="text-sm mt-2 text-center">No account? <a href="/register" className="text-blue-500">Register</a></p>
      </form>
    </div>
  );
}
