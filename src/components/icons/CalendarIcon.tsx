import type { ImgHTMLAttributes } from 'react';

import calendarIconUrl from './icon-calendar.svg';

type CalendarIconProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;

export function CalendarIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: CalendarIconProps) {
  return (
    <img
      src={calendarIconUrl}
      alt=""
      aria-hidden={ariaHidden}
      className={className ?? 'h-6 w-6'}
      {...props}
    />
  );
}
