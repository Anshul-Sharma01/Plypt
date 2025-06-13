import { CreditCard, List, Tag, Edit3, Save, X } from "lucide-react";
import { useState } from "react";
import NavigationLayout from "../../layouts/NavigationLayout";


interface PaymentDetails {
  razorpayId: string;
  bankAccount: string;
  upiId: string;
}


const Billing = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const initialCraftorData = {
    user: {
      name: "Shadow Artisan",
      username: "shadowcraft",
      avatar: {
        public_id: "avatar123",
        secure_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      },
      bio: "Master of digital mysteries, weaving prompts that unlock the secrets of AI creativity. Each creation is a gateway to unexplored realms of possibility.",
      role: "user",
      email: "shadow@craftorealm.com",
      createdAt: "2023-01-15T10:30:00Z",
    },
    slug: "shadow-artisan",
    totalPromptsSold: 247,
    prompts: [
      {
        _id: "1",
        title: "Ethereal Visions",
        description:
          "Unlock the mysteries of dreamlike imagery with this otherworldly prompt collection.",
        price: 29.99,
        pictures: [
          {
            public_id: "prompt1",
            secure_url:
              "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
          },
        ],
        rating: 4.9,
      },
    ],
    paymentDetails: {
      razorpayId: "rzp_live_••••••••",
      bankAccount: "••••••••3847",
      upiId: "shadow@paytm",
    },
    tier: "Elite",
  };

  const [craftorData, setCraftorData] = useState(initialCraftorData);
  const [editedPaymentDetails, setEditedPaymentDetails] = useState < PaymentDetails>(craftorData.paymentDetails);

  interface MysticalBorderProps {
    children: React.ReactNode;
    className?: string;
  }

  const MysticalBorder : React.FC < MysticalBorderProps> = ({
    children,
    className = "",
  }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-pink-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg">
        {children}
      </div>
    </div>
  );

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPaymentDetails({ ...craftorData.paymentDetails });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPaymentDetails(craftorData.paymentDetails);
  };

  const handleSave = () => {
    // This is where you'll call your function to handle the updated payment details
    handlePaymentDetailsUpdate(editedPaymentDetails);
    
    // Update local state
    setCraftorData(prev => ({
      ...prev,
      paymentDetails: editedPaymentDetails
    }));
    
    setIsEditing(false);
  };

  // This is the function you'll manage - replace this with your actual implementation
  const handlePaymentDetailsUpdate = (updatedDetails : PaymentDetails) => {
    console.log("Payment details updated:", updatedDetails);
    // Here you would typically make an API call to save the updated details
    // Example: await updatePaymentDetails(updatedDetails);
  };

  const handleInputChange = (field, value) => {
    setEditedPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <NavigationLayout>
      <MysticalBorder>
        <div className="p-8 flex flex-col justify-center items-center min-h-[70vh]">
          <div className="flex items-center justify-between w-full max-w-4xl mb-8">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Payment Vault
              </h2>
            </div>
            
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Details
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 shadow-md"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            {/* Razorpay Portal */}
            <div className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md transform transition-all duration-300 hover:scale-105 ${isEditing ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  Razorpay Portal
                </h3>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPaymentDetails.razorpayId}
                  onChange={(e) => handleInputChange('razorpayId', e.target.value)}
                  className="w-full p-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter Razorpay ID"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-mono text-lg">
                  {craftorData?.paymentDetails?.razorpayId}
                </p>
              )}
            </div>

            {/* UPI Gateway */}
            <div className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md transform transition-all duration-300 hover:scale-105 ${isEditing ? 'ring-2 ring-green-200 dark:ring-green-800' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                  <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  UPI Gateway
                </h3>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPaymentDetails.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                  className="w-full p-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter UPI ID"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-mono text-lg">
                  {craftorData?.paymentDetails?.upiId}
                </p>
              )}
            </div>

            {/* Bank Nexus */}
            <div className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md transform transition-all duration-300 hover:scale-105 ${isEditing ? 'ring-2 ring-purple-200 dark:ring-purple-800' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                  <List className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  Bank Nexus
                </h3>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPaymentDetails.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  className="w-full p-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter Bank Account"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-mono text-lg">
                  {craftorData?.paymentDetails?.bankAccount}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                <strong>Edit Mode:</strong> Make your changes and click "Save Changes" to update your payment details.
              </p>
            </div>
          )}
        </div>
      </MysticalBorder>
    </NavigationLayout>
  );
};

export default Billing;