import FootballSvg from './football.svg?react';
import type { IconSvgProps } from './types';

export function FootballIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <FootballSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6 shrink-0'} {...props} />
  );
}
