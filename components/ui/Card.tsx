import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Card container minimalis dengan efek hover halus
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ink-200 bg-white p-5 shadow-soft',
        'transition-all duration-300',
        className,
      )}
      {...props}
    />
  );
}
