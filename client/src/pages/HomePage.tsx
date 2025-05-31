import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center animate-fade-in">
      <header className="w-full max-w-4xl mx-auto text-center py-20">
        <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-6 drop-shadow-lg animate-gradient-x">
          Plypt
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700 mb-10 font-medium">
          The AI Prompt Marketplace with <span className="text-purple-600 font-bold">Real-Time Auctions</span> &amp; <span className="text-blue-600 font-bold">Secure Purchases</span>
        </p>
        <a
          href="/signup"
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold px-10 py-4 rounded-full shadow-xl transition text-xl tracking-wide animate-bounce-slow"
        >
          Get Started
        </a>
      </header>
      <section className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10 mt-10 flex flex-col gap-6 border border-purple-100">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">Why Plypt?</h2>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
          <li>Live auctions for premium AI prompts</li>
          <li>Secure payments with Razorpay</li>
          <li>Real-time chat between buyers and Craftors</li>
          <li>Craftor profiles, reviews, and more</li>
        </ul>
      </section>
      <style>{`
        .animate-fade-in { animation: fadeIn 1.2s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease-in-out infinite; }
        @keyframes gradient-x { 0%, 100% { background-position: left; } 50% { background-position: right; } }
        .animate-bounce-slow { animation: bounce 2.5s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default HomePage; 