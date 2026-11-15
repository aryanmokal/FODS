import React, { useState, useEffect } from 'react';
import { Send, Heart, Trash2 } from 'lucide-react';
import { Comment } from '../../types';
import { postApi } from '../../services/api/postApi';
import { UserAvatar } from '../common/UserAvatar';
import { formatTimeAgo } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CommentSectionProps {
  postId: string | number;
  initialCommentsCount?: number;
  onCommentAdded?: () => void;
  maxInitialShow?: number;
  autoFocus?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onCommentAdded,
  maxInitialShow,
  autoFocus = false,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(!maxInitialShow);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    postApi
      .getComments(postId)
      .then((data) => {
        if (isMounted) setComments(data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const created = await postApi.commentOnPost(postId, newCommentText.trim());
      setComments((prev) => [...prev, created]);
      setNewCommentText('');
      if (onCommentAdded) onCommentAdded();
    } catch (e) {
      console.error('Failed to post comment', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedComments =
    maxInitialShow && !showAll ? comments.slice(-maxInitialShow) : comments;

  return (
    <div id={`comment-section-${postId}`} className="space-y-3">
      {/* Comments List */}
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : comments.length === 0 ? (
        <p className="text-xs text-zinc-400 py-1">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {maxInitialShow && comments.length > maxInitialShow && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              View all {comments.length} comments
            </button>
          )}

          {displayedComments.map((comment) => (
            <div
              key={comment.id}
              id={`comment-item-${comment.id}`}
              className="flex items-start gap-2.5 group text-xs"
            >
              <UserAvatar
                src={comment.author.avatarUrl}
                alt={comment.author.displayName}
                size="xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-zinc-800 dark:text-zinc-200 leading-snug">
                  <span className="font-semibold text-zinc-950 dark:text-white mr-1.5 hover:underline cursor-pointer">
                    {comment.author.username}
                  </span>
                  {comment.text}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400">
                  <span>{formatTimeAgo(comment.createdAt)}</span>
                  {comment.likesCount > 0 && (
                    <span>{comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}</span>
                  )}
                  <button className="font-semibold hover:text-zinc-600 dark:hover:text-zinc-200">
                    Reply
                  </button>
                </div>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
                aria-label="Like comment"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80"
      >
        <UserAvatar
          src={user?.avatarUrl}
          alt={user?.displayName || 'Me'}
          size="xs"
        />
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment..."
          autoFocus={autoFocus}
          className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newCommentText.trim() || isSubmitting}
          id={`post-comment-btn-${postId}`}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 disabled:opacity-30 hover:text-indigo-700 transition-colors p-1"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
