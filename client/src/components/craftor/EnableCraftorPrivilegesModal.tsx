import React, { useState } from 'react';
import { User, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

interface PaymentDetails {
  upiId: string | null;
  razorpayId: string | null;
  bankAccount: string | null;
}

interface EnableCraftorPrivilegesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: PaymentDetails) => Promise<number>;
}

const EnableCraftorPrivilegesModal: React.FC<EnableCraftorPrivilegesModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentDetails.upiId || paymentDetails.razorpayId || paymentDetails.bankAccount) {
        const response = await onSubmit(paymentDetails);
    } else {
      toast.error("Please fill at least one of the details!!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enable Craftor Privileges</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">UPI ID</label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={paymentDetails.upiId || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="razorpayId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Razorpay ID</label>
              <input
                type="text"
                id="razorpayId"
                name="razorpayId"
                value={paymentDetails.razorpayId || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Account</label>
              <input
                type="text"
                id="bankAccount"
                name="bankAccount"
                value={paymentDetails.bankAccount || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading && <LoadingScreen />}
    </>
  );
};

export default EnableCraftorPrivilegesModal;
