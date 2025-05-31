import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUserAccount } from '../features/user/userSlice';
import { type RootState, type AppDispatch } from '../store';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isLoggedIn } = useSelector((state: RootState) => state.user);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: '',
  });

  React.useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createUserAccount(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-6 border border-blue-100"
        autoComplete="on"
      >
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-2 tracking-tight">Sign Up</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">Short Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Short Bio"
            value={form.bio}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-bold py-2 rounded-lg shadow-lg transition text-lg disabled:opacity-60"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className="text-red-500 text-center text-sm font-medium">{error}</div>}
        <div className="text-center text-sm mt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default SignupPage; 