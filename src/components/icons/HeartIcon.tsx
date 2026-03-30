import HeartSvg from './heart.svg?react';
import type { IconSvgProps } from './types';

export function HeartIcon({ className, 'aria-hidden': ariaHidden = true, ...props }: IconSvgProps) {
  return (
    <HeartSvg aria-hidden={ariaHidden} className={className ?? 'h-4 w-4 shrink-0'} {...props} />
  );
}
