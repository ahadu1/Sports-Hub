import { CalendarIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';
import type { MonthChangeEventHandler } from 'react-day-picker';

import { FixturesMobileCalendarDialog } from './FixturesMobileCalendarDialog';
import {
  getMobileDateBottomLabel,
  getMobileDateTopLabel,
  getMobileRibbonDates,
  isSameCalendarDay,
} from './date-selector/date-selector.utils';

type FixturesMobileDateRibbonProps = {
  selectedDate: Date;
  visibleMonth: Date;
  mobileCalendarOpen: boolean;
  onSelectDate: (date: Date) => void;
  onOpenCalendar: () => void;
  onCloseCalendar: () => void;
  onMonthChange: MonthChangeEventHandler;
};

export function FixturesMobileDateRibbon({
  selectedDate,
  visibleMonth,
  mobileCalendarOpen,
  onSelectDate,
  onOpenCalendar,
  onCloseCalendar,
  onMonthChange,
}: FixturesMobileDateRibbonProps) {
  const ribbonDates = getMobileRibbonDates(selectedDate);

  return (
    <>
      <div className="flex min-h-[71px] items-center gap-2 lg:hidden">
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          {ribbonDates.map((date, index) => {
            const isSelected = isSameCalendarDay(date, selectedDate);
            const toneClass = isSelected
              ? 'text-app-brand-secondary'
              : index === 0 || index === ribbonDates.length - 1
                ? 'text-app-text-subtle'
                : 'text-app-text';

            return (
              <button
                key={date.toISOString()}
                type="button"
                aria-pressed={isSelected}
                className={cn(
                  'app-fixtures-date-cell outline-none transition hover:text-app-brand-secondary focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-canvas',
                  isSelected && 'app-fixtures-date-cell--selected',
                )}
                onClick={() => onSelectDate(date)}
              >
                <span className="flex flex-col items-center justify-center text-center">
                  <span className={cn('app-type-inter-12-16-normal', toneClass)}>
                    {getMobileDateTopLabel(date, selectedDate)}
                  </span>
                  <span className={cn('app-type-inter-12-16-normal', toneClass)}>
                    {getMobileDateBottomLabel(date)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Open fixtures calendar"
          aria-haspopup="dialog"
          aria-expanded={mobileCalendarOpen}
          className="app-fixtures-calendar-trigger outline-none transition hover:text-app-brand-secondary focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-canvas"
          onClick={onOpenCalendar}
        >
          <CalendarIcon />
        </button>
      </div>
      <FixturesMobileCalendarDialog
        selectedDate={selectedDate}
        visibleMonth={visibleMonth}
        isOpen={mobileCalendarOpen}
        onClose={onCloseCalendar}
        onSelectDate={onSelectDate}
        onMonthChange={onMonthChange}
      />
    </>
  );
}
