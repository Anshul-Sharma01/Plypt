import React, { useState } from 'react';
import { Shield, User, Calendar, Mail, CreditCard, Tag, List, DollarSign, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import NavigationLayout from '../layouts/NavigationLayout';

interface Picture {
  public_id: string;
  secure_url: string;
}

interface Prompt {
  _id: string;
  title: string;
  description: string;
  price: number;
  pictures: Picture[];
  rating: number;
}

interface CraftorData {
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
  const craftorData: CraftorData = useSelector((state: RootState) => state?.craftor?.craftorData);
  console.log("CraftorData : ", craftorData);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const GridBackground = () => (
    <div className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10 pointer-events-none">
      <div
        className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,_rgb(0_0_0)_2px,_transparent_0)] dark:bg-[radial-gradient(circle_at_2px_2px,_rgb(255_255_255)_2px,_transparent_0)]"
        style={{ backgroundSize: '40px 40px' }}
      ></div>
    </div>
  );

  return (
    <NavigationLayout>
      <div className="relative min-h-screen w-full transition-all duration-500 bg-white dark:bg-black text-gray-900 dark:text-white">
        <GridBackground />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-600 to-pink-600 mb-6 md:mb-0 md:mr-8">
                <img
                  src={craftorData?.user?.avatar?.secure_url}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">{craftorData?.user?.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">@{craftorData?.user?.username}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white`}>
                      {craftorData?.tier}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-8">{craftorData?.user?.bio}</p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <button className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                    <Shield className="w-5 h-5 mr-2" />
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="font-bold text-lg">Joined Date</h3>
                </div>
                <p className="text-xl font-bold">{formatDate(craftorData?.user?.createdAt)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-pink-600 mr-2" />
                  <h3 className="font-bold text-lg">Email</h3>
                </div>
                <p className="text-xl font-bold">{craftorData?.user?.email}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="font-bold text-lg">Total Prompts Sold</h3>
                </div>
                <p className="text-xl font-bold">{craftorData?.totalPromptsSold}</p>
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Prompts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {craftorData?.prompts?.map((prompt) => (
                  <div key={prompt._id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <img
                      src={prompt?.pictures[0]?.secure_url}
                      alt={prompt?.title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{prompt?.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{prompt?.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">${prompt?.price}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{prompt?.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-bold text-lg">Razorpay ID</h3>
                </div>
                <p className="text-xl font-bold">{craftorData?.paymentDetails?.razorpayId}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-4">
                <div className="flex items-center mb-4">
                  <Tag className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="font-bold text-lg">UPI ID</h3>
                </div>
                <p className="text-xl font-bold">{craftorData?.paymentDetails?.upiId}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mt-4">
                <div className="flex items-center mb-4">
                  <List className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="font-bold text-lg">Bank Account</h3>
                </div>
                <p className="text-xl font-bold">{craftorData?.paymentDetails?.bankAccount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
};

export default CraftorProfile;
