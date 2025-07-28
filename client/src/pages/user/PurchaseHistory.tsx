import React, { useState, useEffect } from 'react';
import { Calendar, Package, Filter, Search, Download, Eye, Star, User, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, FileText, X, Mail, Phone, MapPin, Building } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';

const GridBackground = () => (
    <div className="fixed inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none z-0">
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
    </div>
  );

// Receipt Modal Component
const ReceiptModal = ({ isOpen, onClose, purchase }) => {
  if (!isOpen || !purchase) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download would be implemented here with jsPDF or similar library');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Initiated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Receipt</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div id="receipt-content" className="space-y-6">
            <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 dark:from-purple-400 dark:to-pink-400">
                The Mysterious Realm
              </h1>
              <p className="text-gray-600 dark:text-gray-400">AI Prompt Marketplace</p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Mail className="w-4 h-4" />
                  support@mysteriousrealm.com
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Receipt Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Receipt #:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{purchase.razorpayOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{purchase.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{purchase.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product Details</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex gap-4">
                  <img
                    src={purchase.prompt.pictures[0]?.secure_url || '/api/placeholder/80/80'}
                    alt={purchase.prompt.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {purchase.prompt.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {purchase.prompt.description}
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                        {purchase.prompt.category}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                        {purchase.prompt.model}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">
                    {getCurrencySymbol(purchase.currency)}{purchase.amount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee:</span>
                  <span className="text-gray-900 dark:text-white">
                    {getCurrencySymbol(purchase.currency)}0
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white text-lg">
                      {getCurrencySymbol(purchase.currency)}{purchase.amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">Thank you for your purchase!</p>
              <p>This is a digital receipt for your AI prompt purchase.</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrint}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Print Receipt
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Download Handler Component
const DownloadHandler = ({ purchase, onDownloadStart, onDownloadComplete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    onDownloadStart?.(purchase);

    try {
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const blob = new Blob([`# ${purchase.prompt.title}\n\n${purchase.prompt.description}\n\n## Content\n${purchase.prompt.content || 'Premium AI prompt content would be here...'}`],
        { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${purchase.prompt.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onDownloadComplete?.(purchase);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
    >
      {isDownloading && (
        <div
          className="absolute inset-0 bg-purple-200 dark:bg-purple-800/30 transition-all duration-300"
          style={{ width: `${downloadProgress}%` }}
        />
      )}
      <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
      <span className="relative z-10">
        {isDownloading ? `${downloadProgress}%` : 'Download'}
      </span>
    </button>
  );
};

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const mockPurchases = [
    {
      _id: '1',
      amount: 299,
      currency: 'INR',
      status: 'Completed',
      purchasedAt: new Date('2025-01-15'),
      razorpayOrderId: 'order_123456',
      prompt: {
        _id: 'p1',
        title: 'Advanced React Component Patterns',
        description: 'Master advanced React patterns including compound components, render props, and custom hooks for building scalable applications.',
        content: 'You are an expert React developer. Create a comprehensive guide that covers:\n\n1. Compound Components Pattern\n2. Render Props Pattern\n3. Custom Hooks Pattern\n4. Higher-Order Components\n5. Context API Best Practices\n\nFor each pattern, provide:\n- Detailed explanation\n- Code examples\n- Use cases\n- Pros and cons\n- Performance considerations',
        category: 'Coding',
        model: 'GPT-4',
        rating: 4.8,
        pictures: [{
          secure_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop'
        }],
        craftor: {
          _id: 'c1',
          name: 'Sarah Johnson',
          avatar: {
            secure_url: 'https://images.unsplash.com/photo-1494790108755-2616b2e3c4c9?w=100&h=100&fit=crop&crop=face'
          }
        }
      },
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: {
          secure_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      }
    },
    {
      _id: '2',
      amount: 149,
      currency: 'USD',
      status: 'Pending',
      purchasedAt: new Date('2025-01-20'),
      razorpayOrderId: 'order_789012',
      prompt: {
        _id: 'p2',
        title: 'Creative Writing Prompts for Fiction',
        description: 'Unlock your creativity with these powerful writing prompts designed to spark imagination and overcome writer\'s block.',
        content: 'You are a creative writing assistant. Generate compelling fiction prompts that:\n\n1. Character Development Prompts\n2. Plot Twist Generators\n3. Setting Descriptions\n4. Dialogue Starters\n5. Conflict Scenarios\n\nEach prompt should be:\n- Engaging and thought-provoking\n- Suitable for various genres\n- Designed to overcome writer\'s block\n- Scalable from short stories to novels',
        category: 'Writing',
        model: 'Claude',
        rating: 4.6,
        pictures: [{
          secure_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop'
        }],
        craftor: {
          _id: 'c2',
          name: 'Michael Chen',
          avatar: {
            secure_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          }
        }
      },
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: {
          secure_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      }
    },
    {
      _id: '3',
      amount: 499,
      currency: 'EUR',
      status: 'Completed',
      purchasedAt: new Date('2025-01-10'),
      razorpayOrderId: 'order_345678',
      prompt: {
        _id: 'p3',
        title: 'Marketing Automation Strategies',
        description: 'Complete guide to implementing marketing automation workflows that convert leads into customers.',
        content: 'You are a marketing automation expert. Create a comprehensive strategy guide covering:\n\n1. Lead Nurturing Workflows\n2. Email Marketing Automation\n3. Social Media Automation\n4. Customer Segmentation\n5. ROI Tracking and Analytics\n\nFor each strategy:\n- Step-by-step implementation\n- Tools and platforms recommendations\n- Performance metrics\n- A/B testing guidelines\n- Integration best practices',
        category: 'Marketing',
        model: 'GPT-4',
        rating: 4.9,
        pictures: [{
          secure_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop'
        }],
        craftor: {
          _id: 'c3',
          name: 'Emma Wilson',
          avatar: {
            secure_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
          }
        }
      },
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: {
          secure_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      }
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setPurchases(mockPurchases);
      setFilteredPurchases(mockPurchases);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = purchases.filter(purchase => {
      const matchesSearch = purchase.prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            purchase.prompt.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || purchase.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.purchasedAt) - new Date(b.purchasedAt));
    } else if (sortBy === 'amount-high') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'amount-low') {
      filtered.sort((a, b) => a.amount - b.amount);
    }

    setFilteredPurchases(filtered);
  }, [searchTerm, statusFilter, sortBy, purchases]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Initiated':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Initiated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

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

  const handleDownloadStart = (purchase) => {
    console.log('Download started for:', purchase.prompt.title);
  };

  const handleDownloadComplete = (purchase) => {
    console.log('Download completed for:', purchase.prompt.title);
  };

  const handleShowReceipt = (purchase) => {
    setSelectedReceipt(purchase);
    setIsReceiptModalOpen(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptModalOpen(false);
    setSelectedReceipt(null);
  };

  if (isLoading) {
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
              Purchase History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track all your AI prompt purchases and transactions
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Initiated">Initiated</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Highest Amount</option>
                  <option value="amount-low">Lowest Amount</option>
                </select>
                <button className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {filteredPurchases.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No purchases found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchTerm || statusFilter !== 'All'
                    ? 'Try adjusting your filters'
                    : 'Start exploring and purchasing AI prompts'
                  }
                </p>
              </div>
            ) : (
              filteredPurchases.map((purchase) => (
                <div key={purchase._id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={purchase.prompt.pictures[0]?.secure_url || '/api/placeholder/300/200'}
                        alt={purchase.prompt.title}
                        className="w-full lg:w-48 h-32 object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {purchase.prompt.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {purchase.prompt.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full">
                              {purchase.prompt.category}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                              {purchase.prompt.model}
                            </span>
                            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                              <Star className="w-3 h-3 fill-current" />
                              {purchase.prompt.rating}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <img
                              src={purchase.prompt.craftor.avatar?.secure_url || '/api/placeholder/32/32'}
                              alt={purchase.prompt.craftor.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              by {purchase.prompt.craftor.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {getCurrencySymbol(purchase.currency)}{purchase.amount}
                          </div>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(purchase.status)}`}>
                            {getStatusIcon(purchase.status)}
                            {purchase.status}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {formatDate(purchase.purchasedAt)}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Order: {purchase.razorpayOrderId}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                          View Prompt
                        </button>
                        <DownloadHandler
                          purchase={purchase}
                          onDownloadStart={handleDownloadStart}
                          onDownloadComplete={handleDownloadComplete}
                        />
                        <button
                          onClick={() => handleShowReceipt(purchase)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {filteredPurchases.length > 0 && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Load More Purchases
              </button>
            </div>
          )}
        </div>
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={handleCloseReceipt}
          purchase={selectedReceipt}
        />
      </div>
    </NavigationLayout>
  );
};

export default PurchaseHistory;
