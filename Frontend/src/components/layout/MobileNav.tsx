import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusSquare, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { UserAvatar } from '../common/UserAvatar';
import { cn } from '../../utils/cn';

interface MobileNavProps {
  onOpenCreateModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenCreateModal }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between"
    >
      <NavLink
        to="/"
        id="mobilenav-home"
        className={({ isActive }) =>
          cn(
            'p-2 rounded-xl transition-colors',
            isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'
          )
        }
      >
        {({ isActive }) => <Home className={cn('w-6 h-6', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />}
      </NavLink>

      <NavLink
        to="/explore"
        id="mobilenav-explore"
        className={({ isActive }) =>
          cn(
            'p-2 rounded-xl transition-colors',
            isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'
          )
        }
      >
        {({ isActive }) => <Compass className={cn('w-6 h-6', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />}
      </NavLink>

      <button
        id="mobilenav-create-btn"
        onClick={onOpenCreateModal}
        className="p-2 rounded-xl text-zinc-900 dark:text-white active:scale-95 transition-transform"
        aria-label="Create Post"
      >
        <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs">
          <PlusSquare className="w-5 h-5 stroke-[2.2]" />
        </div>
      </button>

      <NavLink
        to="/notifications"
        id="mobilenav-notifications"
        className={({ isActive }) =>
          cn(
            'relative p-2 rounded-xl transition-colors',
            isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400'
          )
        }
      >
        {({ isActive }) => (
          <>
            <Heart className={cn('w-6 h-6', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to={user ? `/profile/${user.username}` : '/login'}
        id="mobilenav-profile"
        className={({ isActive }) =>
          cn(
            'p-1 rounded-full transition-transform',
            isActive && 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950'
          )
        }
      >
        <UserAvatar
          src={user?.avatarUrl}
          alt={user?.displayName || 'Profile'}
          size="xs"
        />
      </NavLink>
    </nav>
  );
};
