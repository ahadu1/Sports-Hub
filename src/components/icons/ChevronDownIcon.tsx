import clsx from 'clsx';

import ChevronDownSvg from './chevron-down.svg?react';
import type { IconSvgProps } from './types';

export type ChevronDownIconProps = IconSvgProps & {
  /** When true, rotates 180° (e.g. accordion open state). */
  isOpen?: boolean;
};

export function ChevronDownIcon({
  className,
  isOpen,
  'aria-hidden': ariaHidden = true,
  ...props
}: ChevronDownIconProps) {
  return (
    <ChevronDownSvg
      aria-hidden={ariaHidden}
      className={clsx('h-[18px] w-[18px] transition-transform', isOpen && 'rotate-180', className)}
      {...props}
    />
  );
}
