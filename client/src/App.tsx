import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css'
import { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path='/profile' element={<Profile/>}></Route>
        <Route path='/google-auth-success' element={<GoogleAuthSuccess/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
