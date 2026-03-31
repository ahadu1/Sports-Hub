import ArrowLeftSvg from './icon-arrow-left.svg?react';
import type { IconSvgProps } from './types';

export function ArrowLeftIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <ArrowLeftSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6 shrink-0'} {...props} />
  );
}
