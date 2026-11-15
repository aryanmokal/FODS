import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { feedApi } from '../../services/api/feedApi';
import { userApi } from '../../services/api/userApi';
import { Post, User } from '../../types';
import { PostCard } from '../../components/post/PostCard';
import { StoriesBar } from '../../components/stories/StoriesBar';
import { UserAvatar } from '../../components/common/UserAvatar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { EmptyState } from '../../components/common/EmptyState';
import { PostDetailModal } from '../../components/post/PostDetailModal';
import { useAuth } from '../../hooks/useAuth';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [feedData, suggestions] = await Promise.all([
        feedApi.getFeed(1, 10),
        feedApi.getSuggestedUsers(),
      ]);
      setPosts(feedData.items);
      setHasMore(feedData.hasMore);
      setSuggestedUsers(suggestions);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const feedData = await feedApi.getFeed(nextPage, 5);
      setPosts((prev) => [...prev, ...feedData.items]);
      setPage(nextPage);
      setHasMore(feedData.hasMore);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFollowToggle = async (userId: string | number) => {
    try {
      const target = suggestedUsers.find((u) => u.id === userId);
      if (!target) return;
      const res = target.isFollowing
        ? await userApi.unfollowUser(userId)
        : await userApi.followUser(userId);

      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: res.isFollowing } : u
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostDeleted = (deletedId: string | number) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
    if (selectedPost && selectedPost.id === deletedId) {
      setSelectedPost(null);
    }
  };

  const handlePostUpdated = (updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedPost && selectedPost.id === updated.id) {
      setSelectedPost(updated);
    }
  };

  return (
    <div id="home-feed-page" className="w-full flex justify-center gap-8">
      {/* Main Feed Column */}
      <div className="w-full max-w-xl">
        {/* Stories bar */}
        <StoriesBar />

        {/* Feed Status States */}
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" text="Loading visual stories..." />
          </div>
        ) : error ? (
          <ErrorAlert
            title="Could not load your feed"
            message={error}
            onRetry={loadFeed}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No posts in your feed yet"
            description="Explore trending photographers, data science creators, and architects to follow."
            actionLabel="Discover Creators"
            onAction={() => window.location.assign('/explore')}
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
                onOpenDetailModal={(p) => setSelectedPost(p)}
              />
            ))}

            {hasMore && (
              <div className="pt-2 pb-6 text-center">
                <button
                  id="feed-load-more-btn"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading more posts...' : 'Load older posts'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right-Hand Suggested Sidebar (Desktop Wide) */}
      <aside className="hidden xl:block w-72 shrink-0 space-y-6 select-none sticky top-8 h-fit">
        {/* Current User Brief */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-3 min-w-0"
            >
              <UserAvatar src={user.avatarUrl} alt={user.displayName} size="md" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  {user.username}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">{user.displayName}</p>
              </div>
            </Link>
            <Link
              to={`/profile/${user.username}`}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline px-2"
            >
              Profile
            </Link>
          </div>
        )}

        {/* Suggested Creators */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Suggested for you
            </span>
            <Link
              to="/explore"
              className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="space-y-3">
            {suggestedUsers.slice(0, 5).map((suggested) => (
              <div
                key={suggested.id}
                className="flex items-center justify-between text-xs"
              >
                <Link
                  to={`/profile/${suggested.username}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1 group"
                >
                  <UserAvatar
                    src={suggested.avatarUrl}
                    alt={suggested.displayName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:underline">
                        {suggested.username}
                      </p>
                      {suggested.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-indigo-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {suggested.followersCount} followers
                    </p>
                  </div>
                </Link>

                <button
                  id={`suggested-follow-btn-${suggested.id}`}
                  onClick={() => handleFollowToggle(suggested.id)}
                  className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                    suggested.isFollowing
                      ? 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 hover:text-rose-500'
                      : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
                  }`}
                >
                  {suggested.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-2 text-[11px] text-zinc-400 leading-relaxed">
          <p>© 2026 InstaDS Frontend • Built for FastAPI & PostgreSQL Integration</p>
        </div>
      </aside>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
};
