import LiveSvg from './live.svg?react';
import type { IconSvgProps } from './types';

export function LiveIcon({ className, 'aria-hidden': ariaHidden = true, ...props }: IconSvgProps) {
  return (
    <LiveSvg aria-hidden={ariaHidden} className={className ?? 'h-4 w-4 shrink-0'} {...props} />
  );
}
