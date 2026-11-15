import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface PostGridProps {
  posts: Post[];
  onSelectPost?: (post: Post) => void;
}

export const PostGrid: React.FC<PostGridProps> = ({ posts, onSelectPost }) => {
  return (
    <div
      id="posts-thumbnail-grid"
      className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4 select-none"
    >
      {posts.map((post) => (
        <div
          key={post.id}
          id={`grid-post-${post.id}`}
          onClick={() => onSelectPost && onSelectPost(post)}
          className="group relative aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer shadow-xs border border-zinc-200/50 dark:border-zinc-800/50"
        >
          <img
            src={post.imageUrl}
            alt={post.caption || 'Post thumbnail'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Hover Overlay with Stats */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 sm:gap-6 text-white font-semibold text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 drop-shadow-md">
              <Heart className="w-4 h-4 fill-white" />
              {formatNumber(post.likesCount)}
            </span>
            <span className="flex items-center gap-1.5 drop-shadow-md">
              <MessageCircle className="w-4 h-4 fill-white" />
              {formatNumber(post.commentsCount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
