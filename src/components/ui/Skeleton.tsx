import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isRounded?: boolean;
}

export function Skeleton({ className, isRounded = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        isRounded && 'rounded-md',
        className
      )}
      {...props}
    />
  );
}

interface SkeletonTextProps extends SkeletonProps {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
}

export function SkeletonText({
  lines = 1,
  lineHeight = 4,
  spacing = 2,
  className,
  ...props
}: SkeletonTextProps) {
  return (
    <div className="flex flex-col space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            `h-${lineHeight}`,
            i < lines - 1 ? `mb-${spacing}` : '',
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps extends SkeletonProps {
  height?: number;
  hasImage?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  hasFooter?: boolean;
}

export function SkeletonCard({
  height = 300,
  hasImage = true,
  hasTitle = true,
  hasDescription = true,
  hasFooter = true,
  className,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn('flex flex-col space-y-3 p-4', className)}
      style={{ height: `${height}px` }}
      {...props}
    >
      {hasImage && (
        <Skeleton className="h-48 w-full rounded-t-lg" isRounded={false} />
      )}
      <div className="space-y-2 p-2">
        {hasTitle && <Skeleton className="h-6 w-3/4" />}
        {hasDescription && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
      </div>
      {hasFooter && (
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      )}
    </div>
  );
}
