import { CalendarIcon } from '@/components/icons';
import { LoadingState } from '@/components/ui/LoadingState';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import type { MonthChangeEventHandler } from 'react-day-picker';
import { Suspense, lazy } from 'react';

import { getDesktopDateLabel } from './date-selector/date-selector.utils';

const FixturesDayPickerCalendar = lazy(async () => {
  const module = await import('./FixturesDayPickerCalendar');

  return { default: module.FixturesDayPickerCalendar };
});

type FixturesDesktopCalendarPopoverProps = {
  selectedDate: Date;
  visibleMonth: Date;
  onOpen: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

export function FixturesDesktopCalendarPopover({
  selectedDate,
  visibleMonth,
  onOpen,
  onSelectDate,
  onMonthChange,
}: FixturesDesktopCalendarPopoverProps) {
  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <PopoverButton
            type="button"
            className="flex items-center justify-center gap-2 text-app-text outline-none transition hover:text-app-brand-secondary focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface"
            aria-label={`Choose fixtures date, currently ${getDesktopDateLabel(selectedDate)}`}
            onClick={onOpen}
          >
            <CalendarIcon className="h-6 w-6" />
            <span className="app-type-inter-14-20-semibold">
              {getDesktopDateLabel(selectedDate)}
            </span>
          </PopoverButton>

          <PopoverPanel className="absolute left-1/2 top-[calc(100%+12px)] z-50 w-[320px] -translate-x-1/2 rounded-2xl border border-app-border-base bg-app-surface p-4 shadow-[0_18px_40px_rgba(0,0,0,0.42)]">
            <Suspense
              fallback={
                <div className="flex min-h-[320px] items-center justify-center">
                  <LoadingState className="justify-center" label="Loading calendar" />
                </div>
              }
            >
              <FixturesDayPickerCalendar
                selectedDate={selectedDate}
                visibleMonth={visibleMonth}
                onMonthChange={onMonthChange}
                onSelectDate={(date) => {
                  onSelectDate(date);
                  close();
                }}
              />
            </Suspense>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}
