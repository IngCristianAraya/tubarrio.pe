'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormLoadingProps {
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FormLoading({
  isLoading = true,
  loadingText = 'Enviando...',
  className,
  size = 'md',
}: FormLoadingProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center justify-center gap-2 text-sm',
        className
      )}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {loadingText && <span>{loadingText}</span>}
    </div>
  );
}

export function InlineFormLoading({ className }: { className?: string }) {
  return (
    <span 
      className={cn('inline-flex items-center gap-1', className)}
      aria-hidden="true"
    >
      <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-current" />
      <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-current delay-150" />
      <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-current delay-300" />
    </span>
  );
}
