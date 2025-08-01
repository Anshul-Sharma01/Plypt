import React, { useState, useEffect } from 'react';
import { Calendar, Bookmark, Filter, Search, Eye, Star, User, Clock, X, MapPin, Building } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';
import { useDispatch } from 'react-redux';
import { fetchMyBookmarksThunk, toggleBookmarkThunk } from '../../features/prompts/favouritesSlice'; // You'll need to create this action
import type { AppDispatch } from '../../store';

const GridBackground = () => (
  <div className="fixed inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none z-0">
    <div
      className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
      style={{ backgroundSize: '40px 40px' }}
    ></div>
  </div>
);

const BookmarkedPrompts = () => {
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [promptsCount, setPromptsCount] = useState(0);
  const itemsPerPage = 10;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchBookmarkedPromptsData() {
      try {
        const res = await dispatch(getMyBookmarkedPromptsThunk({ page: currentPage, limit: itemsPerPage }));
        console.log("Res : ", res);
        if (currentPage === 1) {
          setBookmarkedPrompts(res?.payload?.data?.bookmarkedPrompts || []);
        } else {
          setBookmarkedPrompts(prevPrompts => [...prevPrompts, ...res?.payload?.data?.bookmarkedPrompts] || []);
        }
        setPromptsCount(res?.payload?.data?.count || 0);
      } catch (error) {
        console.error("Failed to fetch bookmarked prompts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookmarkedPromptsData();
  }, [dispatch, currentPage]);

  useEffect(() => {
    let filtered = bookmarkedPrompts.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prompt.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || prompt.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt));
    } else if (sortBy === 'rating-high') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating-low') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    }
    setFilteredPrompts(filtered);
  }, [searchTerm, categoryFilter, sortBy, bookmarkedPrompts]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'RUB': '₽'
    };
    return symbols[currency] || currency;
  };

  const handlePromptClick = (promptSlug) => {
    // Replace this with your desired redirect logic
    window.location.href = `/view/${promptSlug}`;

  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleRemoveBookmark = async (promptId) => {
    // Add your remove bookmark functionality here
    try {
      await dispatch(toggleBookmarkThunk({ promptId }));
      setBookmarkedPrompts(prev => prev.filter(prompt => prompt._id !== promptId));
      console.log('Prompt bookmark removed:', promptId);
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors relative">
        <GridBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors relative">
        <GridBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 dark:from-purple-400 dark:to-pink-400">
              Bookmarked Prompts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your saved AI prompts for quick access
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Creative Writing">Creative Writing</option>
                    <option value="Business">Business</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Art & Design">Art & Design</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">Recently Bookmarked</option>
                  <option value="oldest">Oldest Bookmarked</option>
                  <option value="rating-high">Highest Rated</option>
                  <option value="rating-low">Lowest Rated</option>
                  <option value="price-high">Highest Price</option>
                  <option value="price-low">Lowest Price</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPrompts?.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No bookmarked prompts found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || categoryFilter !== 'All'
                    ? 'Try adjusting your filters'
                    : 'Start exploring and bookmarking AI prompts to see them here'}
                </p>
              </div>
            ) : (
              filteredPrompts?.map((prompt) => (
                <div key={prompt._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={prompt.pictures[0]?.secure_url || '/api/placeholder/300/200'}
                        alt={prompt.title}
                        className="w-full lg:w-48 h-32 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handlePromptClick(prompt?.slug)}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 
                            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            onClick={() => handlePromptClick(prompt?.slug)}
                          >
                            {prompt.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {prompt.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                              {prompt.category}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                              {prompt.model}
                            </span>
                            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                              <Star className="w-3 h-3 fill-current" />
                              {prompt.rating}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              src={prompt?.craftor?.user?.avatar?.secure_url || '/api/placeholder/32/32'}
                              alt={prompt?.craftor?.user?.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              by {prompt?.craftor?.user?.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            ₹{prompt.price}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button 
                          onClick={() => handlePromptClick(prompt?.slug)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Prompt
                        </button>
                        <button
                          onClick={() => handleRemoveBookmark(prompt._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-sm rounded-lg transition-colors"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                          Remove Bookmark
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredPrompts.length < promptsCount && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More Prompts'}
              </button>
            </div>
          )}
        </div>
      </div>
    </NavigationLayout>
  );
};

export default BookmarkedPrompts;