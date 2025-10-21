import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface Bid {
  user: string;
  amount: number;
  timeStamp: Date;
}

interface Message {
  senderId: string;
  content: string;
  timeStamp: Date;
  roomId: string;
}

interface Participant {
  userId: string;
  name: string;
  avatar?: string;
}

interface RealtimeState {
  socketConnected: boolean;
  activeAuctions: {
    [promptId: string]: {
      currentBid: number;
      bids: Bid[];
      isAuctionEnded: boolean;
      winnerId: string | null;
    };
  };
  activeChats: {
    [roomId: string]: {
      messages: Message[];
      participants: Participant[];
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: RealtimeState = {
  socketConnected: false,
  activeAuctions: {},
  activeChats: {},
  loading: false,
  error: null,
};

export const updateSocketConnection = createAsyncThunk(
  'realtime/updateSocketConnection',
  async (connected: boolean) => {
    return connected;
  }
);

export const updateAuctionData = createAsyncThunk(
  'realtime/updateAuctionData',
  async (data: { promptId: string; currentBid: number; bids: Bid[]; isAuctionEnded: boolean; winnerId: string | null }) => {
    return data;
  }
);

export const updateChatData = createAsyncThunk(
  'realtime/updateChatData',
  async (data: { roomId: string; messages: Message[]; participants: Participant[] }) => {
    return data;
  }
);

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
    },
    addBid: (state, action: PayloadAction<{ promptId: string; bid: Bid }>) => {
      const { promptId, bid } = action.payload;
      if (!state.activeAuctions[promptId]) {
        state.activeAuctions[promptId] = {
          currentBid: 0,
          bids: [],
          isAuctionEnded: false,
          winnerId: null,
        };
      }
      state.activeAuctions[promptId].bids.unshift(bid);
      state.activeAuctions[promptId].currentBid = bid.amount;
    },
    addMessage: (state, action: PayloadAction<{ roomId: string; message: Message }>) => {
      const { roomId, message } = action.payload;
      if (!state.activeChats[roomId]) {
        state.activeChats[roomId] = {
          messages: [],
          participants: [],
        };
      }
      state.activeChats[roomId].messages.push(message);
    },
    setAuctionEnded: (state, action: PayloadAction<{ promptId: string; winnerId: string; finalBid: number }>) => {
      const { promptId, winnerId, finalBid } = action.payload;
      if (state.activeAuctions[promptId]) {
        state.activeAuctions[promptId].isAuctionEnded = true;
        state.activeAuctions[promptId].winnerId = winnerId;
        state.activeAuctions[promptId].currentBid = finalBid;
      }
    },
    addParticipant: (state, action: PayloadAction<{ roomId: string; participant: Participant }>) => {
      const { roomId, participant } = action.payload;
      if (!state.activeChats[roomId]) {
        state.activeChats[roomId] = {
          messages: [],
          participants: [],
        };
      }
      const exists = state.activeChats[roomId].participants.find(p => p.userId === participant.userId);
      if (!exists) {
        state.activeChats[roomId].participants.push(participant);
      }
    },
    removeParticipant: (state, action: PayloadAction<{ roomId: string; userId: string }>) => {
      const { roomId, userId } = action.payload;
      if (state.activeChats[roomId]) {
        state.activeChats[roomId].participants = state.activeChats[roomId].participants.filter(
          p => p.userId !== userId
        );
      }
    },
    clearRealtimeData: (state) => {
      state.activeAuctions = {};
      state.activeChats = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSocketConnection.fulfilled, (state, action) => {
        state.socketConnected = action.payload;
      })
      .addCase(updateAuctionData.fulfilled, (state, action) => {
        const { promptId, currentBid, bids, isAuctionEnded, winnerId } = action.payload;
        state.activeAuctions[promptId] = {
          currentBid,
          bids,
          isAuctionEnded,
          winnerId,
        };
      })
      .addCase(updateChatData.fulfilled, (state, action) => {
        const { roomId, messages, participants } = action.payload;
        state.activeChats[roomId] = {
          messages,
          participants,
        };
      });
  },
});

export const {
  setSocketConnected,
  addBid,
  addMessage,
  setAuctionEnded,
  addParticipant,
  removeParticipant,
  clearRealtimeData,
} = realtimeSlice.actions;

export default realtimeSlice.reducer; 