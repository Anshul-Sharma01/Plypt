import React, { useState } from 'react';
import { Shield, User, Calendar, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import NavigationLayout from '../layouts/NavigationLayout';
import EnableCraftorPrivilegesModal from '../components/craftor/EnableCraftorPrivilegesModal';

interface UserData {
  name: string;
  username: string;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  bio: string;
  role: 'user' | 'admin';
  isCraftor: boolean;
  createdAt: string;
  email: string;
}

const Profile: React.FC = () => {
  const userData: UserData = useSelector((state: RootState) => state?.user?.userData);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const handleEnableCraftorPrivileges = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-600 to-pink-600 mb-6 md:mb-0 md:mr-8">
                <img
                  src={userData.avatar.secure_url}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">{userData.name}</h1>
                    <p className="text-gray-600 dark:text-gray-300">@{userData.username}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                        userData.role === 'admin'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {userData.role}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-8">{userData.bio}</p>
                <div className="flex flex-wrap gap-4">
                  {!userData.isCraftor ? (
                    <button onClick={handleEnableCraftorPrivileges} className="flex items-center px-6 py-3 bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                      <User className="w-5 h-5 mr-2" />
                      Activate Craftor Privileges
                    </button>
                  ) : (
                    <button className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                      <User className="w-5 h-5 mr-2" />
                      Visit Craftor Account
                    </button>
                  )}
                  <button className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
                    <Shield className="w-5 h-5 mr-2" />
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="font-bold text-lg">Joined Date</h3>
                </div>
                <p className="text-xl font-bold">{formatDate(userData.createdAt)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-pink-600 mr-2" />
                  <h3 className="font-bold text-lg">Email</h3>
                </div>
                <p className="text-xl font-bold">{userData.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EnableCraftorPrivilegesModal 
        isOpen = {isModalOpen}
        onClose = {handleCloseModal}
        onSubmit = {() => console.log("Submitted")}
      />
    </NavigationLayout>
  );
};

export default Profile;
