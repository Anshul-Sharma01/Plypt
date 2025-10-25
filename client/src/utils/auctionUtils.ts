import { useSelector } from 'react-redux';

export interface AuctionStatus {
  isActive: boolean;
  isEnded: boolean;
  displayText: string;
  statusClass: string;
}

export const getAuctionStatus = (_promptId: string, isBiddable: boolean): AuctionStatus => {
  // If the prompt is not biddable, return no auction status
  if (!isBiddable) {
    return {
      isActive: false,
      isEnded: false,
      displayText: '',
      statusClass: ''
    };
  }

  // Default to active auction if no realtime data is available
  // In a real implementation, you would check the realtime state
  // For now, we'll assume all biddable prompts are active auctions
  // You can enhance this by checking auction end times, etc.
  
  return {
    isActive: true,
    isEnded: false,
    displayText: 'Live Auction',
    statusClass: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md'
  };
};

export const useAuctionStatus = (promptId: string, isBiddable: boolean): AuctionStatus => {
  const realtimeState = useSelector((state: any) => state.realtime);
  
  if (!isBiddable) {
    return {
      isActive: false,
      isEnded: false,
      displayText: '',
      statusClass: ''
    };
  }

  // Check if we have realtime auction data for this prompt
  const auctionData = realtimeState?.activeAuctions?.[promptId];
  
  if (auctionData) {
    if (auctionData.isAuctionEnded) {
      return {
        isActive: false,
        isEnded: true,
        displayText: 'Auction Ended',
        statusClass: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md'
      };
    } else {
      return {
        isActive: true,
        isEnded: false,
        displayText: 'Live Auction',
        statusClass: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md'
      };
    }
  }

  // Default to live auction for biddable prompts without realtime data
  return {
    isActive: true,
    isEnded: false,
    displayText: 'Live Auction',
    statusClass: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md'
  };
};