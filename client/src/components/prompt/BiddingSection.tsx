import React, { useState, useEffect } from 'react';
import { Gavel, Clock, TrendingUp, AlertCircle, RefreshCw, Wifi, WifiOff, ShoppingCart, X } from 'lucide-react';
import { useBidding } from '../../hooks/useBidding';
import { useSocket } from '../../hooks/useSocket';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { initiatePurchaseForPrompt, getPendingPurchase, cancelPendingPurchase } from '../../features/payment/paymentSlice';
import { handlePayment } from '../../helpers/handlePayment';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface BiddingSectionProps {
  promptId: string;
  initialBid: number;
  isBiddable: boolean;
  promptCraftorId?: string;
}

const BiddingSection: React.FC<BiddingSectionProps> = ({
  promptId,
  initialBid,
  isBiddable,
  promptCraftorId
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);

  const userData = useSelector((state: RootState) => state?.user?.userData);
  const isLoggedIn = useSelector((state: RootState) => state?.user?.isLoggedIn);
  const craftorData = useSelector((state: any) => state?.craftor?.craftorData);
  const pendingPurchase = useSelector((state: any) => state?.payment?.pendingPurchase);
  const { reconnect } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();



  const {
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
    fetchBids
  } = useBidding(promptId, initialBid, isBiddable);

  useEffect(() => {
    if (isBiddable && isLoggedIn) {
      joinAuction(promptId);
    }

    return () => {
      if (isBiddable) {
        leaveAuction(promptId);
      }
    };
  }, [promptId, isBiddable, isLoggedIn, joinAuction, leaveAuction]);

  // Refresh bids when component becomes visible again (e.g., after tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isBiddable) {
        fetchBids();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchBids, isBiddable]);



  // Calculate unique bidders count
  const uniqueBidders = React.useMemo(() => {
    const uniqueUserIds = new Set(bids.map(bid => bid.user));
    return uniqueUserIds.size;
  }, [bids]);

  // Check if current user is the craftor of this prompt
  const isPromptCraftor = React.useMemo(() => {
    return promptCraftorId && craftorData?._id === promptCraftorId;
  }, [craftorData, promptCraftorId]);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    placeBid(amount);
    setBidAmount('');
    setShowBidForm(false);
  };

  const handleRefreshBids = async () => {
    if (!isBiddable) {
      toast.error('This prompt is not biddable');
      return;
    }

    try {
      await fetchBids();
      toast.success('Bids refreshed!');
    } catch (error) {
      toast.error('Failed to refresh bids');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    // Handle NaN, null, undefined values
    const validAmount = isNaN(amount) || amount == null ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(validAmount);
  };

  // Check if current user is the winner
  const isWinner = React.useMemo(() => {
    const winner = winnerId === userData?._id;
    console.log('Winner check:', { winnerId, userId: userData?._id, isWinner: winner, isAuctionEnded });
    return winner;
  }, [winnerId, userData, isAuctionEnded]);

  // Check for pending purchase on component mount
  useEffect(() => {
    if (isWinner && isAuctionEnded && isLoggedIn) {
      dispatch(getPendingPurchase(promptId));
    }
  }, [isWinner, isAuctionEnded, isLoggedIn, promptId, dispatch]);

  // Handle purchase for auction winner
  const handleWinnerPurchase = async () => {
    if (!isWinner || !isAuctionEnded) {
      toast.error('Only the auction winner can purchase this prompt');
      return;
    }

    try {
      const res = await dispatch(initiatePurchaseForPrompt({
        promptId: promptId,
        amt: currentBid,
        currency: "INR"
      }));

      if (res.type === 'purchase/new-order/fulfilled') {
        // Success case
        const razorpayOrderId = res?.payload?.data?.transaction?.razorpayOrderId;
        const receipt = res?.payload?.data?.receipt;
        const convertedAmount = res?.payload?.data?.amount;
        handlePayment(razorpayOrderId, convertedAmount, receipt, dispatch, navigate, userData);
      } else if (res.type === 'purchase/new-order/rejected') {
        // Check if it's a pending purchase error
        const payload = res.payload as any;
        if (payload?.statusCode === 409 && payload?.hasPendingPurchase) {
          toast('You have a pending purchase for this prompt', { icon: 'ℹ️' });
          // The pending purchase is already set in the store by the reducer
        }
      }
    } catch (error) {
      toast.error('Failed to initiate purchase');
      console.error('Purchase error:', error);
    }
  };

  // Handle resuming pending purchase
  const handleResumePendingPurchase = () => {
    if (pendingPurchase && pendingPurchase.razorpayOrderId) {
      const razorpayOrderId = pendingPurchase.razorpayOrderId;
      const receipt = pendingPurchase.transaction?.orderId;
      const convertedAmount = pendingPurchase.amount * 100; // Convert to paise for Razorpay
      handlePayment(razorpayOrderId, convertedAmount, receipt, dispatch, navigate, userData);
    }
  };

  // Handle cancelling pending purchase
  const handleCancelPendingPurchase = async () => {
    try {
      await dispatch(cancelPendingPurchase(promptId));
      toast.success('Pending purchase cancelled. You can now start a new purchase.');
    } catch (error) {
      toast.error('Failed to cancel pending purchase');
      console.error('Cancel error:', error);
    }
  };

  const formatTimeLeft = (milliseconds: number) => {
    if (!milliseconds || milliseconds <= 0) return '00:00:00';

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isBiddable) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Gavel className="w-5 h-5 text-purple-600" />
          Live Auction
        </h2>
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className="flex items-center gap-1">
            {isConnected ? (
              <div title="Connected">
                <Wifi className="w-4 h-4 text-green-500" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div title="Disconnected">
                  <WifiOff className="w-4 h-4 text-red-500" />
                </div>
                <button
                  onClick={reconnect}
                  className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  title="Reconnect"
                >
                  Reconnect
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleRefreshBids}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh bids"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {isAuctionEnded && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Auction Ended</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Bid Display */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Highest Bid</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(currentBid || initialBid)}
          </p>
          {winnerId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Winner: {winnerId === userData?._id ? 'You' : 'Another bidder'}
            </p>
          )}
        </div>
      </div>

      {/* Auction Timer */}
      <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <Clock className="w-5 h-5 text-orange-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isAuctionEnded 
            ? 'Auction ended' 
            : timeLeft && timeLeft > 0 
              ? `Auction ends in ${formatTimeLeft(timeLeft)}` 
              : 'Place the first bid to start the auction'
          }
        </span>
      </div>

      {/* Auction End Message */}
      {isAuctionEnded && (
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Auction Ended</h3>
            {isWinner ? (
              <div>
                <p className="text-green-600 dark:text-green-400 font-medium mb-3">🎉 Congratulations! You won this auction!</p>
                
                {pendingPurchase ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
                        ⚠️ You have a pending purchase for this prompt
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 text-xs mb-3">
                        Amount: {formatCurrency(pendingPurchase.amount)} • Status: {pendingPurchase.status}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleResumePendingPurchase}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Resume Payment
                        </button>
                        <button
                          onClick={handleCancelPendingPurchase}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-semibold"
                        >
                          <X className="w-4 h-4" />
                          Cancel & Restart
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You can now purchase this prompt at your winning bid price.</p>
                    <button
                      onClick={handleWinnerPurchase}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Purchase Now - {formatCurrency(currentBid)}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">The auction has ended.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Only the winner can purchase this prompt now.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bid Form */}
      {!isAuctionEnded && isLoggedIn && !isPromptCraftor && (
        <div className="mb-6">
          {!showBidForm ? (
            <button
              onClick={() => setShowBidForm(true)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Gavel className="w-5 h-5" />
              {isLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          ) : (
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Bid Amount (USD)
                </label>
                <input
                  type="number"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={(currentBid || initialBid) + 1}
                  step="0.01"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder={`Minimum: ${formatCurrency((currentBid || initialBid) + 1)}`}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Placing...' : 'Place Bid'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBidForm(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Message for craftor */}
      {isLoggedIn && isPromptCraftor && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
            You cannot bid on your own prompt. Watch the auction progress below.
          </p>
        </div>
      )}

      {/* Recent Bids */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Recent Bids</h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {bids.length} bid{bids.length !== 1 ? 's' : ''}
          </span>
        </div>

        {bids.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {bids.slice(0, 10).map((bid, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${bid.user === userData?._id
                  ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700'
                  : 'bg-gray-50 dark:bg-gray-700'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                    {bid.user === userData?._id ? 'You' : 'B'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {bid.user === userData?._id ? 'You' : 'Anonymous Bidder'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(bid.timeStamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(bid.bidAmount || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Gavel className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No bids yet. Be the first to bid!</p>
          </div>
        )}
      </div>

      {/* Active Bidders */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{uniqueBidders}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Active Bidders</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(uniqueBidders, 5) }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-white dark:border-gray-800"
              >
                {i + 1}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {uniqueBidders} unique bidder{uniqueBidders !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BiddingSection; 