import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'brand' | 'sage';
  showLabel?: boolean;
  className?: string;
}

// Progress bar minimalis dengan animasi isi yang smooth
export function ProgressBar({
  value,
  color = 'brand',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));
  const barColor = color === 'sage' ? 'bg-sage-500' : 'bg-brand-500';

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            barColor,
          )}
          style={{ width: `${safeValue}%` }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs font-medium text-ink-500">
          {safeValue}% selesai
        </p>
      )}
    </div>
  );
}
