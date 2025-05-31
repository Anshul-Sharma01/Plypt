import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css'
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-white shadow">
        <Link to="/" className="text-2xl font-bold text-purple-700">Plypt</Link>
        <div className="flex gap-4">
          <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
          <Link to="/signup" className="text-purple-600 hover:underline">Sign Up</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
