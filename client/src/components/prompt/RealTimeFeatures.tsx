import React, { useState } from 'react';
import { Gavel, MessageCircle } from 'lucide-react';
import BiddingSection from './BiddingSection';
import ChatRoom from './ChatRoom';

interface RealTimeFeaturesProps {
  promptId: string;
  initialBid: number;
  isBiddable: boolean;
  promptCraftorId?: string;
}

type TabType = 'bidding' | 'chat';

const RealTimeFeatures: React.FC<RealTimeFeaturesProps> = ({
  promptId,
  initialBid,
  isBiddable,
  promptCraftorId
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('bidding');

  const tabs = [
    {
      id: 'bidding' as TabType,
      label: 'Live Auction',
      icon: Gavel,
      disabled: !isBiddable
    },
    {
      id: 'chat' as TabType,
      label: 'Live Chat',
      icon: MessageCircle,
      disabled: false
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-600">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'bidding' && (
          <BiddingSection
            promptId={promptId}
            initialBid={initialBid}
            isBiddable={isBiddable}
            promptCraftorId={promptCraftorId}
          />
        )}
        {activeTab === 'chat' && (
          <ChatRoom promptId={promptId} />
        )}
      </div>
    </div>
  );
};

export default RealTimeFeatures; 