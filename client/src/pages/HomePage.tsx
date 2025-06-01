import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Zap, ArrowRight, Star, Clock, DollarSign, Shield, MessageCircle, Trophy, Sparkles, Globe, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const [currentStats, setCurrentStats] = useState({ prompts: 2547, craftors: 1284, sales: 15723 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStats(prev => ({
        prompts: prev.prompts + Math.floor(Math.random() * 3),
        craftors: prev.craftors + Math.floor(Math.random() * 2),
        sales: prev.sales + Math.floor(Math.random() * 5)
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const GridBackground = () => (
    <div className="absolute inset-0 opacity-20 dark:opacity-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(0_0_0)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_rgb(255_255_255)_1px,_transparent_0)]"
           style={{ backgroundSize: '40px 40px' }}>
      </div>
    </div>
  );

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gray-900 dark:bg-white opacity-30 animate-pulse"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 12}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + i * 0.3}s`
          }}
        />
      ))}
    </div>
  );

  const featuredPrompts = [
    { title: "AI Art Generator Prompts", price: "$25", bids: 12, timeLeft: "2h 15m", rating: 4.8 },
    { title: "ChatGPT Business Templates", price: "$18", bids: 8, timeLeft: "4h 30m", rating: 4.9 },
    { title: "Midjourney Style Pack", price: "$35", bids: 15, timeLeft: "1h 45m", rating: 4.7 },
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Digital Artist", content: "Plypt changed how I monetize my AI prompts. The bidding system is addictive!", avatar: "SC" },
    { name: "Mike Rodriguez", role: "Content Creator", content: "Found incredible prompts here that 10x'd my productivity. Worth every penny.", avatar: "MR" },
    { name: "Emma Thompson", role: "Marketing Agency", content: "Our team uses Plypt daily. The quality of prompts is consistently excellent.", avatar: "ET" },
  ];

  const howItWorks = [
    { step: "1", title: "Browse & Discover", description: "Explore thousands of AI prompts across categories" },
    { step: "2", title: "Bid & Win", description: "Participate in real-time auctions to win your favorites" },
    { step: "3", title: "Purchase & Download", description: "Secure payment and instant access to your prompts" },
    { step: "4", title: "Create & Sell", description: "Become a Craftor and monetize your own AI prompts" },
  ];

  return (
    <div className="min-h-screen transition-all duration-500 bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <GridBackground />
        <FloatingElements />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">The Future of</span>
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  AI Prompts
                </span>
                <span className="block">Is Here</span>
              </h1>
              <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300">
                Discover, bid, and buy premium AI prompts from expert Craftors.
                Join the world's first real-time AI prompt marketplace powered by live auctions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3">
                Start Exploring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
                Become a Craftor
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-12">
              {[
                { label: 'Live Prompts', value: currentStats.prompts.toLocaleString(), icon: Zap },
                { label: 'Active Craftors', value: currentStats.craftors.toLocaleString(), icon: Users },
                { label: 'Total Sales', value: `${currentStats.sales.toLocaleString()}`, icon: TrendingUp }
              ].map(({ label, value, icon: Icon }, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <div className="text-2xl font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-black dark:border-white rounded-full flex justify-center">
            <div className="w-1 h-3 rounded-full mt-2 animate-bounce bg-black dark:bg-white" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Plypt?</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Experience the next generation of AI prompt trading with cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Real-Time Bidding',
                description: 'Participate in live auctions with Socket.io powered real-time updates'
              },
              {
                icon: DollarSign,
                title: 'Secure Payments',
                description: 'Protected transactions through Razorpay integration with instant transfers'
              },
              {
                icon: Users,
                title: 'Expert Craftors',
                description: 'Connect with verified AI prompt creators and chat in real-time'
              }
            ].map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="p-8 rounded-2xl transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 hover:shadow-xl">
                <div className="mb-6">
                  <Icon className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Prompts */}
      <section className="py-20 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Auctions</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Live bidding on premium AI prompts from top Craftors
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt, i) => (
              <div key={i} className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{prompt.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{prompt.rating}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Current Bid</span>
                    <span className="font-bold text-green-500">{prompt.price}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Bids</span>
                    <span className="font-semibold">{prompt.bids}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Time Left</span>
                    <span className="font-semibold text-red-500">{prompt.timeLeft}</span>
                  </div>

                  <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Place Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-100 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Plypt Works</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Simple steps to start buying and selling AI prompts
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Join thousands of satisfied creators and buyers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-20 bg-gray-100 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built on Trust & Security</h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Your transactions and data are protected with enterprise-grade security
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Secure Payments', description: 'Bank-level encryption for all transactions' },
              { icon: MessageCircle, title: 'Real-time Chat', description: 'Direct communication with Craftors via Redis' },
              { icon: CheckCircle, title: 'Verified Craftors', description: 'All sellers go through our verification process' },
              { icon: Globe, title: 'Global Marketplace', description: '24/7 trading from anywhere in the world' }
            ].map(({ icon: Icon, title, description }, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                <Icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-800 text-white dark:bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators and buyers in the world's most dynamic AI prompt marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300">
              Sign Up Now
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
