import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Setting Up Your Craftor Profile</h2>
        <div className="space-y-4 mb-6">
          <p className="text-gray-700 dark:text-gray-300">Preparing environment...</p>
          <p className="text-gray-700 dark:text-gray-300">Activating Craftor profile...</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
