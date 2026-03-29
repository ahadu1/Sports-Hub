import CalendarSvg from './calendar.svg?react';
import type { IconSvgProps } from './types';

export function CalendarIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return <CalendarSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6'} {...props} />;
}
