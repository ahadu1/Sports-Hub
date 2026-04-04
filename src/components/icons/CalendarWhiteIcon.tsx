import CalendarWhiteSvg from './icon-calendar-white.svg?react';
import type { IconSvgProps } from './types';

export function CalendarWhiteIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <CalendarWhiteSvg
      aria-hidden={ariaHidden}
      className={className ?? 'h-6 w-6 shrink-0'}
      {...props}
    />
  );
}
