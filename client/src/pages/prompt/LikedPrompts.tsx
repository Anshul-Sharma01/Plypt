import { useState, useEffect } from 'react';
import { Heart, Filter, Search, Eye, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { getMyLikedPromptsThunk, toggleLikeThunk } from '../../features/prompts/likeSlice';
import type { AppDispatch } from '../../store';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import { getAuctionStatus } from '../../utils/auctionUtils';

interface LikedPrompt {
  _id: string;
  title: string;
  description: string;
  category: string;
  model: string;
  rating: number;
  price: number;
  pictures: { secure_url: string }[];
  craftor: {
    user: {
      name: string;
      avatar: { secure_url: string };
    };
  };
  slug: string;
  likedAt: string;
  isBiddable: boolean;
}

const LikedPrompts = () => {
  const [likedPrompts, setLikedPrompts] = useState<LikedPrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<LikedPrompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [promptsCount, setPromptsCount] = useState(0);
  const itemsPerPage = 10;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchLikedPromptsData() {
      try {
        const res = await dispatch(getMyLikedPromptsThunk({ page: currentPage, limit: itemsPerPage }));
        if (currentPage === 1) {
          setLikedPrompts(res?.payload?.data?.likedPrompts || []);
        } else {
          setLikedPrompts(prevPrompts => [...prevPrompts, ...res?.payload?.data?.likedPrompts] || []);
        }
        setPromptsCount(res?.payload?.data?.count || 0);
      } catch (error) {
        console.error("Failed to fetch liked prompts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLikedPromptsData();
  }, [dispatch, currentPage]);

  useEffect(() => {
    let filtered = likedPrompts.filter(prompt => {
      const matchesSearch = prompt?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            prompt?.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || prompt.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.likedAt) - new Date(b.likedAt));
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
  }, [searchTerm, categoryFilter, sortBy, likedPrompts]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePromptClick = (promptSlug) => {
    window.location.href = `/view/${promptSlug}`;
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handleUnlike = async (promptId) => {
    try {
      await dispatch(toggleLikeThunk({ promptId }));
      setLikedPrompts(prev => prev.filter(prompt => prompt?._id !== promptId));
    } catch (error) {
      console.error('Failed to unlike prompt:', error);
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 dark:from-purple-400 dark:to-pink-400">
          Liked Prompts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your collection of favorite AI prompts
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
              <option value="newest">Recently Liked</option>
              <option value="oldest">Oldest Liked</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No liked prompts found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm || categoryFilter !== 'All'
                ? 'Try adjusting your filters'
                : 'Start exploring and liking AI prompts to see them here'}
            </p>
          </div>
        ) : (
          filteredPrompts.map((prompt) => (
            <div key={prompt._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={prompt.pictures[0]?.secure_url}
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
                        {prompt.isBiddable && (() => {
                          const auctionStatus = getAuctionStatus(prompt._id, prompt.isBiddable);
                          return auctionStatus.displayText ? (
                            <span className={auctionStatus.statusClass}>
                              {auctionStatus.displayText}
                            </span>
                          ) : null;
                        })()}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <ImageWithFallback
                          src={prompt?.craftor?.user?.avatar?.secure_url}
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
                      onClick={() => handleUnlike(prompt._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm rounded-lg transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      Unlike
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
  );
};

export default LikedPrompts;
