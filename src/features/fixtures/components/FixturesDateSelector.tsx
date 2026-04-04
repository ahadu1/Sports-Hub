import {
  CalendarIcon,
  CalendarWhiteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from '@/components/icons';
import { LoadingState } from '@/components/ui/LoadingState';
import { MOBILE_RIBBON_ITEM_COUNT } from '@/utils/fixtures/date-selector.constants';
import { cn } from '@/utils/cn';
import {
  getDesktopDateLabel,
  getMobileRibbonCenterIndex,
  getMobileRibbonItemCount,
  getMobileDateBottomLabel,
  getMobileDateTopLabel,
  getMonthCaption,
  getMobileRibbonDates,
  isSameCalendarDay,
} from '@/utils/fixtures/date-selector.utils';
import type { MonthChangeEventHandler } from 'react-day-picker';
import { Suspense, lazy, useEffect, useId, useRef, useState, type RefObject } from 'react';

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
  const desktopCalendarId = useId();
  const mobileCalendarTitleId = useId();
  const desktopCalendarRef = useRef<HTMLDivElement>(null);
  const mobileDatesRef = useRef<HTMLDivElement>(null);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [desktopCalendarOpen, setDesktopCalendarOpen] = useState(false);
  const [mobileRibbonItemCount, setMobileRibbonItemCount] = useState(MOBILE_RIBBON_ITEM_COUNT);
  const mobileRibbonCenterIndex = getMobileRibbonCenterIndex(mobileRibbonItemCount);
  const ribbonDates = getMobileRibbonDates(
    selectedDate,
    mobileRibbonItemCount,
    mobileRibbonCenterIndex,
  );

  useDismissibleLayer({
    containerRef: desktopCalendarRef,
    isOpen: desktopCalendarOpen,
    onDismiss: () => setDesktopCalendarOpen(false),
  });

  useEffect(() => {
    const mobileDatesElement = mobileDatesRef.current;
    if (!mobileDatesElement) {
      return;
    }

    const updateRibbonDatesCount = () => {
      const nextCount = getMobileRibbonItemCount(mobileDatesElement.clientWidth);
      setMobileRibbonItemCount((currentCount) =>
        currentCount === nextCount ? currentCount : nextCount,
      );
    };

    updateRibbonDatesCount();

    const resizeObserver = new ResizeObserver(updateRibbonDatesCount);
    resizeObserver.observe(mobileDatesElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
            calendarId={desktopCalendarId}
            selectedDate={selectedDate}
            visibleMonth={visibleMonth}
            isOpen={desktopCalendarOpen}
            onOpen={onOpenCalendar}
            onToggle={() => setDesktopCalendarOpen((current) => !current)}
            onClose={() => setDesktopCalendarOpen(false)}
            onSelectDate={onSelectDate}
            onMonthChange={onMonthChange}
            containerRef={desktopCalendarRef}
          />
        </div>
        <ArrowButton ariaLabel="Show next fixtures date" direction="right" onClick={onNext} />
      </div>

      <div className="fixturesDateSelector__mobileRibbon">
        <div ref={mobileDatesRef} className="fixturesDateSelector__mobileDates">
          {ribbonDates.map((date) => {
            const isSelected = isSameCalendarDay(date, selectedDate);
            const labelToneClass = isSelected ? 'text-app-brand-secondary' : 'text-app-text';

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
                <span className="fixturesDateSelector__mobileDateLabels">
                  <span className={cn('fixturesDateSelector__mobileDateTopText', labelToneClass)}>
                    {getMobileDateTopLabel(date, selectedDate)}
                  </span>
                  <span
                    className={cn('fixturesDateSelector__mobileDateBottomText', labelToneClass)}
                  >
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
        dialogTitleId={mobileCalendarTitleId}
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

type UseDismissibleLayerOptions = {
  containerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onDismiss: () => void;
};

function useDismissibleLayer({ containerRef, isOpen, onDismiss }: UseDismissibleLayerOptions) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, isOpen, onDismiss]);
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
  calendarId: string;
  selectedDate: Date;
  visibleMonth: Date;
  isOpen: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
  containerRef: RefObject<HTMLDivElement | null>;
};

function DesktopCalendar({
  calendarId,
  selectedDate,
  visibleMonth,
  isOpen,
  onOpen,
  onToggle,
  onClose,
  onSelectDate,
  onMonthChange,
  containerRef,
}: DesktopCalendarProps) {
  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="fixturesDateSelector__calendarButton"
        aria-label={`Choose fixtures date, currently ${getDesktopDateLabel(selectedDate)}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={calendarId}
        onClick={() => {
          onOpen();
          onToggle();
        }}
      >
        <CalendarWhiteIcon className="h-6 w-6" />
        <span className="text-body-md-strong">{getDesktopDateLabel(selectedDate)}</span>
      </button>

      {isOpen ? (
        <div
          id={calendarId}
          role="dialog"
          aria-modal="false"
          className="fixturesDateSelector__popoverPanel"
        >
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
      ) : null}
    </div>
  );
}

type MobileCalendarDialogProps = {
  dialogTitleId: string;
  selectedDate: Date;
  visibleMonth: Date;
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: MonthChangeEventHandler;
};

function MobileCalendarDialog({
  dialogTitleId,
  selectedDate,
  visibleMonth,
  isOpen,
  onClose,
  onSelectDate,
  onMonthChange,
}: MobileCalendarDialogProps) {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') {
      return;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixturesDateSelector__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogTitleId}
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-end justify-center">
        <div className="fixturesDateSelector__dialogPanel">
          <div className="flex items-center justify-between gap-3">
            <h2 id={dialogTitleId} className="text-title-sm text-white">
              {getMonthCaption(visibleMonth)}
            </h2>
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
        </div>
      </div>
    </div>
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
