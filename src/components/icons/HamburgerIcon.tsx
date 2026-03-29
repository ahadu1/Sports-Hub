import HamburgerSvg from './hamburger.svg?react';
import type { IconSvgProps } from './types';

export function HamburgerIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return <HamburgerSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6'} {...props} />;
}
