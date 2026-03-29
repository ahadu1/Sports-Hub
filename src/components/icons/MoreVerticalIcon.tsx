import MoreVerticalSvg from './more-vertical.svg?react';
import type { IconSvgProps } from './types';

export function MoreVerticalIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return <MoreVerticalSvg aria-hidden={ariaHidden} className={className ?? 'h-4 w-4'} {...props} />;
}
