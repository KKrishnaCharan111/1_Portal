import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glass, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200 border',
        glass
          ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
