import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, X, Plus, Eye, EyeOff, Zap, Sparkles, Wand2, Code, PenTool, Palette, Megaphone, Briefcase, MoreHorizontal } from 'lucide-react';
import NavigationLayout from '../../layouts/NavigationLayout';

// Enhanced GridBackground with animated dots using purple and violet tones
const GridBackground = () => (
  <div className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20 pointer-events-none overflow-hidden">
    <div
      className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(147_51_234)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(168_85_247)_2px,_transparent_0)] animate-pulse"
      style={{ backgroundSize: '60px 60px' }}
    ></div>
    {/* Floating orbs with purple and violet tones */}
    <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full blur-3xl opacity-20 animate-float"></div>
    <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-3xl opacity-15 animate-float-delayed"></div>
    <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-float-slow"></div>
  </div>
);

const CreatePrompt = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    price: 0,
    category: 'Other',
    model: 'GPT-3.5',
    tags: [],
    pictures: [],
    visibility: 'Draft',
    isBiddable: false
  });
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const totalSteps = 4;

  const categories = [
    { value: 'Coding', icon: Code, color: 'from-blue-500 via-blue-600 to-indigo-500', shadow: 'shadow-blue-500/25' },
    { value: 'Writing', icon: PenTool, color: 'from-green-500 via-green-600 to-emerald-500', shadow: 'shadow-green-500/25' },
    { value: 'Design', icon: Palette, color: 'from-purple-500 via-purple-600 to-violet-500', shadow: 'shadow-purple-500/25' },
    { value: 'Marketing', icon: Megaphone, color: 'from-orange-500 via-orange-600 to-amber-500', shadow: 'shadow-orange-500/25' },
    { value: 'Business', icon: Briefcase, color: 'from-purple-500 via-purple-600 to-violet-500', shadow: 'shadow-purple-500/25' },
    { value: 'Other', icon: MoreHorizontal, color: 'from-gray-500 via-gray-600 to-slate-500', shadow: 'shadow-gray-500/25' }
  ];

  const models = [
    { value: 'GPT-3.5', name: 'GPT-3.5 Turbo', desc: 'Fast and efficient', gradient: 'from-indigo-500 to-violet-500' },
    { value: 'GPT-4', name: 'GPT-4', desc: 'Most capable model', gradient: 'from-purple-500 to-indigo-500' },
    { value: 'DALL-E', name: 'DALL-E 3', desc: 'Image generation', gradient: 'from-purple-500 to-violet-500' },
    { value: 'Claude', name: 'Claude', desc: 'Anthropic\'s AI', gradient: 'from-indigo-500 to-blue-500' },
    { value: 'Custom', name: 'Custom Model', desc: 'Your own model', gradient: 'from-indigo-500 to-blue-500' },
    { value: 'Other', name: 'Other', desc: 'Specify in description', gradient: 'from-gray-500 to-slate-500' }
  ];

  const visibilityOptions = [
    {
      value: 'Public',
      desc: 'Visible to everyone',
      icon: <Eye className="w-8 h-8 mx-auto mb-3" />,
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      value: 'Private',
      desc: 'Only visible to you',
      icon: <EyeOff className="w-8 h-8 mx-auto mb-3" />,
      gradient: 'from-red-500 to-rose-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      value: 'Draft',
      desc: 'Save as draft',
      icon: <Sparkles className="w-8 h-8 mx-auto mb-3" />,
      gradient: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (field === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 2:
        return formData.content.trim() !== '';
      case 3:
        return formData.model.trim() !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const generateDescriptionWithAI = async () => {
    // Simulate AI generation
    const descriptions = [
      "A powerful AI prompt designed to enhance productivity and creativity through intelligent automation.",
      "Streamline your workflow with this innovative prompt that delivers exceptional results every time.",
      "Transform your ideas into reality with this cutting-edge AI prompt optimized for maximum impact."
    ];
    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    handleInputChange('description', randomDesc);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      pictures: [...prev.pictures, ...files]
    }));
  };

  const removePicture = (index) => {
    setFormData(prev => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index)
    }));
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 transform ${
            step <= currentStep
              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-white shadow-xl scale-110 shadow-purple-500/50'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:scale-105'
          }`}>
            {step <= currentStep && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 animate-pulse opacity-75"></div>
            )}
            <span className="relative z-10">{step}</span>
          </div>
          {step < 4 && (
            <div className={`w-20 h-2 mx-4 rounded-full transition-all duration-500 ${
              step < currentStep
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 shadow-lg shadow-purple-500/30'
                : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 rounded-full mb-6 shadow-2xl shadow-purple-500/50 animate-bounce-slow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
                Basic Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Let's start with the essentials of your prompt</p>
            </div>
            <div className="space-y-8">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a catchy title for your prompt"
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 group-hover:shadow-lg"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  placeholder="URL-friendly version of title"
                  disabled
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 cursor-not-allowed opacity-70"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Description *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what your prompt does and how it helps users"
                    rows={5}
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none group-hover:shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={generateDescriptionWithAI}
                    className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl text-white hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full mb-6 shadow-2xl shadow-blue-500/50 animate-bounce-slow">
                <Wand2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-3">
                Prompt Content
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Add the actual prompt content and categorize it</p>
            </div>
            <div className="space-y-8">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Prompt Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Enter your prompt content here..."
                  rows={8}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none group-hover:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => handleInputChange('category', category.value)}
                        className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          formData.category === category.value
                            ? `border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 shadow-xl ${category.shadow}`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 mx-auto shadow-lg ${category.shadow} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{category.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full mb-6 shadow-2xl shadow-green-500/50 animate-bounce-slow">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-3">
                Model & Tags
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Specify the AI model and add relevant tags</p>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  AI Model
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models.map((model) => (
                    <button
                      key={model.value}
                      type="button"
                      onClick={() => handleInputChange('model', model.value)}
                      className={`group p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                        formData.model === model.value
                          ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 shadow-xl shadow-purple-500/25'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${model.gradient} mb-3 group-hover:scale-150 transition-transform duration-300`}></div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">{model.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{model.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-100 to-violet-100 dark:from-purple-900/40 dark:to-violet-900/40 text-purple-800 dark:text-purple-200 shadow-lg border border-purple-200 dark:border-purple-700 animate-fadeIn"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add a tag"
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-full mb-6 shadow-2xl shadow-orange-500/50 animate-bounce-slow">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-3">
                Final Settings
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Set pricing and visibility options</p>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 group-hover:shadow-lg"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isBiddable}
                      onChange={(e) => handleInputChange('isBiddable', e.target.checked)}
                      className="w-6 h-6 text-purple-600 bg-gray-100 border-2 border-gray-300 rounded-lg focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-300"
                    />
                    <div>
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors duration-300">Allow Bidding</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Let users bid on your prompt</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Visibility
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('visibility', option.value)}
                      className={`group p-6 rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                        formData.visibility === option.value
                          ? `border-purple-500 ${option.bg} shadow-xl shadow-purple-500/25`
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
                      }`}
                    >
                      <div className={`text-gray-600 dark:text-gray-400 mb-2 group-hover:scale-110 transition-transform duration-300 ${
                        formData.visibility === option.value ? `bg-gradient-to-r ${option.gradient} bg-clip-text text-transparent` : ''
                      }`}>
                        {option.icon}
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white text-lg mb-1">{option.value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Pictures (Optional)
                </label>
                <div
                  className="border-3 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                    multiple
                    style={{ display: 'none' }}
                  />
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6 group-hover:text-purple-500 group-hover:scale-110 transition-all duration-300" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg font-medium">Upload images to showcase your prompt</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                  {formData.pictures.map((picture, index) => (
                    <div key={index} className="relative group animate-fadeIn">
                      <img
                        src={URL.createObjectURL(picture)}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => removePicture(index)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900 text-gray-800 dark:text-white relative overflow-hidden">
        <GridBackground />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>

            <div className="p-8 md:p-12 relative">
              <StepIndicator />
              <div className="max-w-3xl mx-auto">
                {renderStep()}
              </div>
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
                {currentStep === totalSteps ? (
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse-slow"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Prompt
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={!isCurrentStepValid()}
                    className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-700 hover:via-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 ${!isCurrentStepValid() ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-xl' : ''}`}
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(-180deg); }
          }

          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-15px) scale(1.1); }
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }

          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }

          .animate-float {
            animation: float 8s ease-in-out infinite;
          }

          .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
            animation-delay: 2s;
          }

          .animate-float-slow {
            animation: float-slow 12s ease-in-out infinite;
            animation-delay: 4s;
          }

          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }

          .animate-pulse-slow {
            animation: pulse-slow 3s ease-in-out infinite;
          }

          .border-3 {
            border-width: 3px;
          }

          /* Gradient text animations */
          .bg-clip-text {
            background-clip: text;
            -webkit-background-clip: text;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(156, 163, 175, 0.1);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #9333ea, #8b5cf6);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #7e22ce, #7c3aed);
          }

          /* Enhanced focus states */
          input:focus, textarea:focus {
            outline: none;
          }

          /* Button hover effects */
          button:hover {
            transform: translateY(-2px);
          }

          button:active {
            transform: translateY(0);
          }

          /* Card hover effects */
          .group:hover {
            transform: translateY(-4px);
          }

          /* Backdrop blur support */
          .backdrop-blur-sm {
            backdrop-filter: blur(4px);
          }

          .backdrop-blur-xl {
            backdrop-filter: blur(24px);
          }
        `}</style>
      </div>
    </NavigationLayout>
  );
};

export default CreatePrompt;
