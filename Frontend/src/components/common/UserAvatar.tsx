import React from 'react';
import { cn } from '../../utils/cn';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  hasStory?: boolean;
  storySeen?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl',
};

const storyRingClasses = {
  xs: 'p-[1.5px]',
  sm: 'p-[2px]',
  md: 'p-[2px]',
  lg: 'p-[3px]',
  xl: 'p-[4px]',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  hasStory = false,
  storySeen = false,
  className,
  onClick,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const initials = (alt || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const avatarElement = (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-600 dark:text-zinc-300 select-none shrink-0 border border-zinc-200/60 dark:border-zinc-800',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:opacity-90 transition-opacity'
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
          loading="lazy"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

  if (hasStory) {
    return (
      <div
        id={`avatar-story-wrap-${alt.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={onClick}
        className={cn(
          'rounded-full transition-transform active:scale-95',
          storyRingClasses[size],
          storySeen
            ? 'bg-zinc-300 dark:bg-zinc-700'
            : 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500',
          className
        )}
      >
        <div className="rounded-full p-[2px] bg-white dark:bg-zinc-950">
          {avatarElement}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('inline-block', className)} onClick={onClick}>
      {avatarElement}
    </div>
  );
};
