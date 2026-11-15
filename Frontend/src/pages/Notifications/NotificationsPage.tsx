import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, AtSign, Check, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { UserAvatar } from '../../components/common/UserAvatar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatTimeAgo } from '../../utils/formatters';
import { NotificationType } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | NotificationType>('all');

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-sky-500" />;
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getMessage = (type: NotificationType, commentText?: string) => {
    switch (type) {
      case 'like':
        return 'liked your post.';
      case 'comment':
        return commentText ? `commented: "${commentText}"` : 'commented on your post.';
      case 'follow':
        return 'started following you.';
      case 'mention':
        return 'mentioned you in a post.';
    }
  };

  return (
    <div id="notifications-page-root" className="w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-zinc-500">Stay updated on interactions with your content</p>
        </div>

        <button
          onClick={markAllAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
        >
          <Check className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'like', 'comment', 'follow'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50'
            }`}
          >
            {tab === 'all' ? 'All Activity' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="md" text="Loading notifications..." />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="When someone likes, comments, or follows you, you'll see it here."
          />
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                id={`notification-row-${notif.id}`}
                onClick={() => markAsRead(notif.id)}
                className={`flex items-center gap-3.5 p-4 transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${
                  !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                }`}
              >
                {/* User avatar with action badge */}
                <div className="relative shrink-0">
                  <UserAvatar
                    src={notif.actor.avatarUrl}
                    alt={notif.actor.displayName}
                    size="md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center ring-2 ring-white dark:ring-zinc-900 shadow-xs">
                    {getIcon(notif.type)}
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-zinc-800 dark:text-zinc-200 leading-snug">
                    <Link
                      to={`/profile/${notif.actor.username}`}
                      className="font-bold text-zinc-900 dark:text-white mr-1 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notif.actor.username}
                    </Link>
                    {getMessage(notif.type, notif.commentText)}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {formatTimeAgo(notif.createdAt)}
                  </p>
                </div>

                {/* Post Preview Thumbnail */}
                {notif.post && (
                  <div className="shrink-0 w-11 h-11 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={notif.post.imageUrl}
                      alt="Post thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
