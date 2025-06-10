import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser, fetchCurrentUser } from '../features/user/userSlice';
import { type RootState, type AppDispatch } from '../store';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Cookies from "js-cookie";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isLoggedIn } = useSelector((state: RootState) => state.user);
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  // Handle Google OAuth success redirect
  useEffect(() => {
    if (location.pathname === '/google-auth-success') {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        Cookies.set("accessToken", token);
        navigate('/');
      }
    }
  }, [location, navigate]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(authenticateUser({ inputValue, password }));
    if(res?.payload?.statusCode === 200){
      navigate("/");
      setInputValue("");
      setPassword("");
    }

  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-white dark:bg-gray-900 rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sign in to your account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              onClick={handleGoogleLogin}
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </div>
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
                Facebook
              </div>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;