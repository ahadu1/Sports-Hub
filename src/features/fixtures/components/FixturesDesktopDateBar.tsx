import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import type { MonthChangeEventHandler } from 'react-day-picker';

import { FixturesDesktopCalendarPopover } from './FixturesDesktopCalendarPopover';

type FixturesDesktopDateBarProps = {
  selectedDate: Date;
  visibleMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

export function FixturesDesktopDateBar({
  selectedDate,
  visibleMonth,
  onPrevious,
  onNext,
  onOpenCalendar,
  onSelectDate,
  onMonthChange,
}: FixturesDesktopDateBarProps) {
  return (
    <div className="hidden h-14 items-center justify-between gap-6 rounded-lg bg-app-surface px-4 py-2 lg:flex">
      <ArrowButton ariaLabel="Show previous fixtures date" direction="left" onClick={onPrevious} />
      <div className="flex flex-1 items-center justify-center">
        <FixturesDesktopCalendarPopover
          selectedDate={selectedDate}
          visibleMonth={visibleMonth}
          onOpen={onOpenCalendar}
          onSelectDate={onSelectDate}
          onMonthChange={onMonthChange}
        />
      </div>
      <ArrowButton ariaLabel="Show next fixtures date" direction="right" onClick={onNext} />
    </div>
  );
}

type ArrowButtonProps = {
  ariaLabel: string;
  direction: 'left' | 'right';
  onClick: () => void;
};

function ArrowButton({ ariaLabel, direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-app-text outline-none transition hover:bg-white/5 hover:text-app-brand-secondary focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface"
      onClick={onClick}
    >
      {direction === 'left' ? (
        <ChevronLeftIcon className="h-[18px] w-[18px]" />
      ) : (
        <ChevronRightIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
