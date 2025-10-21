import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import toast from 'react-hot-toast';
import axiosInstance from '../helpers/axiosInstance';

interface Bid {
  user: string;
  bidAmount: number;
  timeStamp: Date;
}

interface AuctionHistory {
  prompt: {
    id: string;
    title: string;
    initialBid: number;
    currentBid: number;
    isBiddable: boolean;
  };
  bids: Bid[];
  auctionInfo: {
    isEnded: boolean;
    winnerId: string | null;
    startTime: string | null;
    endTime: string | null;
  };
}

interface UseBiddingReturn {
  currentBid: number;
  bids: Bid[];
  isAuctionEnded: boolean;
  winnerId: string | null;
  timeLeft: number | null;
  placeBid: (amount: number) => void;
  joinAuction: (promptId: string) => void;
  leaveAuction: (promptId: string) => void;
  isLoading: boolean;
  isConnected: boolean;
  fetchBids: () => Promise<void>;
  fetchAuctionHistory: () => Promise<AuctionHistory | null>;
}

export const useBidding = (promptId: string, initialBid: number = 0, isBiddable: boolean = false): UseBiddingReturn => {
  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { socket, isConnected } = useSocket();
  const userData = useSelector((state: RootState) => state?.user?.userData);

  const fetchBids = useCallback(async (isBiddable: boolean = true) => {
    // Only fetch bids for biddable prompts
    if (!isBiddable) {
      console.log('Skipping bid fetch for non-biddable prompt:', promptId);
      return;
    }

    try {
      console.log('=== FETCHING BIDS ===');
      console.log('Prompt ID:', promptId);
      console.log('Axios baseURL:', axiosInstance.defaults.baseURL);
      console.log('Full URL will be:', `${axiosInstance.defaults.baseURL}/auction/bids/${promptId}`);
      
      const response = await axiosInstance.get(`/auction/bids/${promptId}`);
      console.log('Bids response:', response.data);
      const { bids: fetchedBids, currentBid: fetchedCurrentBid, isAuctionEnded: fetchedIsAuctionEnded, winnerId: fetchedWinnerId } = response.data.data;
      
      setBids(fetchedBids || []);
      setCurrentBid(fetchedCurrentBid || initialBid);
      setIsAuctionEnded(fetchedIsAuctionEnded || false);
      setWinnerId(fetchedWinnerId || null);
      
      console.log('=== BIDS FETCHED SUCCESSFULLY ===');
      console.log('Bids count:', fetchedBids?.length || 0);
      console.log('Current bid:', fetchedCurrentBid);
      console.log('Auction ended:', fetchedIsAuctionEnded);
    } catch (error: any) {
      console.error('=== ERROR FETCHING BIDS ===');
      console.error('Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error URL:', error.config?.url);
      console.error('Full error config:', error.config);
      // Only show toast error for actual server errors, not for non-biddable prompts
      if (error.response?.status !== 404) {
        toast.error(`Failed to fetch bids: ${error.response?.data?.message || error.message}`);
      }
    }
  }, [promptId, initialBid]);

  const fetchAuctionStatus = useCallback(async (isBiddable: boolean = true) => {
    // Only fetch auction status for biddable prompts
    if (!isBiddable) {
      console.log('Skipping auction status fetch for non-biddable prompt:', promptId);
      return;
    }

    try {
      const response = await axiosInstance.get(`/auction/status/${promptId}`);
      const { isAuctionEnded: fetchedIsAuctionEnded, winnerId: fetchedWinnerId, timeLeft: fetchedTimeLeft } = response.data.data;
      
      setIsAuctionEnded(fetchedIsAuctionEnded || false);
      setWinnerId(fetchedWinnerId || null);
      setTimeLeft(fetchedTimeLeft || null);
    } catch (error) {
      console.error('Error fetching auction status:', error);
      // Don't show toast errors for auction status failures
    }
  }, [promptId]);

  const fetchAuctionHistory = useCallback(async (): Promise<AuctionHistory | null> => {
    try {
      const response = await axiosInstance.get(`/auction/history/${promptId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching auction history:', error);
      toast.error('Failed to fetch auction history');
      return null;
    }
  }, [promptId]);

  const joinAuction = useCallback((promptId: string) => {
    if (socket) {
      socket.emit('joinAuctionRoom', { promptId });
      console.log('Joined auction room:', promptId);
    }
  }, [socket]);

  const leaveAuction = useCallback((promptId: string) => {
    if (socket) {
      socket.emit('leaveAuctionRoom', { promptId });
      console.log('Left auction room:', promptId);
    }
  }, [socket]);

  const placeBid = useCallback((amount: number) => {
    console.log('Placing bid:', { amount, promptId, hasSocket: !!socket, hasUser: !!userData });

    if (!socket) {
      toast.error('Connection not available. Please refresh the page.');
      return;
    }

    if (!userData) {
      toast.error('Please log in to place a bid');
      return;
    }

    if (isAuctionEnded) {
      toast.error('Auction has ended');
      return;
    }

    if (amount <= currentBid) {
      toast.error(`Bid must be higher than current bid ($${currentBid})`);
      return;
    }

    setIsLoading(true);
    
    socket.emit('placeBid', {
      promptId,
      bidAmount: amount
    });

    // Set a timeout to reset loading state if no response
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, [socket, userData, promptId, currentBid, isAuctionEnded]);

  // Fetch bids and auction status when component mounts
  useEffect(() => {
    fetchBids(isBiddable);
    fetchAuctionStatus(isBiddable);
  }, [fetchBids, fetchAuctionStatus, isBiddable]);

  // Update time left every second
  useEffect(() => {
    if (timeLeft && timeLeft > 0 && !isAuctionEnded) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev > 0) {
            return prev - 1000;
          }
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, isAuctionEnded]);

  useEffect(() => {
    if (!socket) return;

    const handleNewBid = (data: { promptId: string; bid: any; isFirstBid?: boolean }) => {
      if (data.promptId === promptId) {
        const bidAmount = data.bid.amount || data.bid.bidAmount || 0;
        setCurrentBid(bidAmount);
        setBids(prev => [{
          user: data.bid.user,
          bidAmount: bidAmount,
          timeStamp: data.bid.timeStamp || new Date()
        }, ...prev]);
        setIsLoading(false);
        toast.success('Bid placed successfully!');
      }
    };

    const handleAuctionStarted = (data: { promptId: string; timeLeft: number; startTime: string }) => {
      if (data.promptId === promptId) {
        console.log('Auction started:', data);
        setTimeLeft(data.timeLeft);
        setIsAuctionEnded(false);
        // Only show toast if this is a new auction start (not a rejoin)
        if (data.timeLeft > 19 * 60 * 1000) { // Close to full 20 minutes
          toast.success('Auction started! 20 minutes remaining.');
        }
      }
    };

    const handleBidRejected = (data: { message: string }) => {
      setIsLoading(false);
      toast.error(data.message);
    };

    const handleAuctionEnded = (data: { promptId: string; winnerId: string; finalBid: number }) => {
      if (data.promptId === promptId) {
        console.log('Auction ended event received:', data);
        setIsAuctionEnded(true);
        setWinnerId(data.winnerId);
        setCurrentBid(data.finalBid);
        setTimeLeft(0);
        toast.success('Auction ended!');
      }
    };

    const handleAuctionEnd = (data: { promptId: string; message: string }) => {
      if (data.promptId === promptId) {
        setIsAuctionEnded(true);
        setTimeLeft(0);
        toast.error(data.message);
      }
    };

    socket.on('newBid', handleNewBid);
    socket.on('bidRejected', handleBidRejected);
    socket.on('auctionEnded', handleAuctionEnded);
    socket.on('auctionEnd', handleAuctionEnd);
    socket.on('auctionStarted', handleAuctionStarted);

    return () => {
      socket.off('newBid', handleNewBid);
      socket.off('bidRejected', handleBidRejected);
      socket.off('auctionEnded', handleAuctionEnded);
      socket.off('auctionEnd', handleAuctionEnd);
    };
  }, [socket, promptId]);

  return {
    currentBid,
    bids,
    isAuctionEnded,
    winnerId,
    timeLeft,
    placeBid,
    joinAuction,
    leaveAuction,
    isLoading,
    isConnected,
    fetchBids: () => fetchBids(isBiddable),
    fetchAuctionHistory
  };
}; 