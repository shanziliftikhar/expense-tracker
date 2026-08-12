import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || err.message || 'Signup failed');
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500"
        >
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;