import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Post } from '../../types';
import { postApi } from '../../services/api/postApi';
import { Modal } from '../common/Modal';
import { UserAvatar } from '../common/UserAvatar';
import { CommentSection } from '../comment/CommentSection';
import { formatTimeAgo, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: (updated: Post) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post: initialPost,
  isOpen,
  onClose,
  onPostUpdated,
}) => {
  if (!initialPost) return null;

  const [post, setPost] = useState<Post>(initialPost);

  const handleLike = async () => {
    try {
      const res = post.isLiked
        ? await postApi.unlikePost(post.id)
        : await postApi.likePost(post.id);
      const updated = { ...post, isLiked: res.isLiked, likesCount: res.likesCount };
      setPost(updated);
      if (onPostUpdated) onPostUpdated(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      const res = post.isSaved
        ? await postApi.unsavePost(post.id)
        : await postApi.savePost(post.id);
      const updated = { ...post, isSaved: res.isSaved };
      setPost(updated);
      if (onPostUpdated) onPostUpdated(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl" showCloseButton={true}>
      <div className="flex flex-col md:flex-row -m-5 max-h-[85vh] overflow-hidden">
        {/* Left: Image Container */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[480px]">
          <img
            src={post.imageUrl}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[70vh] object-contain"
          />
        </div>

        {/* Right: Comments and Meta */}
        <div className="w-full md:w-2/5 flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-zinc-900 overflow-y-auto">
          <div>
            {/* Author Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Link to={`/profile/${post.author.username}`} onClick={onClose}>
                <UserAvatar
                  src={post.author.avatarUrl}
                  alt={post.author.displayName}
                  size="sm"
                />
              </Link>
              <div>
                <div className="flex items-center gap-1">
                  <Link
                    to={`/profile/${post.author.username}`}
                    onClick={onClose}
                    className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 hover:underline"
                  >
                    {post.author.username}
                  </Link>
                  {post.author.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
                  )}
                </div>
                {post.location && (
                  <span className="flex items-center gap-0.5 text-[10px] text-zinc-400">
                    <MapPin className="w-2.5 h-2.5" />
                    {post.location}
                  </span>
                )}
              </div>
            </div>

            {/* Caption */}
            <div className="py-3 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
              <span className="font-semibold text-zinc-950 dark:text-white mr-1.5">
                {post.author.username}
              </span>
              {post.caption}
              <p className="text-[10px] text-zinc-400 mt-1">
                {formatTimeAgo(post.createdAt)}
              </p>
            </div>

            {/* Comments Thread */}
            <div className="py-2">
              <CommentSection
                postId={post.id}
                onCommentAdded={() => {
                  setPost((prev) => ({
                    ...prev,
                    commentsCount: prev.commentsCount + 1,
                  }));
                }}
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={cn(
                    'p-1 -ml-1 transition-transform active:scale-125',
                    post.isLiked ? 'text-rose-500' : 'text-zinc-700 dark:text-zinc-300'
                  )}
                >
                  <Heart className={cn('w-5 h-5', post.isLiked && 'fill-rose-500')} />
                </button>
                <button
                  onClick={handleSave}
                  className={cn(
                    'p-1 text-zinc-700 dark:text-zinc-300',
                    post.isSaved && 'text-zinc-950 dark:text-white'
                  )}
                >
                  <Bookmark className={cn('w-5 h-5', post.isSaved && 'fill-current')} />
                </button>
              </div>
              <span className="text-xs font-semibold">
                {formatNumber(post.likesCount)} likes
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
