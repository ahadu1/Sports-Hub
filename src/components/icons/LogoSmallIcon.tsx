import LogoSmallSvg from './Lgo-small.svg?react';
import type { IconSvgProps } from './types';

export function LogoSmallIcon({
  className,
  'aria-hidden': ariaHidden = true,
  ...props
}: IconSvgProps) {
  return (
    <LogoSmallSvg
      aria-hidden={ariaHidden}
      className={className ?? 'h-[26.1px] w-auto shrink-0'}
      {...props}
    />
  );
}
