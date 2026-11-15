import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, Bookmark, Heart } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const TopHeader: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <header
      id="mobile-top-header"
      className="md:hidden sticky top-0 z-30 h-14 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 px-4 flex items-center justify-between"
    >
      <NavLink
        to="/"
        id="topheader-brand"
        className="flex items-center gap-2 font-bold tracking-tight text-lg text-zinc-900 dark:text-white"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
          <Layers className="w-4 h-4" />
        </div>
        <span className="font-extrabold tracking-tight">InstaDS</span>
      </NavLink>

      <div className="flex items-center gap-2">
        <NavLink
          to="/saved"
          id="topheader-saved"
          className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          aria-label="Saved posts"
        >
          <Bookmark className="w-5 h-5 stroke-[1.8]" />
        </NavLink>
        <NavLink
          to="/notifications"
          id="topheader-notifs"
          className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Heart className="w-5 h-5 stroke-[1.8]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </NavLink>
      </div>
    </header>
  );
};
