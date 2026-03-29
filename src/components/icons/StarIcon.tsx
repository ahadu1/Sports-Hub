import StarSvg from './star.svg?react';
import type { IconSvgProps } from './types';

/** Filled star (e.g. favorites). */
export function StarIcon({ className, 'aria-hidden': ariaHidden = true, ...props }: IconSvgProps) {
  return (
    <StarSvg aria-hidden={ariaHidden} className={className ?? 'h-4 w-4 shrink-0'} {...props} />
  );
}
