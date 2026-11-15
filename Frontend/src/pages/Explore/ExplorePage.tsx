import React, { useState, useEffect, useCallback } from 'react';
import { Search, Hash, User as UserIcon, X, Sparkles, Filter } from 'lucide-react';
import { feedApi } from '../../services/api/feedApi';
import { userApi } from '../../services/api/userApi';
import { Post, User } from '../../types';
import { PostGrid } from '../../components/post/PostGrid';
import { PostDetailModal } from '../../components/post/PostDetailModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { UserAvatar } from '../../components/common/UserAvatar';
import { useDebounce } from '../../hooks/useDebounce';
import { Link } from 'react-router-dom';

const TRENDING_TAGS = [
  'All',
  'MachineLearning',
  'Architecture',
  'DataScience',
  'Tokyo',
  'Minimalism',
  'Hardware',
  'Setup',
  'Kyoto',
];

export const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const fetchExploreData = useCallback(async () => {
    try {
      setIsLoading(true);
      const tag = selectedTag === 'All' ? undefined : selectedTag;
      const explorePosts = await feedApi.getExplorePosts(debouncedQuery || undefined, tag);
      setPosts(explorePosts);

      if (debouncedQuery.trim()) {
        const users = await userApi.searchUsers(debouncedQuery);
        setMatchedUsers(users);
      } else {
        setMatchedUsers([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, selectedTag]);

  useEffect(() => {
    fetchExploreData();
  }, [fetchExploreData]);

  return (
    <div id="explore-page-root" className="w-full max-w-4xl space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="explore-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, keywords, locations, or topics..."
            className="w-full pl-10 pr-10 py-3 text-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trending Tags Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TRENDING_TAGS.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80'
                }`}
              >
                {tag === 'All' ? '✨ Explore All' : `#${tag}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched Users Section (if query present) */}
      {matchedUsers.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-xs">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-indigo-500" /> People
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedUsers.map((u) => (
              <Link
                key={u.id}
                to={`/profile/${u.username}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                <UserAvatar src={u.avatarUrl} alt={u.displayName} size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                    {u.displayName}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">@{u.username}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Discovering curated photography & ideas..." />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No posts found"
          description={`We couldn't find any media matching "${searchQuery || selectedTag}". Try another tag or search term.`}
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedTag('All');
          }}
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-zinc-500 font-medium">
            <span>Showing {posts.length} trending posts</span>
          </div>
          <PostGrid posts={posts} onSelectPost={(p) => setSelectedPost(p)} />
        </div>
      )}

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostUpdated={(updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }}
      />
    </div>
  );
};
