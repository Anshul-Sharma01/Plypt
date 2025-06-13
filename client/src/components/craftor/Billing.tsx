import { CreditCard, List, Tag } from "lucide-react";
import NavigationLayout from "../../layouts/NavigationLayout";
import type { CraftorData } from "../../pages/CraftorProfile";

const Billing: React.FC = () => {
  const craftorData: CraftorData = {
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
      {
        _id: "2",
        title: "Dark Renaissance",
        description:
          "Channel the shadows of classical art into modern AI creations.",
        price: 39.99,
        pictures: [
          {
            public_id: "prompt2",
            secure_url:
              "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
          },
        ],
        rating: 4.8,
      },
      {
        _id: "3",
        title: "Cosmic Enigma",
        description:
          "Explore the infinite mysteries of space and time through AI artistry.",
        price: 49.99,
        pictures: [
          {
            public_id: "prompt3",
            secure_url:
              "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
          },
        ],
        rating: 5.0,
      },
    ],
    paymentDetails: {
      razorpayId: "rzp_live_••••••••",
      bankAccount: "••••••••3847",
      upiId: "shadow@paytm",
    },
    tier: "Elite",
  };

  const MysticalBorder = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 dark:from-purple-600/20 dark:via-blue-600/20 dark:to-pink-600/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
      <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden shadow-lg">
        {children}
      </div>
    </div>
  );

  return (
    <NavigationLayout>
      <MysticalBorder>
        <div className="p-8 flex flex-col justify-center items-center h-[70vh]">
          <div className="flex items-center gap-3 mb-8">
            <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Payment Vault
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  Razorpay Portal
                </h3>
              </div>
              <p className="text-gray-900 dark:text-white font-mono text-lg">
                {craftorData?.paymentDetails?.razorpayId}
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 dark:bg-green-500/20 rounded-lg">
                  <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  UPI Gateway
                </h3>
              </div>
              <p className="text-gray-900 dark:text-white font-mono text-lg">
                {craftorData?.paymentDetails?.upiId}
              </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-md transform transition-transform duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                  <List className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                  Bank Nexus
                </h3>
              </div>
              <p className="text-gray-900 dark:text-white font-mono text-lg">
                {craftorData?.paymentDetails?.bankAccount}
              </p>
            </div>
          </div>
        </div>
      </MysticalBorder>
    </NavigationLayout>
  );
};

export default Billing;
