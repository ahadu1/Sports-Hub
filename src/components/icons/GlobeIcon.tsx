import GlobeSvg from './globe.svg?react';
import type { IconSvgProps } from './types';

export function GlobeIcon({ className, 'aria-hidden': ariaHidden = true, ...props }: IconSvgProps) {
  return (
    <GlobeSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6 shrink-0'} {...props} />
  );
}
