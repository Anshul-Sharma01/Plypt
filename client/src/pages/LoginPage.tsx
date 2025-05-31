import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser } from '../features/user/userSlice';
import { type RootState, type AppDispatch } from '../store';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authenticateUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-6 border border-purple-100"
        autoComplete="on"
      >
        <h2 className="text-4xl font-extrabold text-center text-purple-700 mb-2 tracking-tight">Sign In</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 rounded-lg shadow-lg transition text-lg disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        {error && <div className="text-red-500 text-center text-sm font-medium">{error}</div>}
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-purple-600 hover:underline font-semibold">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 