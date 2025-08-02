import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Send, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { addCommentThunk, fetchCommentsThunk, deleteCommentThunk } from '../../features/prompts/commentSlice';

interface User {
  _id: string;
  name: string;
  avatar: {
    secure_url: string;
  };
}

interface Comment {
  _id: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentsProps {
  promptId: string;
  totalComments?: number;
}

const Comments: React.FC<CommentsProps> = ({ promptId, totalComments = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: any) => state?.user?.userData);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await dispatch(fetchCommentsThunk({ promptId }));
      setComments(res?.payload?.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComments = () => {
    if (!isOpen && comments.length === 0) {
      fetchComments();
    }
    setIsOpen(!isOpen);
  };

  const handleSubmitComment = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await dispatch(addCommentThunk({ promptId, content: newComment }));
      setComments([res?.payload?.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await dispatch(deleteCommentThunk({ commentId }));
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Comments Header */}
      <button
        onClick={handleToggleComments}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            Comments ({comments.length || totalComments})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Comments Content */}
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Comment Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Your avatar"
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleSubmitComment(e);
                    }
                  }}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading comments...</p>
              </div>
            ) : comments?.length == 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No comments yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {comments?.map((comment) => (
                  <div key={comment._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <div className="flex gap-3">
                      <img
                        src={comment.user.avatar.secure_url}
                        alt={`${comment.user.name}'s avatar`}
                        className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {comment.user.name}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                          {comment.content}
                        </p>
                        {userData?._id === comment?.user?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment?._id)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
