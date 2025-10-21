import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, User, Clock } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ChatRoomProps {
  promptId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ promptId }) => {
  const [message, setMessage] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userData = useSelector((state: RootState) => state?.user?.userData);
  const isLoggedIn = useSelector((state: RootState) => state?.user?.isLoggedIn);

  const {
    messages,
    participants,
    sendMessage,
    joinChat,
    leaveChat,
    isLoading
  } = useChat(promptId);

  useEffect(() => {
    if (isLoggedIn) {
      joinChat(promptId);
    }

    return () => {
      leaveChat(promptId);
    };
  }, [promptId, isLoggedIn, joinChat, leaveChat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    return today.toDateString() === messageDate.toDateString();
  };

  const formatMessageTime = (date: Date) => {
    return isToday(date) ? formatTime(date) : formatDate(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
        </div>
        <button
          onClick={() => setShowParticipants(!showParticipants)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Users className="w-4 h-4" />
          <span>{participants.length}</span>
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.senderId === userData?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId === userData?._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs opacity-75">
                        {msg.senderId === userData?._id ? 'You' : 'Anonymous'}
                      </span>
                      <Clock className="w-3 h-3" />
                      <span className="text-xs opacity-75">
                        {formatMessageTime(msg.timeStamp)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {isLoggedIn ? (
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 border-t border-gray-200 dark:border-gray-600 text-center text-gray-500 dark:text-gray-400">
              <p>Please log in to send messages</p>
            </div>
          )}
        </div>

        {/* Participants Sidebar */}
        {showParticipants && (
          <div className="w-64 border-l border-gray-200 dark:border-gray-600 p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Participants ({participants.length})
            </h4>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {participant.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {participant.userId === userData?._id ? 'You' : 'Online'}
                    </p>
                  </div>
                </div>
              ))}
              {participants.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No participants yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom; 