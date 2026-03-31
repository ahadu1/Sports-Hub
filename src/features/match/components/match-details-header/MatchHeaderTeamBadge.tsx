import { useImageLoadState } from '@/hooks/useImageLoadState';
import { cn } from '@/utils/cn';

type MatchHeaderTeamBadgeProps = {
  alt: string;
  fallbackLabel: string;
  src: string;
};

export function MatchHeaderTeamBadge({ alt, fallbackLabel, src }: MatchHeaderTeamBadgeProps) {
  const imageState = useImageLoadState(src);

  if (imageState === 'error' || !src) {
    return (
      <div aria-label={alt} className="matchDetailsHeader__teamBadgeFallback" role="img">
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
      />
    </div>
  );
}
