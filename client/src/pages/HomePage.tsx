import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Zap, ArrowRight, Star, Clock, DollarSign, Shield, MessageCircle, Trophy, Sparkles, Globe, CheckCircle, Loader2 } from 'lucide-react';
import NavigationLayout from '../layouts/NavigationLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../helpers/axiosInstance';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentStats, setCurrentStats] = useState({ prompts: 2547, craftors: 1284, sales: 15723 });
  const [featuredPrompts, setFeaturedPrompts] = useState<any[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

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

  // Fetch real prompts from API
  useEffect(() => {
    const fetchFeaturedPrompts = async () => {
      try {
        setIsLoadingPrompts(true);
        const response = await axiosInstance.get('/prompt/explore?page=1&limit=6');
        const prompts = response.data?.data?.prompts || [];
        setFeaturedPrompts(prompts.slice(0, 6)); // Get top 6 prompts
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setIsLoadingPrompts(false);
      }
    };

    fetchFeaturedPrompts();
  }, []);

  const GridBackground = () => (
    <div className="absolute inset-0 opacity-20 dark:opacity-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
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
    <NavigationLayout>
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
                <button 
                  onClick={() => navigate('/explore')}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
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
              <h2 className="text-4xl font-bold mb-4">
                {featuredPrompts.length > 0 ? 'Featured Prompts' : 'Trending Prompts'}
              </h2>
              <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                {featuredPrompts.length > 0 
                  ? 'Discover premium AI prompts from top Craftors' 
                  : 'Be the first to create and share amazing AI prompts'}
              </p>
            </div>

            {isLoadingPrompts ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
              </div>
            ) : featuredPrompts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {featuredPrompts.map((prompt) => (
                  <div 
                    key={prompt._id} 
                    onClick={() => navigate(`/prompt/${prompt.slug}`)}
                    className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 hover:shadow-xl cursor-pointer"
                  >
                    {/* Prompt Image */}
                    {prompt.pictures && prompt.pictures.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden aspect-video">
                        <img 
                          src={prompt.pictures[0].secure_url} 
                          alt={prompt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg line-clamp-2">{prompt.title}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{prompt.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </div>

                    {/* Category & Model Tags */}
                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {prompt.category}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {prompt.model}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {prompt.description}
                    </p>

                    <div className="space-y-3">
                      {prompt.isBiddable ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Current Bid</span>
                            <span className="font-bold text-green-500">${prompt.currentBid || prompt.price}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                            <Clock className="w-4 h-4" />
                            <span>Live Auction</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Price</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">${prompt.price}</span>
                        </div>
                      )}

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/prompt/${prompt.slug}`);
                        }}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        {prompt.isBiddable ? 'View Auction' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mb-6">
                  <Sparkles className="w-16 h-16 mx-auto text-purple-600 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No Prompts Yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  Be the first to create amazing AI prompts and start earning! The marketplace is waiting for your creativity.
                </p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300"
                >
                  Create Your First Prompt
                </button>
              </div>
            )}

            {featuredPrompts.length > 0 && (
              <div className="text-center mt-12">
                <button 
                  onClick={() => navigate('/explore')}
                  className="group px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  View All Prompts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
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
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300"
              >
                Sign Up Now
              </button>
              <button 
                onClick={() => navigate('/explore')}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-800 transition-all duration-300"
              >
                Explore Prompts
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
    </NavigationLayout>
  );
};

export default HomePage;
