import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Grid,
  Bookmark,
  Tag,
  Settings,
  Globe,
  CheckCircle2,
  Share2,
  Camera,
} from 'lucide-react';
import { userApi } from '../../services/api/userApi';
import { postApi } from '../../services/api/postApi';
import { User, Post } from '../../types';
import { UserAvatar } from '../../components/common/UserAvatar';
import { PostGrid } from '../../components/post/PostGrid';
import { PostDetailModal } from '../../components/post/PostDetailModal';
import { EditProfileModal } from './EditProfileModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { useAuth } from '../../hooks/useAuth';
import { formatNumber } from '../../utils/formatters';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isSelf =
    currentUser &&
    profileUser &&
    currentUser.username.toLowerCase() === profileUser.username.toLowerCase();

  const loadProfile = useCallback(async () => {
    if (!username) return;
    try {
      setIsLoading(true);
      setError(null);
      const targetUser = await userApi.getUserByUsername(username);
      setProfileUser(targetUser);
      setIsFollowing(!!targetUser.isFollowing);

      const userPosts = await userApi.getUserPosts(username);
      setPosts(userPosts);

      if (
        currentUser &&
        currentUser.username.toLowerCase() === username.toLowerCase()
      ) {
        const saved = await postApi.getSavedPosts();
        setSavedPosts(saved);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [username, currentUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFollowToggle = async () => {
    if (!profileUser || followLoading) return;
    try {
      setFollowLoading(true);
      const res = isFollowing
        ? await userApi.unfollowUser(profileUser.id)
        : await userApi.followUser(profileUser.id);
      setIsFollowing(res.isFollowing);
      setProfileUser((prev) =>
        prev
          ? {
              ...prev,
              followersCount: res.followersCount,
              isFollowing: res.isFollowing,
            }
          : null
      );
    } catch (e) {
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleProfileUpdated = (updated: User) => {
    setProfileUser(updated);
    if (isSelf) {
      updateUser(updated);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 w-full flex justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="w-full max-w-xl py-12">
        <ErrorAlert
          title="User not found"
          message={error || 'This user profile could not be loaded.'}
          onRetry={loadProfile}
        />
      </div>
    );
  }

  return (
    <div id="profile-page-container" className="w-full max-w-4xl space-y-8">
      {/* Profile Header Block */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          {/* Avatar with Story Ring */}
          <div className="shrink-0">
            <UserAvatar
              src={profileUser.avatarUrl}
              alt={profileUser.displayName}
              size="xl"
            />
          </div>

          {/* User Meta Information */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {profileUser.username}
                </h1>
                {profileUser.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2">
                {isSelf ? (
                  <>
                    <button
                      id="edit-profile-btn"
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-4 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      id="profile-settings-btn"
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                      aria-label="Profile settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    id="profile-follow-btn"
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-5 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-xs ${
                      isFollowing
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 hover:text-rose-600'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* Counts Counter Bar */}
            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white font-bold mr-1">
                  {formatNumber(posts.length)}
                </strong>
                posts
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white font-bold mr-1">
                  {formatNumber(profileUser.followersCount)}
                </strong>
                followers
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white font-bold mr-1">
                  {formatNumber(profileUser.followingCount)}
                </strong>
                following
              </span>
            </div>

            {/* Bio Details */}
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-zinc-900 dark:text-white">
                {profileUser.displayName}
              </p>
              {profileUser.bio && (
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg">
                  {profileUser.bio}
                </p>
              )}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
                >
                  <Globe className="w-3 h-3" />
                  {profileUser.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 flex justify-center gap-12 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          id="profile-tab-posts"
          className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>POSTS</span>
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            id="profile-tab-saved"
            className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
              activeTab === 'saved'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>SAVED</span>
          </button>
        )}
      </div>

      {/* Posts Content */}
      <div>
        {activeTab === 'posts' ? (
          posts.length === 0 ? (
            <EmptyState
              icon={Camera}
              title="No Posts Yet"
              description={
                isSelf
                  ? 'Share your first photo or research visual with the community.'
                  : `@${profileUser.username} hasn't posted anything yet.`
              }
            />
          ) : (
            <PostGrid posts={posts} onSelectPost={(p) => setSelectedPost(p)} />
          )
        ) : (
          savedPosts.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No Saved Posts"
              description="Save photos and architecture shots to revisit them later."
            />
          ) : (
            <PostGrid
              posts={savedPosts}
              onSelectPost={(p) => setSelectedPost(p)}
            />
          )
        )}
      </div>

      {/* Edit Profile Modal */}
      {isSelf && (
        <EditProfileModal
          user={profileUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={handleProfileUpdated}
        />
      )}

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPostUpdated={(updated) => {
          setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setSavedPosts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
        }}
      />
    </div>
  );
};
