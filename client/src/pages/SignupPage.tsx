import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Camera, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createUserAccount } from '../features/user/userSlice';
import type { AppDispatch } from '../store';

const SignupPage: React.FC = () => {
  // Mock state for demo - replace with actual Redux logic
  const loading = false;
  const error = null;
  const isLoggedIn = false;
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    avatar: null as File | null,
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const navigate = useNavigate();
  // Mock navigation for demo - replace with actual navigation
  React.useEffect(() => {
    if (isLoggedIn) {
      console.log('Would navigate to home page');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const password = form.password;
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, avatar: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return;
    }
  
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('username', form.username);
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('bio', form.bio);
    if (form.avatar) {
      formData.append('avatar', form.avatar);
    }
  
    const res = await dispatch(createUserAccount(formData));
    console.log("Response : ", res);
    if (res?.payload?.statusCode === 201) {
      navigate("/");
      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        bio: "",
        avatar: null
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedStep1 = form.name.trim() && form.username.trim() && form.email.trim();
  const canProceedStep2 = form.password && form.confirmPassword && 
    form.password === form.confirmPassword && 
    Object.values(passwordValidation).every(Boolean);

  const isPasswordMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;
  const hasPasswordMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const steps = [
    { number: 1, title: 'Basic Info', completed: canProceedStep1 },
    { number: 2, title: 'Security', completed: canProceedStep2 },
    { number: 3, title: 'Profile', completed: false },
  ];

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 bg-white dark:bg-gray-900 rounded-sm"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join us today! Please fill in your details.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep === step.number
                      ? 'bg-blue-600 text-white'
                      : step.completed
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.completed ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span className={`text-xs mt-1 ${
                    currentStep === step.number
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    steps[index + 1].completed || currentStep > step.number
                      ? 'bg-green-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Security */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Validation */}
                {form.password && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Password requirements:</p>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {[
                        { key: 'length', text: 'At least 8 characters' },
                        { key: 'uppercase', text: 'One uppercase letter' },
                        { key: 'lowercase', text: 'One lowercase letter' },
                        { key: 'number', text: 'One number' },
                        { key: 'special', text: 'One special character' },
                      ].map(({ key, text }) => (
                        <div key={key} className={`flex items-center space-x-2 ${
                          passwordValidation[key as keyof typeof passwordValidation] 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {passwordValidation[key as keyof typeof passwordValidation] ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        hasPasswordMismatch
                          ? 'border-red-300 dark:border-red-700 focus:ring-red-500'
                          : isPasswordMatch
                          ? 'border-green-300 dark:border-green-700 focus:ring-green-500'
                          : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'
                      }`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {hasPasswordMismatch && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">Passwords do not match</p>
                  )}
                  {isPasswordMatch && (
                    <p className="text-green-600 dark:text-green-400 text-sm mt-1">Passwords match</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Profile */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Setup</h3>
                
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <label
                        htmlFor="avatar"
                        className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-3 h-3 text-white" />
                      </label>
                      <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload a profile picture to personalize your account
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        JPG, PNG or GIF (max. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio (Optional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself..."
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200 text-sm mt-4">
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="flex cursor-pointer items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex cursor-pointer items-center px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium underline bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
        </div>

        {/* Social Login */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            onClick={handleGoogleSignup}
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;