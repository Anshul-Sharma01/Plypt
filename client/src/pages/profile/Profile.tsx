import React, { useEffect, useState } from 'react';
import { Shield, User, Calendar, Mail, Edit, Camera } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import NavigationLayout from '../../layouts/NavigationLayout';
import EnableCraftorPrivilegesModal from '../../components/craftor/EnableCraftorPrivilegesModal';
import UpdateProfileModal from '../../components/profile/UpdateProfileModal';
import UploadPictureModal from '../../components/profile/UploadPictureModal';
import { useDispatch } from 'react-redux';
import { updatePictureThunk, updateProfileThunk } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/craftor/LoadingScreen';
import { activateCraftorAccount } from '../../features/craftor/craftorSlice';
import type { CraftorData } from './CraftorProfile';
import toast from 'react-hot-toast';
import LikedPrompts from '../prompt/LikedPrompts';

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

interface PaymentDetails {
  upiId: string | null;
  razorpayId: string | null;
  bankAccount: string | null;
}

const Profile: React.FC = () => {
  const userData: UserData = useSelector((state: RootState) => state?.user?.userData);
  const [isCraftorModalOpen, setIsCraftorModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [craftorData, setCraftorData] = useState<CraftorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleEnableCraftorPrivileges = () => {
    setIsCraftorModalOpen(true);
  };

  const handleCloseCraftorModal = () => {
    setIsCraftorModalOpen(false);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const craftorDataFromRedux = useSelector((state: RootState) => state?.craftor?.craftorData);

  useEffect(() => {
    if (userData?.isCraftor) {
      setCraftorData(craftorDataFromRedux);
    } else {
      setCraftorData(null);
    }
  }, [userData, craftorDataFromRedux]);

  const handleUpdateProfile = async (updatedData: { name: string | null; username: string | null; bio: string | null }) => {
    const formData = new FormData();
    if (updatedData.name && updatedData.name !== userData.name) {
      formData.append("name", updatedData.name);
    }
    if (updatedData.username && updatedData.username !== userData.username) {
      formData.append("username", updatedData.username);
    }
    if (updatedData.bio && updatedData.bio !== userData.bio) {
      formData.append("bio", updatedData.bio);
    }
    const res = await dispatch(updateProfileThunk(formData));
    console.log("Res : ", res);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleUploadPicture = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await dispatch(updatePictureThunk(formData));
    console.log("Res : ", res);
  };

  const handleCraftorActivation = async (paymentDetails: PaymentDetails): Promise<number> => {
    setIsLoading(true);
    let userPaymentDetails: PaymentDetails = {
      bankAccount: "",
      upiId: "",
      razorpayId: ""
    };
    if (paymentDetails.bankAccount) userPaymentDetails.bankAccount = paymentDetails.bankAccount;
    if (paymentDetails.razorpayId) userPaymentDetails.razorpayId = paymentDetails.razorpayId;
    if (paymentDetails.upiId) userPaymentDetails.upiId = paymentDetails.upiId;

    try {
      const response = await dispatch(activateCraftorAccount(userPaymentDetails));
      if (response.payload.statusCode === 201) {
        const craftorData = useSelector((state: RootState) => state?.craftor?.craftorData);
        await new Promise(resolve => setTimeout(resolve, 3000));
        navigate(`/craftor-profile/${craftorData?.slug}`);
      } else {
        console.error("Failed to enable Craftor privileges.");
      }
      return response.payload.statusCode;
    } catch (error) {
      console.error("An error occurred while enabling Craftor privileges.", error);
      return 500;
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <NavigationLayout>
      <div className="relative min-h-screen w-full transition-all duration-500 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="relative w-40 h-40 mb-6 md:mb-0 md:mr-8">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-600 to-pink-600">
                  <img
                    src={userData?.avatar?.secure_url}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleOpenUploadModal}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border-2 border-gray-300 dark:border-gray-600"
                  style={{ transform: 'translate(10%, 10%)' }}
                >
                  <Camera className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-3xl font-bold">{userData.name}</h1>
                      <button
                        onClick={handleOpenUpdateModal}
                        className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    </div>
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
                    <button
                      onClick={handleEnableCraftorPrivileges}
                      className="flex items-center px-6 py-3 bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Activate Craftor Privileges
                    </button>
                  ) : (
                    <button onClick={() => {
                      if (craftorData?.slug) {
                        navigate(`/craftor-profile/${craftorData.slug}`);
                      } else {
                        toast.error("Craftor data not loaded yet");
                      }
                    }} className="cursor-pointer flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300">
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LikedPrompts />
        </div>
      </div>
      <EnableCraftorPrivilegesModal
        isOpen={isCraftorModalOpen}
        onClose={handleCloseCraftorModal}
        onSubmit={handleCraftorActivation}
      />
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onSubmit={handleUpdateProfile}
        userData={userData}
      />
      <UploadPictureModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSubmit={handleUploadPicture}
      />
      {isLoading && <LoadingScreen />}
    </NavigationLayout>
  );
};

export default Profile;
