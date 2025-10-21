import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import toast from 'react-hot-toast';

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

interface UseChatReturn {
  messages: Message[];
  participants: Participant[];
  sendMessage: (content: string) => void;
  joinChat: (roomId: string) => void;
  leaveChat: (roomId: string) => void;
  isLoading: boolean;
}

export const useChat = (roomId: string): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { socket, isConnected } = useSocket();
  const userData = useSelector((state: RootState) => state?.user?.userData);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const joinChat = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('joinChatRoom', { roomId });
      console.log('Joined chat room:', roomId);
    }
  }, [socket, isConnected]);

  const leaveChat = useCallback((roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leaveChatRoom', { roomId });
      console.log('Left chat room:', roomId);
    }
  }, [socket, isConnected]);

  const sendMessage = useCallback((content: string) => {
    if (!socket || !isConnected || !userData) {
      toast.error('Please log in to send messages');
      return;
    }

    if (!content.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    setIsLoading(true);
    socket.emit('sendMessage', {
      roomId,
      content: content.trim()
    });
  }, [socket, isConnected, userData, roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: Message) => {
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data]);
        setIsLoading(false);
      }
    };

    const handleUserJoined = (data: { roomId: string; user: Participant }) => {
      if (data.roomId === roomId) {
        setParticipants(prev => {
          const exists = prev.find(p => p.userId === data.user.userId);
          if (!exists) {
            return [...prev, data.user];
          }
          return prev;
        });
        toast.success(`${data.user.name} joined the chat`);
      }
    };

    const handleUserLeft = (data: { roomId: string; user: Participant }) => {
      if (data.roomId === roomId) {
        setParticipants(prev => prev.filter(p => p.userId !== data.user.userId));
        toast(`${data.user.name} left the chat`);
      }
    };

    const handleError = (error: string) => {
      setIsLoading(false);
      toast.error(error);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('error', handleError);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('error', handleError);
    };
  }, [socket, roomId]);

  return {
    messages,
    participants,
    sendMessage,
    joinChat,
    leaveChat,
    isLoading
  };
}; 