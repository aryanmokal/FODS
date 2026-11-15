import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark } from 'lucide-react';
import { postApi } from '../../services/api/postApi';
import { Post } from '../../types';
import { PostGrid } from '../../components/post/PostGrid';
import { PostDetailModal } from '../../components/post/PostDetailModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedPostsPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const loadSaved = useCallback(async () => {
    try {
      setIsLoading(true);
      const posts = await postApi.getSavedPosts();
      setSavedPosts(posts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  return (
    <div id="saved-posts-page" className="w-full max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Bookmark className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Saved Posts
          </h1>
          <p className="text-xs text-zinc-500">Only you can see what you&apos;ve saved</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" text="Loading saved items..." />
        </div>
      ) : savedPosts.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved posts yet"
          description="Save photos and architecture shots to revisit them anytime."
          actionLabel="Explore Feed"
          onAction={() => window.location.assign('/')}
        />
      ) : (
        <PostGrid posts={savedPosts} onSelectPost={(p) => setSelectedPost(p)} />
      )}

      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostUpdated={(updated) => {
          setSavedPosts((prev) =>
            updated.isSaved
              ? prev.map((p) => (p.id === updated.id ? updated : p))
              : prev.filter((p) => p.id !== updated.id)
          );
        }}
      />
    </div>
  );
};
