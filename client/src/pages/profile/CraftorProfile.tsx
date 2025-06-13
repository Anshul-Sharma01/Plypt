import React from 'react';
import { Shield, User, Calendar, Mail, CreditCard, Tag, List, DollarSign, Star, Eye, Zap, Crown, Moon } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';

export interface Picture {
  public_id: string;
  secure_url: string;
}

export interface Prompt {
  _id: string;
  title: string;
  description: string;
  price: number;
  pictures: Picture[];
  rating: number;
}

export interface CraftorData {
  user: {
    name: string;
    username: string;
    avatar: {
      public_id: string;
      secure_url: string;
    };
    bio: string;
    role: 'user' | 'admin';
    email: string;
    createdAt: string;
  };
  slug: string;
  totalPromptsSold: number;
  prompts: Prompt[];
  paymentDetails: {
    razorpayId: string;
    bankAccount: string;
    upiId: string;
  };
  tier: 'Basic' | 'Pro' | 'Elite';
}

const CraftorProfile: React.FC = () => {
  // Mock data for demonstration
  const craftorData: CraftorData = {
    user: {
      name: "Shadow Artisan",
      username: "shadowcraft",
      avatar: {
        public_id: "avatar123",
        secure_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      bio: "Master of digital mysteries, weaving prompts that unlock the secrets of AI creativity. Each creation is a gateway to unexplored realms of possibility.",
      role: "user",
      email: "shadow@craftorealm.com",
      createdAt: "2023-01-15T10:30:00Z"
    },
    slug: "shadow-artisan",
    totalPromptsSold: 247,
    prompts: [
      {
        _id: "1",
        title: "Ethereal Visions",
        description: "Unlock the mysteries of dreamlike imagery with this otherworldly prompt collection.",
        price: 29.99,
        pictures: [{
          public_id: "prompt1",
          secure_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop"
        }],
        rating: 4.9
      },
      {
        _id: "2",
        title: "Dark Renaissance",
        description: "Channel the shadows of classical art into modern AI creations.",
        price: 39.99,
        pictures: [{
          public_id: "prompt2",
          secure_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
        }],
        rating: 4.8
      },
      {
        _id: "3",
        title: "Cosmic Enigma",
        description: "Explore the infinite mysteries of space and time through AI artistry.",
        price: 49.99,
        pictures: [{
          public_id: "prompt3",
          secure_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop"
        }],
        rating: 5.0
      }
    ],
    paymentDetails: {
      razorpayId: "rzp_live_••••••••",
      bankAccount: "••••••••3847",
      upiId: "shadow@paytm"
    },
    tier: "Elite"
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
    </div>
  );

  const MysticalBorder = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-pink-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );

  const GridBackground = () => (
    <div className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none">
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
    </div>
  );

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'Elite': return <Crown className="w-5 h-5" />;
      case 'Pro': return <Zap className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getTierGradient = (tier: string) => {
    switch(tier) {
      case 'Elite': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'Pro': return 'from-purple-400 via-blue-500 to-cyan-500';
      default: return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-gray-800 dark:text-white relative overflow-hidden">
        <FloatingOrbs />
        <GridBackground/>
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(120,119,198,0.1),_transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,_rgba(120,119,198,0.3),_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(120,119,198,0.05)_60deg,_transparent_120deg)] dark:bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(120,119,198,0.1)_60deg,_transparent_120deg)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-gray-200/50 dark:border-gray-700/50">
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Craftor Profile</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
              The Mysterious Realm
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Enter the domain of a master prompt craftor, where creativity meets mystery
            </p>
          </div>

          {/* Main Profile Section */}
          <MysticalBorder className="mb-12">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar with mystical effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full p-1 animate-spin-slow">
                    <div className="w-48 h-48 bg-white dark:bg-gray-900 rounded-full"></div>
                  </div>
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-800">
                    <img
                      src={craftorData?.user?.avatar?.secure_url}
                      alt="Craftor Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTierGradient(craftorData?.tier)} text-white font-bold text-sm shadow-lg`}>
                      {getTierIcon(craftorData?.tier)}
                      {craftorData?.tier}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {craftorData?.user?.name}
                  </h2>
                  <p className="text-purple-600 dark:text-purple-400 text-xl mb-4">@{craftorData?.user?.username}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
                    {craftorData?.user?.bio}
                  </p>
                  
                  <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 text-white">
                    <Shield className="w-5 h-5" />
                    <span>Account Nexus</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </MysticalBorder>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <MysticalBorder>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Inception Date</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDate(craftorData?.user?.createdAt)}</p>
              </div>
            </MysticalBorder>

            <MysticalBorder>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Contact Portal</h3>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white break-all">{craftorData?.user?.email}</p>
              </div>
            </MysticalBorder>

            <MysticalBorder>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">Souls Touched</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{craftorData?.totalPromptsSold}</p>
              </div>
            </MysticalBorder>
          </div>

          {/* Prompts Gallery */}
          <MysticalBorder className="mb-12">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <Moon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Mystical Creations
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {craftorData?.prompts?.map((prompt) => (
                  <div key={prompt._id} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-500/50 dark:hover:border-purple-400/50 transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img
                          src={prompt?.pictures[0]?.secure_url}
                          alt={prompt?.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent dark:from-gray-900/80"></div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                          <span className="text-gray-900 dark:text-white text-sm font-medium">{prompt?.rating}</span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {prompt?.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{prompt?.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                            ${prompt?.price}
                          </span>
                          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
                            Acquire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </MysticalBorder>

          {/* Payment Vault */}

        </div>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </NavigationLayout>
  );
};

export default CraftorProfile;