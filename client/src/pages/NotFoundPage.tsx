import { Home, Search, Zap, Users, TrendingUp } from 'lucide-react';
import NavigationLayout from '../layouts/NavigationLayout';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {

  const navigate = useNavigate();

  return (
    <NavigationLayout>
      <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-black">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0">
            {/* Animated dots */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse opacity-40 delay-300"></div>
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400 dark:bg-pink-500 rounded-full animate-pulse opacity-50 delay-700"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-300 dark:bg-purple-400 rounded-full animate-pulse opacity-30 delay-1000"></div>
            <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-300 dark:bg-blue-400 rounded-full animate-pulse opacity-40 delay-500"></div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 dark:from-purple-900/20 dark:to-blue-900/20"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* 404 Content */}
          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* 404 Number */}
              <div className="relative mb-8">
                <h1 className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">
                  404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Lost in Space
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  The Future of
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ml-2">
                    AI Prompts
                  </span>
                  <br />
                  Couldn't Find This Page
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  It seems like you've ventured into uncharted territory. The page you're looking for 
                  doesn't exist in our prompt marketplace. Let's get you back to discovering amazing AI prompts!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button onClick={() => navigate("/")} className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                  <Home size={20} />
                  <span>Back to Home</span>
                </button>
                
                <button onClick={() => navigate("/explore")} className="flex items-center space-x-2 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-full font-semibold hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 cursor-pointer">
                  <Search size={20} />
                  <span>Explore Prompts</span>
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">2,547</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Live Prompts</div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">1,284</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Craftors</div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">15,723</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
                </div>
              </div>

              {/* Additional Help Section */}
              <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Need Help Finding Something?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try searching for AI prompts, or browse our popular categories
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                    Creative Writing
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    Code Generation
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    Business Tools
                  </span>
                  <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm">
                    Art & Design
                  </span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </NavigationLayout>
  );
};

export default NotFoundPage;
