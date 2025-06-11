import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedData: { name: string; username: string; bio: string }) => void;
  userData: {
    name: string;
    username: string;
    bio: string;
  };
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, onClose, onSubmit, userData }) => {
  const [name, setName] = useState(userData.name);
  const [username, setUsername] = useState(userData.username);
  const [bio, setBio] = useState(userData.bio);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match this duration with the CSS transition duration
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, username, bio });
    handleClose();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 shadow-lg transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Update Profile</h2>
          <button onClick={handleClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 dark:focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 dark:focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 dark:focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
