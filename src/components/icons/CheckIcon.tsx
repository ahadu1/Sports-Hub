import CheckSvg from './check.svg?react';
import type { IconSvgProps } from './types';

export function CheckIcon({ className, 'aria-hidden': ariaHidden = true, ...props }: IconSvgProps) {
  return (
    <CheckSvg aria-hidden={ariaHidden} className={className ?? 'h-2.5 w-2.5 shrink-0'} {...props} />
  );
}
