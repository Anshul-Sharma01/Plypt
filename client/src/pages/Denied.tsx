import React from 'react';
import { useNavigate } from 'react-router-dom';

const Denied = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 relative overflow-hidden">
        {/* Animated Background Blobs */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Lock Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white mb-4">
                        Access <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Denied</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                        You don't have permission to access this mystical realm of AI creativity.
                    </p>

                    {/* Description Box */}
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                        The gates to this digital sanctuary remain sealed. Your current permissions don't allow access to this exclusive craftor domain.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                        Contact your administrator or upgrade your access to unlock the secrets of AI prompt mastery.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button onClick={() => navigate("/")} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-400 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                        Return Home
                        </button>
                    </div>

                    {/* Error Code */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        Error Code: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ACCESS_FORBIDDEN_403</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full opacity-20 animate-pulse"
                        style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Denied;
