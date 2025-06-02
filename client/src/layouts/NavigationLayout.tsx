
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import Footer from './Footer';

const NavigationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full relative dark:text-white">
      <nav className={`fixed w-full z-50 ${scrolled ? 'bg-white/60 dark:bg-black/60 backdrop-blur-md' : 'bg-white dark:bg-black'} shadow-sm transition-all duration-75`}>
        <div className="p-4 flex items-center justify-between gap-10">
          <Link to="/" className={`text-2xl font-bold tracking-tight transform transition-transform duration-1000 ease-in-out`}>
            Plypt
          </Link>
          <ul className="flex gap-4 ml-auto justify-center items-center">
            <li className="relative cursor-pointer dark:text-white">
              <Link to="/explore">Explore</Link>
            </li>
            <li className="relative cursor-pointer dark:text-white">
              <Link to="/login">Login</Link>
            </li>
            <li className="relative cursor-pointer dark:text-white">
              <Link to="/signup">Sign In</Link>
            </li>
            <li>
              <ThemeToggle/>
            </li>
          </ul>
        </div>
      </nav>
      <main className="w-full h-full pt-16">{children}</main>
      <Footer/>
    </div>
  );
};




export default NavigationLayout;
