import ChevronLeftSvg from './chevron-left.svg?react';
import type { IconSvgProps } from './types';

export function ChevronLeftIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <ChevronLeftSvg
      aria-hidden={ariaHidden}
      className={className ?? 'h-[18px] w-[18px]'}
      {...props}
    />
  );
}
