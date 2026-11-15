import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story } from '../../types';
import { feedApi } from '../../services/api/feedApi';
import { UserAvatar } from '../common/UserAvatar';
import { useAuth } from '../../hooks/useAuth';

export const StoriesBar: React.FC = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    feedApi.getStories().then(setStories).catch(console.error);
  }, []);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <>
      <div
        id="stories-carousel-bar"
        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-3.5 mb-6 shadow-xs overflow-x-auto no-scrollbar flex items-center gap-4 select-none"
      >
        {/* Your Story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative">
            <UserAvatar
              src={user?.avatarUrl}
              alt={user?.displayName || 'Your story'}
              size="md"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-xs group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 max-w-[64px] truncate">
            Your story
          </span>
        </div>

        {/* Other users' stories */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            id={`story-item-${story.id}`}
            onClick={() => setActiveStoryIndex(index)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <UserAvatar
              src={story.user.avatarUrl}
              alt={story.user.displayName}
              size="md"
              hasStory={true}
              storySeen={story.seen}
            />
            <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 max-w-[64px] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {story.user.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div
          id="story-viewer-dialog"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
        >
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {activeStoryIndex > 0 && (
            <button
              onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition-colors hidden sm:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {activeStoryIndex < stories.length - 1 && (
            <button
              onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition-colors hidden sm:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="relative w-full max-w-sm aspect-[9/16] bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col justify-between">
            {/* Header info */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center gap-3">
              <UserAvatar src={activeStory.user.avatarUrl} alt={activeStory.user.displayName} size="sm" />
              <div className="text-white">
                <p className="text-xs font-semibold">{activeStory.user.username}</p>
                <p className="text-[10px] text-zinc-300">InstaDS Story</p>
              </div>
            </div>

            <img
              src={activeStory.mediaUrl}
              alt="Story content"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
};
