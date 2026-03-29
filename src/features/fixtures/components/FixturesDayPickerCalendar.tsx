import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { DayPicker, type ChevronProps, type MonthChangeEventHandler } from 'react-day-picker';

type FixturesDayPickerCalendarProps = {
  selectedDate: Date;
  visibleMonth: Date;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

export function FixturesDayPickerCalendar({
  selectedDate,
  visibleMonth,
  onSelectDate,
  onMonthChange,
}: FixturesDayPickerCalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      month={visibleMonth}
      onMonthChange={onMonthChange}
      onSelect={(date) => {
        if (date) {
          onSelectDate(date);
        }
      }}
      fixedWeeks
      showOutsideDays={false}
      components={{
        Chevron: FixturesDayPickerChevron,
      }}
      classNames={{
        root: 'w-full text-app-text',
        months: 'w-full',
        month: 'w-full space-y-4',
        month_caption: 'relative flex items-center justify-center pb-1',
        caption_label: 'app-type-inter-16-24-semibold text-white',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous:
          'inline-flex h-8 w-8 items-center justify-center rounded-full border border-app-border-base bg-app-muted text-app-text transition hover:border-app-brand-secondary hover:text-app-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface',
        button_next:
          'inline-flex h-8 w-8 items-center justify-center rounded-full border border-app-border-base bg-app-muted text-app-text transition hover:border-app-brand-secondary hover:text-app-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface',
        chevron: 'h-4 w-4',
        month_grid: 'w-full border-collapse',
        weekdays: 'grid grid-cols-7 gap-y-2',
        weekday:
          'flex h-8 items-center justify-center text-center app-type-inter-12-16-semibold uppercase tracking-[0.08em] text-app-text-subtle',
        weeks: 'grid gap-y-1',
        week: 'grid grid-cols-7',
        day: 'flex items-center justify-center p-0',
        day_button:
          'inline-flex h-10 w-10 items-center justify-center rounded-full text-sm text-app-text transition hover:bg-white/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface',
        today:
          '[&>button]:border [&>button]:border-app-brand-secondary [&>button]:text-app-brand-secondary',
        selected:
          '[&>button]:bg-app-brand-secondary [&>button]:font-semibold [&>button]:text-app-text-inverse [&>button]:shadow-[0_0_0_1px_rgba(0,255,165,0.35)]',
        outside: 'hidden',
        disabled: 'opacity-50',
        hidden: 'invisible',
      }}
    />
  );
}

function FixturesDayPickerChevron({ className, orientation = 'right' }: ChevronProps) {
  const iconClassName = className ?? 'h-4 w-4';

  return orientation === 'left' ? (
    <ChevronLeftIcon className={iconClassName} />
  ) : (
    <ChevronRightIcon className={iconClassName} />
  );
}
