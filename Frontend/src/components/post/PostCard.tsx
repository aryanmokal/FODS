import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Post } from '../../types';
import { postApi } from '../../services/api/postApi';
import { UserAvatar } from '../common/UserAvatar';
import { CommentSection } from '../comment/CommentSection';
import { ShareModal } from './ShareModal';
import { formatTimeAgo, formatNumber } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface PostCardProps {
  post: Post;
  onPostUpdated?: (updatedPost: Post) => void;
  onPostDeleted?: (postId: string | number) => void;
  onOpenDetailModal?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post: initialPost,
  onPostUpdated,
  onPostDeleted,
  onOpenDetailModal,
}) => {
  const { user } = useAuth();
  const [post, setPost] = useState<Post>(initialPost);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isAuthor = user?.username === post.author.username;

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const res = post.isLiked
        ? await postApi.unlikePost(post.id)
        : await postApi.likePost(post.id);

      const updated = {
        ...post,
        isLiked: res.isLiked,
        likesCount: res.likesCount,
      };
      setPost(updated);
      if (onPostUpdated) onPostUpdated(updated);
    } catch (e) {
      console.error('Failed to toggle like', e);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDoubleTap = async () => {
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
    if (!post.isLiked) {
      await handleLike();
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const res = post.isSaved
        ? await postApi.unsavePost(post.id)
        : await postApi.savePost(post.id);

      const updated = {
        ...post,
        isSaved: res.isSaved,
      };
      setPost(updated);
      if (onPostUpdated) onPostUpdated(updated);
    } catch (e) {
      console.error('Failed to toggle save', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postApi.deletePost(post.id);
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (e) {
      console.error('Failed to delete post', e);
    }
  };

  return (
    <article
      id={`post-card-${post.id}`}
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs mb-6 transition-all"
    >
      {/* Header: Author Info */}
      <div className="flex items-center justify-between p-3.5 sm:px-4">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author.username}`}>
            <UserAvatar
              src={post.author.avatarUrl}
              alt={post.author.displayName}
              size="sm"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Link
                to={`/profile/${post.author.username}`}
                className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                {post.author.username}
              </Link>
              {post.author.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
              )}
            </div>
            {post.location && (
              <span className="flex items-center gap-0.5 text-[11px] text-zinc-400">
                <MapPin className="w-2.5 h-2.5" />
                {post.location}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            id={`post-menu-btn-${post.id}`}
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 z-20 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 text-xs"
              onClick={() => setShowMenu(false)}
            >
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Share
              </button>
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Container with Double Tap Heart */}
      <div
        className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-950 overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.imageUrl}
          alt={post.caption || 'Post image'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Double Tap Floating Heart Animation */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-in duration-200">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-bounce" />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-3.5 sm:px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              id={`like-btn-${post.id}`}
              onClick={handleLike}
              className={cn(
                'p-1.5 -ml-1.5 rounded-lg transition-transform active:scale-125',
                post.isLiked
                  ? 'text-rose-500 hover:text-rose-600'
                  : 'text-zinc-700 dark:text-zinc-300 hover:text-rose-500'
              )}
              aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart
                className={cn('w-6 h-6', post.isLiked && 'fill-rose-500 stroke-rose-500')}
              />
            </button>

            <button
              id={`comment-btn-${post.id}`}
              onClick={() => {
                if (onOpenDetailModal) {
                  onOpenDetailModal(post);
                } else {
                  setShowComments(!showComments);
                }
              }}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 transition-colors"
              aria-label="Comment on post"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8]" />
            </button>

            <button
              id={`share-btn-${post.id}`}
              onClick={() => setIsShareModalOpen(true)}
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 transition-colors"
              aria-label="Share post"
            >
              <Send className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

          <button
            id={`save-btn-${post.id}`}
            onClick={handleSave}
            className={cn(
              'p-1.5 -mr-1.5 rounded-lg transition-transform active:scale-125',
              post.isSaved
                ? 'text-zinc-900 dark:text-white'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            )}
            aria-label={post.isSaved ? 'Remove from saved' : 'Save post'}
          >
            <Bookmark
              className={cn('w-6 h-6 stroke-[1.8]', post.isSaved && 'fill-current')}
            />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 mb-1">
          {formatNumber(post.likesCount)} {post.likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        <div className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed mb-1.5">
          <Link
            to={`/profile/${post.author.username}`}
            className="font-semibold text-zinc-950 dark:text-white mr-1.5 hover:underline"
          >
            {post.author.username}
          </Link>
          <span>
            {showFullCaption || post.caption.length <= 100
              ? post.caption
              : `${post.caption.slice(0, 100)}...`}
          </span>
          {post.caption.length > 100 && (
            <button
              onClick={() => setShowFullCaption(!showFullCaption)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 ml-1 font-medium text-[11px]"
            >
              {showFullCaption ? 'less' : 'more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments section toggle / preview */}
        <div className="mt-2">
          {showComments ? (
            <CommentSection
              postId={post.id}
              initialCommentsCount={post.commentsCount}
              onCommentAdded={() => {
                setPost((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
              }}
            />
          ) : (
            <button
              id={`view-comments-preview-${post.id}`}
              onClick={() => setShowComments(true)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium"
            >
              {post.commentsCount > 0
                ? `View all ${post.commentsCount} comments`
                : 'Add a comment...'}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-2 font-medium">
          {formatTimeAgo(post.createdAt)}
        </p>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={post}
      />
    </article>
  );
};
