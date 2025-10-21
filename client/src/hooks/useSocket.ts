import { useSocketContext } from '../components/providers/SocketProvider';

interface UseSocketReturn {
  socket: any;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

export const useSocket = (): UseSocketReturn => {
  const { socket, isConnected, reconnect } = useSocketContext();

  const connect = () => {
    // Connection is handled by SocketProvider
    console.log('Socket connection managed by SocketProvider');
    reconnect();
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    reconnect
  };
}; 