import React, { useEffect, useState, useRef } from 'react';
import { Star, Eye, Heart, Share2, Calendar, Tag, User, ShoppingCart, Gavel, Clock, CheckCircle, Edit, Trash2, Plus, X, Copy, Facebook, Twitter, Linkedin, LucideArrowDownRightFromSquare } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { useNavigate, useParams } from 'react-router-dom';
import { addImageThunk, changeVisibilityThunk, deleteImageThunk, getPromptBySlugThunk, updatePromptDetailsThunk } from '../../features/prompts/promptSlice';
import MysticalLoader from '../../utils/MysticalLoader';
import toast from 'react-hot-toast';
import SkeletonLoader from './SkeletonLoader';
import { initiatePurchaseForPrompt } from '../../features/payment/paymentSlice';
import { handlePayment } from "../../helpers/handlePayment";


interface Craftor {
  _id: string;
  name: string;
  avatar: string;
  slug: string;
}

interface Review {
  _id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Prompt {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  craftor: Craftor;
  price: number;
  category: string;
  model: string;
  tags: string[];
  pictures: { public_id: string; secure_url: string }[];
  rating: number;
  reviews?: Review[];
  aiReview?: {
    rating: number;
    review: string;
  };
  buyers : [String];
  visibility: "Public" | "Private" | "Draft";
  isBiddable: boolean;
  currentBid: number;
  createdAt: string;
  updatedAt: string;
}

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
    'Marketing': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    'Writing': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'Coding': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'Design': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    'Business': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    'Other': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  };
  return colors[category] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const getModelColor = (model: string) => {
  const colors: { [key: string]: string } = {
    'GPT-4': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    'GPT-3.5': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300',
    'Claude': 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300',
    'DALL-E': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
    'Custom': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'Other': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  };
  return colors[model] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
};

