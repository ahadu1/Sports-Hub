import { CloseIcon } from '@/components/icons';
import { LoadingState } from '@/components/ui/LoadingState';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { MonthChangeEventHandler } from 'react-day-picker';
import { Suspense, lazy } from 'react';

import { getMonthCaption } from './date-selector/date-selector.utils';

const FixturesDayPickerCalendar = lazy(async () => {
  const module = await import('./FixturesDayPickerCalendar');

  return { default: module.FixturesDayPickerCalendar };
});

type FixturesMobileCalendarDialogProps = {
  selectedDate: Date;
  visibleMonth: Date;
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

export function FixturesMobileCalendarDialog({
  selectedDate,
  visibleMonth,
  isOpen,
  onClose,
  onSelectDate,
  onMonthChange,
}: FixturesMobileCalendarDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-[1px]" />

      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel className="flex w-full max-w-[820px] flex-col gap-4 rounded-t-3xl border border-b-0 border-app-border-base bg-app-surface px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_28px_rgba(0,0,0,0.38)]">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="app-type-inter-16-24-semibold text-white">
              {getMonthCaption(visibleMonth)}
            </DialogTitle>
            <button
              type="button"
              aria-label="Close fixtures calendar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-app-border-base bg-app-muted text-app-text transition hover:border-app-brand-secondary hover:text-app-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface"
              onClick={onClose}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-2xl bg-app-surface">
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
                  onClose();
                }}
              />
            </Suspense>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
