import UkFlagSvg from './uk-flag.svg?react';
import type { IconSvgProps } from './types';

export function UkFlagIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <UkFlagSvg aria-hidden={ariaHidden} className={className ?? 'h-6 w-6 shrink-0'} {...props} />
  );
}