const ViewPrompt = () => {
  const { slug } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [isDeleteImageDialogOpen, setIsDeleteImageDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    price: 0,
    category: '',
    model: '',
    tags: '',
    visibility: 'Public' as "Public" | "Private" | "Draft",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userData = useSelector((state: any) => state?.user?.userData);
  const craftorData = useSelector((state: any) => state?.craftor);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromptData = async () => {
      setIsLoading(true);
      const res = await dispatch(getPromptBySlugThunk({ slug }));
      setPrompt(res?.payload?.data?.prompt);
      setIsLoading(false);
    };
    fetchPromptData();
  }, [slug, dispatch]);

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        price: prompt.price,
        category: prompt.category,
        model: prompt.model,
        tags: prompt.tags.join(', '),
        visibility: prompt.visibility,
      });
    }
  }, [prompt]);
  const alreadyPurchased = prompt?.buyers?.includes(userData?._id);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const handleBuyPrompt = async() => {
    const res = await dispatch(initiatePurchaseForPrompt({
      promptId : prompt?._id,
      amt : formData.price,
      currency : "INR"
    }));
    if(res?.payload?.statusCode == 201){
      console.log("sent request");
      const razorpayOrderId = res?.payload?.data?.transaction?.razorpayOrderId;
      const receipt = res?.payload?.data?.receipt;
      handlePayment(razorpayOrderId, formData?.price, receipt, dispatch, navigate, userData);
    }
    console.log("Purchase order initiated : ", res);
  };

  const handlePlaceBid = () => {
    console.log('Placing bid on prompt:', prompt?._id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(updatePromptDetailsThunk({ promptId : prompt?._id, formData}));
    setPrompt(res?.payload?.data);
    setIsEditDialogOpen(false);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileInputRef.current?.files?.[0]) {
      console.log('New image uploaded:', fileInputRef.current.files[0].name);
    }
    const imgData = new FormData();
    imgData.append("image", fileInputRef?.current?.files[0]);
    const res = await dispatch(addImageThunk({ promptId : prompt?._id, image : imgData}));
    setPrompt(res?.payload?.data);
    setIsAddImageDialogOpen(false);
  };

  const handleVisibilityChange = async(e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(changeVisibilityThunk({ promptId : prompt?._id, visibility : formData.visibility }));
    setIsVisibilityDialogOpen(false);
  };

  const handleDeleteImage = async (e : React.FormEvent) => {
    e.preventDefault();
    if (imageToDelete) {
      
      const res = await dispatch(deleteImageThunk({ promptId: prompt?._id, imgToDeletePublicId : imageToDelete }));
      setPrompt(res?.payload?.data);

      setIsDeleteImageDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const isCraftor = prompt?.craftor?._id === craftorData?.craftorData?._id;

  return (
    isLoading ? (
      <SkeletonLoader/>
    ) : (
      <NavigationLayout>
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
          <GridBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(prompt?.category)}`}>
                        {prompt?.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getModelColor(prompt?.model)}`}>
                        {prompt?.model}
                      </span>
                    </div>
                    {isCraftor && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditDialogOpen(true)}
                          className="p-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsVisibilityDialogOpen(true)}
                          className="p-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {prompt?.title}
                  </h1>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-semibold text-gray-900 dark:text-white">{prompt?.rating}</span>
                        <span className="text-gray-500 dark:text-gray-400">({prompt?.reviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDate(prompt?.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`p-2 rounded-lg transition-colors ${
                          isLiked
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => setIsShareDialogOpen(true)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {/* Craftor Info */}
                  {
                    !isCraftor && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <img
                          src={prompt?.craftor?.avatar}
                          alt={prompt?.craftor?.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{prompt?.craftor?.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{prompt?.craftor?.slug}</p>
                        </div>
                      </div>
                    )
                  }
                </div>
                {/* Images */}
                {prompt?.pictures?.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Preview Images</h2>
                      {isCraftor && (
                        <button
                          onClick={() => setIsAddImageDialogOpen(true)}
                          className="p-2 rounded-lg bg-gray-100 cursor-pointer dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden relative">
                        <img
                          src={prompt?.pictures[currentImageIndex]?.secure_url}
                          alt={`Preview ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isCraftor && (
                          <button
                            onClick={() => {
                              setImageToDelete(prompt.pictures[currentImageIndex].public_id);
                              setIsDeleteImageDialogOpen(true);
                            }}
                            className="absolute top-2 cursor-pointer right-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      {prompt?.pictures.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {prompt?.pictures.map((picture, index) => (
                            <button
                              key={picture.public_id}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                currentImageIndex === index
                                  ? 'border-purple-500'
                                  : 'border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              <img
                                src={picture.secure_url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Description */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{prompt?.description}</p>
                </div>
                {/* Tags */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {prompt?.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {/* AI Review */}
                {prompt?.aiReview?.review && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      AI Review
                    </h2>
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900 dark:text-white">{prompt?.aiReview.rating}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{prompt?.aiReview.review}</p>
                  </div>
                )}
                {/* Reviews */}
                {prompt?.reviews.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Reviews ({prompt?.reviews.length})
                    </h2>
                    <div className="space-y-4">
                      {prompt?.reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <img
                              src={review.user.avatar}
                              alt={review.user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{review.user.name}</h4>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">{review.comment}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Purchase Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                  <div className="text-center mb-6">
                    {prompt?.isBiddable ? (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Bid</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                          ${prompt?.currentBid}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Auction ends in 2d 15h</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">${prompt?.price}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                  {!isCraftor && (
                    prompt?.isBiddable ? (
                      <button
                        onClick={handlePlaceBid}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                      >
                        <Gavel className="w-5 h-5" />
                        Place Bid
                      </button>
                    ) : alreadyPurchased ? (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
                      >
                        Already Purchased
                      </button>
                    ) : (
                      <button
                        onClick={handleBuyPrompt}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Buy Now
                      </button>
                    )
                  )}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Views</span>
                      <span className="text-gray-900 dark:text-white font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500 dark:text-gray-400">Downloads</span>
                      <span className="text-gray-900 dark:text-white font-medium">89</span>
                    </div>
                  </div>
                </div>
                {/* Quick Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Category</span>
                      <span className="text-gray-900 dark:text-white font-medium">{prompt?.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Model</span>
                      <span className="text-gray-900 dark:text-white font-medium">{prompt?.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Created</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formatDate(prompt?.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Updated</span>
                      <span className="text-gray-900 dark:text-white font-medium">{formatDate(prompt?.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Edit Dialog */}
          {isEditDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Prompt</h2>
                  <button
                    onClick={() => setIsEditDialogOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Content
                      </label>
                      <textarea
                        name="content"
                        id="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder='⚠️For security purposes, the actual content is not shown here, you can still update your prompt... ⚠️'
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 bg-gray-200 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        id="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Model
                      </label>
                      <input
                        type="text"
                        name="model"
                        id="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        id="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="mr-3 cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 cursor-pointer py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Add Image Dialog */}
          {isAddImageDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Image</h2>
                  <button
                    onClick={() => setIsAddImageDialogOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAddImage}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Upload Image
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        name="image"
                        id="image"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAddImageDialogOpen(false)}
                      className="mr-3 cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 cursor-pointer py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Add Image
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Visibility Dialog */}
          {isVisibilityDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Visibility</h2>
                  <button
                    onClick={() => setIsVisibilityDialogOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleVisibilityChange}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Visibility
                      </label>
                      <select
                        name="visibility"
                        id="visibility"
                        value={formData.visibility}
                        onChange={handleInputChange}
                        className="mt-1 p-2 overflow-scroll block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsVisibilityDialogOpen(false)}
                      className="mr-3 cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 cursor-pointer border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Delete Image Dialog */}
          {isDeleteImageDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delete Image</h2>
                  <button
                    onClick={() => setIsDeleteImageDialogOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this image?</p>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsDeleteImageDialogOpen(false)}
                    className="mr-3 cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteImage}
                    className="px-4 cursor-pointer py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Share Dialog */}
          {isShareDialogOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share Prompt</h2>
                  <button
                    onClick={() => setIsShareDialogOpen(false)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Share Link
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={window.location.href}
                        readOnly
                        className="flex-1 p-2 block w-full rounded-l-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 inline-flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Facebook className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500"
                    >
                      <Twitter className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800"
                    >
                      <Linkedin className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </NavigationLayout>
    )
  );
};

export default ViewPrompt;
