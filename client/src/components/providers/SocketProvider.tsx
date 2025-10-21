import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { setSocketConnected } from '../../features/realtime/realtimeSlice';
import Cookies from 'js-cookie';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  reconnect: () => {},
});

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state?.user?.isLoggedIn);
  const userData = useSelector((state: RootState) => state?.user?.userData);

  const reconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setIsConnected(false);
  };

  useEffect(() => {
    if (isLoggedIn && userData && !socket) {
      const accessToken = Cookies.get("accessToken") || localStorage.getItem("accessToken");
      
      if (accessToken) {
        console.log('Creating socket connection...');
        const newSocket = io("http://localhost:5000", {
          auth: { token: accessToken },
          transports: ['websocket', 'polling'],
        });

        newSocket.on('connect', () => {
          console.log('Socket connected:', newSocket.id);
          setIsConnected(true);
          dispatch(setSocketConnected(true));
        });

        newSocket.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
          dispatch(setSocketConnected(false));
        });

        newSocket.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
          setIsConnected(false);
        });

        setSocket(newSocket);
      }
    } else if (!isLoggedIn && socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      dispatch(setSocketConnected(false));
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isLoggedIn, userData, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};