import ChevronRightSvg from './chevron-right.svg?react';
import type { IconSvgProps } from './types';

export function ChevronRightIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <ChevronRightSvg
      aria-hidden={ariaHidden}
      className={className ?? 'h-5 w-5 shrink-0'}
      {...props}
    />
  );
}
