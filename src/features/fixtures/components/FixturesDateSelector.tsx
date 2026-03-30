import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/icons';
import { LoadingState } from '@/components/ui/LoadingState';
import { cn } from '@/utils/cn';
import {
  getDesktopDateLabel,
  getMobileDateBottomLabel,
  getMobileDateTopLabel,
  getMonthCaption,
  getMobileRibbonDates,
  isSameCalendarDay,
} from '@/utils/fixtures/date-selector.utils';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import type { MonthChangeEventHandler } from 'react-day-picker';
import { Suspense, lazy, useState } from 'react';

const FixturesDayPickerCalendar = lazy(async () => {
  const module = await import('./FixturesDayPickerCalendar');

  return { default: module.FixturesDayPickerCalendar };
});

type FixturesDateSelectorProps = {
  selectedDate: Date;
  visibleMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
  onOpenCalendar: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

export function FixturesDateSelector({
  selectedDate,
  visibleMonth,
  onPrevious,
  onNext,
  onOpenCalendar,
  onSelectDate,
  onMonthChange,
}: FixturesDateSelectorProps) {
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const ribbonDates = getMobileRibbonDates(selectedDate);

  return (
    <div className="fixturesDateSelector">
      <div className="fixturesDateSelector__desktopBar">
        <ArrowButton
          ariaLabel="Show previous fixtures date"
          direction="left"
          onClick={onPrevious}
        />
        <div className="flex flex-1 items-center justify-center">
          <DesktopCalendar
            selectedDate={selectedDate}
            visibleMonth={visibleMonth}
            onOpen={onOpenCalendar}
            onSelectDate={onSelectDate}
            onMonthChange={onMonthChange}
          />
        </div>
        <ArrowButton ariaLabel="Show next fixtures date" direction="right" onClick={onNext} />
      </div>

      <div className="fixturesDateSelector__mobileRibbon">
        <div className="fixturesDateSelector__mobileDates">
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
                  'fixturesDateSelector__mobileDate',
                  isSelected && 'fixturesDateSelector__mobileDate--selected',
                )}
                onClick={() => onSelectDate(date)}
              >
                <span className="flex flex-col items-center justify-center text-center">
                  <span className={cn('text-body-sm', toneClass)}>
                    {getMobileDateTopLabel(date, selectedDate)}
                  </span>
                  <span className={cn('text-body-sm', toneClass)}>
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
          className="fixturesDateSelector__calendarTrigger"
          onClick={() => {
            onOpenCalendar();
            setMobileCalendarOpen(true);
          }}
        >
          <CalendarIcon />
        </button>
      </div>

      <MobileCalendarDialog
        selectedDate={selectedDate}
        visibleMonth={visibleMonth}
        isOpen={mobileCalendarOpen}
        onClose={() => setMobileCalendarOpen(false)}
        onSelectDate={onSelectDate}
        onMonthChange={onMonthChange}
      />
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
      className="fixturesDateSelector__navButton"
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

type DesktopCalendarProps = {
  selectedDate: Date;
  visibleMonth: Date;
  onOpen: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

function DesktopCalendar({
  selectedDate,
  visibleMonth,
  onOpen,
  onSelectDate,
  onMonthChange,
}: DesktopCalendarProps) {
  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <PopoverButton
            type="button"
            className="fixturesDateSelector__calendarButton"
            aria-label={`Choose fixtures date, currently ${getDesktopDateLabel(selectedDate)}`}
            onClick={onOpen}
          >
            <CalendarIcon className="h-6 w-6" />
            <span className="text-body-md-strong">{getDesktopDateLabel(selectedDate)}</span>
          </PopoverButton>

          <PopoverPanel className="fixturesDateSelector__popoverPanel">
            <CalendarContent
              selectedDate={selectedDate}
              visibleMonth={visibleMonth}
              onMonthChange={onMonthChange}
              onSelectDate={(date) => {
                onSelectDate(date);
                close();
              }}
            />
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
}

type MobileCalendarDialogProps = {
  selectedDate: Date;
  visibleMonth: Date;
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

function MobileCalendarDialog({
  selectedDate,
  visibleMonth,
  isOpen,
  onClose,
  onSelectDate,
  onMonthChange,
}: MobileCalendarDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixturesDateSelector__dialog">
      <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-[1px]" />

      <div className="fixed inset-0 flex items-end justify-center">
        <DialogPanel className="fixturesDateSelector__dialogPanel">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-title-sm text-white">
              {getMonthCaption(visibleMonth)}
            </DialogTitle>
            <button
              type="button"
              aria-label="Close fixtures calendar"
              className="fixturesDateSelector__dialogClose"
              onClick={onClose}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-2xl bg-app-surface">
            <CalendarContent
              selectedDate={selectedDate}
              visibleMonth={visibleMonth}
              onMonthChange={onMonthChange}
              onSelectDate={(date) => {
                onSelectDate(date);
                onClose();
              }}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

type CalendarContentProps = {
  selectedDate: Date;
  visibleMonth: Date;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

function CalendarContent({
  selectedDate,
  visibleMonth,
  onSelectDate,
  onMonthChange,
}: CalendarContentProps) {
  return (
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
        onSelectDate={onSelectDate}
      />
    </Suspense>
  );
}
