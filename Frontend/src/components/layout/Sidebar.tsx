import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  PlusSquare,
  Heart,
  Bookmark,
  User as UserIcon,
  LogOut,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { UserAvatar } from '../common/UserAvatar';
import { cn } from '../../utils/cn';

interface SidebarProps {
  onOpenCreateModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateModal }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    {
      label: 'Create',
      icon: PlusSquare,
      path: '/create',
      onClick: (e: React.MouseEvent) => {
        if (onOpenCreateModal) {
          e.preventDefault();
          onOpenCreateModal();
        }
      },
    },
    {
      label: 'Notifications',
      icon: Heart,
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Saved', icon: Bookmark, path: '/saved' },
    {
      label: 'Profile',
      icon: UserIcon,
      path: user ? `/profile/${user.username}` : '/login',
      customAvatar: user?.avatarUrl,
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className="hidden md:flex flex-col justify-between w-18 lg:w-64 h-screen sticky top-0 px-3 lg:px-4 py-6 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 select-none z-30 shrink-0"
    >
      {/* Brand Header */}
      <div>
        <NavLink
          to="/"
          id="sidebar-brand-logo"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-900 dark:text-white font-bold tracking-tight text-xl hover:opacity-90 transition-opacity mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="hidden lg:inline text-xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-white bg-clip-text text-transparent">
            InstaDS
          </span>
        </NavLink>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={item.onClick}
                id={`sidebar-nav-${item.label.toLowerCase()}`}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-4 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 group',
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative shrink-0 flex items-center justify-center">
                      {item.customAvatar ? (
                        <UserAvatar
                          src={item.customAvatar}
                          alt={user?.displayName || 'User'}
                          size="xs"
                          className={cn('transition-transform', isActive && 'ring-2 ring-indigo-500')}
                        />
                      ) : (
                        <Icon
                          className={cn(
                            'w-6 h-6 transition-transform group-hover:scale-105',
                            isActive ? 'stroke-[2.5] text-indigo-600 dark:text-indigo-400' : 'stroke-[1.8]'
                          )}
                        />
                      )}
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </div>
                    <span className="hidden lg:inline truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User / Bottom Menu */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
        {user && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50">
            <UserAvatar src={user.avatarUrl} alt={user.displayName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user.displayName}
              </p>
              <p className="text-[11px] text-zinc-400 truncate">@{user.username}</p>
            </div>
          </div>
        )}

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-3.5 py-2.5 rounded-xl font-medium text-sm text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-150 group"
          title="Log out"
        >
          <LogOut className="w-5 h-5 shrink-0 stroke-[1.8] group-hover:scale-105" />
          <span className="hidden lg:inline text-xs">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
