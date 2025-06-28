import React, { useState } from 'react';
import { Heart, Search, Filter, Grid, List, Star, Code, Palette, PenTool, Zap, Users, TrendingUp, MoreHorizontal } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';

const Favourites = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const favoritePrompts = [
    {
      id: 1,
      title: "Advanced ChatGPT Prompt for Content Creation",
      description: "Create engaging blog posts, social media content, and marketing copy with this powerful prompt...",
      category: "Writing",
      model: "GPT-4",
      rating: 4.9,
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      tags: ["content", "marketing", "blog"],
      isLiveAuction: false,
      craftorName: "Sarah Johnson",
      sales: 234
    },
    {
      id: 2,
      title: "DALL-E 3 Art Generation Masterclass",
      description: "Generate stunning artwork and visual content with these expert DALL-E prompts.",
      category: "Design",
      model: "DALL-E",
      rating: 4.8,
      price: "$8.99",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop",
      tags: ["art", "design", "creative"],
      isLiveAuction: true,
      craftorName: "Alex Chen",
      sales: 156
    },
    {
      id: 3,
      title: "Python Code Generator Pro",
      description: "Generate clean, efficient Python code for various programming tasks and projects.",
      category: "Coding",
      model: "Claude",
      rating: 4.7,
      price: "$15.99",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      tags: ["python", "programming", "automation"],
      isLiveAuction: false,
      craftorName: "Mike Rodriguez",
      sales: 89
    },
    {
      id: 4,
      title: "Social Media Content Wizard",
      description: "Create viral social media posts, captions, and engagement strategies.",
      category: "Marketing",
      model: "GPT-4",
      rating: 4.9,
      price: "$9.99",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
      tags: ["social", "viral", "engagement"],
      isLiveAuction: true,
      craftorName: "Emma Wilson",
      sales: 312
    },
    {
      id: 5,
      title: "Creative Writing Assistant",
      description: "Unleash your creativity with prompts for stories, poems, and creative narratives.",
      category: "Writing",
      model: "Claude",
      rating: 4.6,
      price: "$11.99",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
      tags: ["creative", "stories", "narrative"],
      isLiveAuction: false,
      craftorName: "David Kim",
      sales: 178
    },
    {
      id: 6,
      title: "Business Strategy Analyzer",
      description: "Develop comprehensive business strategies and market analysis reports.",
      category: "Business",
      model: "GPT-4",
      rating: 4.8,
      price: "$18.99",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      tags: ["business", "strategy", "analysis"],
      isLiveAuction: false,
      craftorName: "Lisa Parker",
      sales: 67
    }
  ];

  const categories = ['All', 'Writing', 'Design', 'Coding', 'Marketing', 'Business'];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Writing': return <PenTool className="w-4 h-4" />;
      case 'Design': return <Palette className="w-4 h-4" />;
      case 'Coding': return <Code className="w-4 h-4" />;
      case 'Marketing': return <TrendingUp className="w-4 h-4" />;
      case 'Business': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getModelColor = (model) => {
    switch (model) {
      case 'GPT-4': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'DALL-E': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Claude': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredPrompts = favoritePrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <NavigationLayout>
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <Heart className="w-8 h-8 text-purple-500 fill-current" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    My Favorites
                    </h1>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{filteredPrompts.length} prompts</span>
                    <span>•</span>
                    <span>Premium Collection</span>
                </div>
                </div>
                <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    >
                    <Grid className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list'
                        ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    >
                    <List className="w-4 h-4" />
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
                <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search your favorite prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
                />
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                </button>
                ))}
            </div>
            </div>

            {/* Content */}
            {filteredPrompts.length === 0 ? (
            <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No favorites found</h3>
                <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or category filters</p>
            </div>
            ) : (
            <div className={`grid gap-6 ${
                viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
                {filteredPrompts.map((prompt) => (
                <div key={prompt.id} className={`group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}>
                    {prompt.isLiveAuction && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        <Zap className="w-3 h-3 inline mr-1" />
                        Live Auction
                    </div>
                    )}
                    
                    <div className={`${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                    <div className="relative h-48 overflow-hidden">
                        <img
                        src={prompt.image}
                        alt={prompt.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-colors duration-200">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </button>
                    </div>
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getModelColor(prompt.model)}`}>
                            {prompt.model}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {prompt.category}
                        </span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                        <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                        {prompt.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {prompt.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                        {prompt.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                            #{tag}
                        </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {prompt.rating}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {prompt.sales} sales
                        </div>
                        </div>
                        <div className="text-right">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {prompt.price}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            by {prompt.craftorName}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    </NavigationLayout>
  );
};

export default Favourites;