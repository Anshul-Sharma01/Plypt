import { CreditCard, List, Tag, Edit3, Save, X } from "lucide-react";
import { useState, memo } from "react";
import NavigationLayout from "../../layouts/NavigationLayout";
import { useDispatch } from "react-redux";
import { updatePaymentDetailsThunk } from "../../features/craftor/craftorSlice";
import { type AppDispatch, type RootState } from "../../store";
import { useSelector } from "react-redux";

interface PaymentDetails {
  razorpayId: string;
  bankAccount: string;
  upiId: string;
}


const Billing = () => {
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
    prompts: [],
    paymentDetails: {
      razorpayId: "rzp_live_••••••••",
      bankAccount: "••••••••3847",
      upiId: "shadow@paytm",
    },
    tier: "Elite",
  };

  const [craftorData, setCraftorData] = useState(initialCraftorData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPaymentDetails, setEditedPaymentDetails] = useState<PaymentDetails>({
    razorpayId: initialCraftorData.paymentDetails.razorpayId || '',
    bankAccount: initialCraftorData.paymentDetails.bankAccount || '',
    upiId: initialCraftorData.paymentDetails.upiId || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPaymentDetails({ ...craftorData.paymentDetails });
  };

  const handleSave = () => {
    handlePaymentDetailsUpdate(editedPaymentDetails);
    setCraftorData((prev) => ({
      ...prev,
      paymentDetails: editedPaymentDetails,
    }));
    setIsEditing(false);
  };

  const dispatch = useDispatch<AppDispatch>();
  const slug = useSelector((state: RootState) => state?.craftor?.craftorData?.slug);

  const handlePaymentDetailsUpdate = async (updatedDetails: PaymentDetails) => {
    const res = await dispatch(updatePaymentDetailsThunk({ updatedDetails, slug }));
    console.log("Res : ", res);
  };

  return (
    <NavigationLayout>
      <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-gray-800 flex flex-col justify-center items-center min-h-[70vh] dark:bg-gray-800">
        <div className="flex items-center justify-between w-full max-w-4xl mb-8">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 dark:from-blue-400 dark:to-purple-300 bg-clip-text text-transparent">
              Payment Vault
            </h2>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md dark:hover:shadow-blue-400/30"
              >
                <Edit3 className="w-4 h-4" />
                Edit Details
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 shadow-md dark:hover:shadow-gray-300/20"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md dark:hover:shadow-green-400/30"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
          <InputField
            label="Razorpay Portal"
            value={editedPaymentDetails.razorpayId}
            onChange={(e) => setEditedPaymentDetails(prev => ({ ...prev, razorpayId: e.target.value }))}
            icon={<CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            ring="ring-2 ring-blue-200 dark:ring-blue-700"
            isEditing={isEditing}
          />

          <InputField
            label="UPI Gateway"
            value={editedPaymentDetails.upiId}
            onChange={(e) => setEditedPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
            icon={<Tag className="w-5 h-5 text-green-600 dark:text-green-400" />}
            ring="ring-2 ring-green-200 dark:ring-green-700"
            isEditing={isEditing}
          />

          <InputField
            label="Bank Nexus"
            value={editedPaymentDetails.bankAccount}
            onChange={(e) => setEditedPaymentDetails(prev => ({ ...prev, bankAccount: e.target.value }))}
            icon={<List className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
            ring="ring-2 ring-purple-200 dark:ring-purple-700"
            isEditing={isEditing}
          />
        </div>

        {isEditing && (
          <div className="mt-6 p-4 bg-blue-100/80 dark:bg-blue-950 border border-blue-300 dark:border-blue-800 rounded-lg shadow-sm">
            <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
              <strong>Edit Mode:</strong> Make your changes and click "Save Changes" to update your payment details.
            </p>
          </div>
        )}
      </div>
    </NavigationLayout>
  );
};

export default Billing;
