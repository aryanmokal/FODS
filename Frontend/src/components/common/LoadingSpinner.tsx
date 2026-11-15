import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  fullPage = false,
}) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-6 text-zinc-500', className)}>
      <Loader2 className={cn('animate-spin text-zinc-800 dark:text-zinc-200', sizeMap[size])} />
      {text && <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};
