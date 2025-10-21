import { useState, useEffect } from 'react';
import { Search, Filter, Star, Eye, ArrowRight, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { getMyPromptsThunk, deletePromptThunk } from '../../features/prompts/promptSlice';
import { Link } from 'react-router-dom';

const ExplorePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    myPrompts: backendPrompts,
    loading,
  } = useSelector((state: any) => state.prompt);

  const craftorData = useSelector((state : any) => state?.craftor);


  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [displayedPrompts, setDisplayedPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const categories = ['All', 'Coding', 'Writing', 'Design', 'Marketing', 'Business', 'Other'];
  const models = ['All', 'GPT-3.5', 'GPT-4', 'DALL-E', 'Claude', 'Custom', 'Other'];

  // Fetch all prompts from backend once
  useEffect(() => {
    dispatch(getMyPromptsThunk({ craftorId : craftorData?.craftorData?._id, page: 1, limit: 1000 }));
  }, [dispatch]);

  // Store backend prompts in local state
  useEffect(() => {
    if (backendPrompts && Array.isArray(backendPrompts)) {
      setAllPrompts(backendPrompts);
    }
  }, [backendPrompts]);
  

  // Apply search, filter, sort
  useEffect(() => {
    let filtered = [...allPrompts];
    if (searchTerm.trim()) {
      filtered = filtered.filter(prompt =>
        (prompt.title && prompt.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prompt.description && prompt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (Array.isArray(prompt.tags) && prompt.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (prompt.craftor && prompt.craftor.name && prompt.craftor.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }
    if (selectedModel !== 'All') {
      filtered = filtered.filter(prompt => prompt.model === selectedModel);
    }
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }
    setFilteredPrompts(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedModel, sortBy, allPrompts]);

  // Paginate filtered prompts
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedPrompts(filteredPrompts.slice(startIndex, endIndex));
  }, [filteredPrompts, currentPage]);

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);

  const handleDeletePrompt = async (promptId: string, promptTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${promptTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await dispatch(deletePromptThunk(promptId));
      // Remove the deleted prompt from local state
      setAllPrompts(prev => prev.filter(prompt => prompt._id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const FloatingOrbs = () => (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
    </div>
  );

  const GridBackground = () => (
    <div className="fixed inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none z-0">
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
    </div>
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Coding': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Writing': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Design': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Marketing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Business': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category] || colors['Other'];
  };

  const getModelColor = (model: string) => {
    const colors: { [key: string]: string } = {
      'GPT-4': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'GPT-3.5': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'DALL-E': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Claude': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Custom': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[model] || colors['Other'];
  };

  interface Prompt {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    model: string;
    tags: string[];
    pictures: { secure_url: string }[];
    rating: number;
    aiReview : {
      review : string,
      rating : number
    }
    slug? : string,
    craftor: { name: string; avatar: string };
    isBiddable: boolean;
    currentBid: number;
    createdAt: string;
  }

  const PromptCard = ({ prompt }: { prompt: Prompt }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700">
      <div className="relative h-12 flex items-center justify-between px-6 pt-6">
        <div>
          {prompt.isBiddable && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              Live Auction
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDeletePrompt(prompt._id, prompt.title)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            title="Delete prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-6 pt-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(prompt.category)}`}>
            {prompt.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModelColor(prompt.model)}`}>
            {prompt.model}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {prompt.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {prompt.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {prompt.tags.slice(0, 3).map((tag: string, index: number) => (
            <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-gray-500 dark:text-gray-400 text-xs px-2 py-1">
              +{prompt.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{prompt?.aiReview?.rating || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {prompt.isBiddable ? (
              <>
                <span className="text-sm text-gray-500 dark:text-gray-400">Current Bid</span>
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">${prompt.currentBid}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${prompt.price}</span>
            )}
          </div>
          <Link to={`/view/${prompt?.slug}`} className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 group">
            <Eye className="w-4 h-4" />
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="flex items-center justify-center gap-4 mt-12">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index: number) => {
          const page = index + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors relative">
        <GridBackground />
        <div className="relative z-10">
          <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <FloatingOrbs />
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  My <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Prompts</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your personal collection of AI prompts – crafted, saved, and ready for your next big idea
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    {models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-600 dark:text-gray-300">
                Showing <span className="font-medium text-gray-900 dark:text-white">{displayedPrompts?.length}</span> of{' '}
                <span className="font-medium text-gray-900 dark:text-white">{filteredPrompts.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6 space-y-4">
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedPrompts?.map((prompt: any) => (
                    <PromptCard key={prompt._id} prompt={prompt} />
                  ))}
                </div>

                <Pagination />
              </>
            )}

            {!loading && displayedPrompts?.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No prompts found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
};

export default ExplorePage;
