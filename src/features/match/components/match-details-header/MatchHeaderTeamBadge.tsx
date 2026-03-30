import { cn } from '@/lib/utils/cn';
import { useEffect, useState } from 'react';

type MatchHeaderTeamBadgeProps = {
  alt: string;
  fallbackLabel: string;
  src: string;
};

export function MatchHeaderTeamBadge({ alt, fallbackLabel, src }: MatchHeaderTeamBadgeProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(() =>
    src ? 'loading' : 'error',
  );

  useEffect(() => {
    setImageState(src ? 'loading' : 'error');
  }, [src]);

  if (imageState === 'error' || !src) {
    return (
      <div aria-label={alt} className="app-match-team-badge-fallback" role="img">
        {fallbackLabel.slice(0, 1)}
      </div>
    );
  }

  return (
    <div className="relative h-[42px] w-[42px]">
      {imageState !== 'loaded' ? (
        <span
          aria-hidden="true"
          className="loading loading-spinner loading-sm absolute inset-0 m-auto text-app-brand-secondary"
        />
      ) : null}
      <img
        alt={alt}
        className={cn(
          'h-[42px] w-[42px] object-contain transition-opacity',
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
        )}
        src={src}
        onError={() => setImageState('error')}
        onLoad={() => setImageState('loaded')}
      />
    </div>
  );
}
