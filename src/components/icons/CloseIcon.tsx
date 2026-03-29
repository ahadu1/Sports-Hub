import CloseSvg from './close.svg?react';
import type { IconSvgProps } from './types';

export function CloseIcon({ className, 'aria-hidden': ariaHidden = true, ...props }: IconSvgProps) {
  return <CloseSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6'} {...props} />;
}
