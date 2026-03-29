import { CompetitionCard } from '@/features/fixtures/components/CompetitionCard';
import { FixturesDesktopDateBar } from '@/features/fixtures/components/FixturesDesktopDateBar';
import { FixturesFilterChips } from '@/features/fixtures/components/FixturesFilterChips';
import { FixturesMobileDateRibbon } from '@/features/fixtures/components/FixturesMobileDateRibbon';
import { EMPTY_STATE_DATE_FORMAT } from '@/features/fixtures/components/date-selector/date-selector.constants';
import {
  filterFixturesByDate,
  hasFixturesForDate,
  normalizeDate,
} from '@/features/fixtures/components/date-selector/date-selector.utils';
import { FIXTURES_PAGE_MOCK } from '@/features/fixtures/mocks/fixtures.mock';
import type { FixturesFilterKey } from '@/features/fixtures/types/fixtures.types';
import { addDays, format, startOfDay, startOfMonth, subDays } from 'date-fns';
import { useMemo, useState } from 'react';

export function FixturesPage() {
  const [selectedFilter, setSelectedFilter] = useState<FixturesFilterKey>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(() => startOfDay(new Date()));
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(startOfDay(new Date())),
  );

  const dateFilteredSections = useMemo(
    () => filterFixturesByDate(FIXTURES_PAGE_MOCK.sections, selectedDate),
    [selectedDate],
  );

  const chipCounts = useMemo(
    () => ({
      all: dateFilteredSections.reduce((count, section) => count + section.fixtures.length, 0),
      live: dateFilteredSections.reduce(
        (count, section) =>
          count +
          section.fixtures.filter((fixture) => fixture.visibleInFilters.includes('live')).length,
        0,
      ),
      favorites: dateFilteredSections.reduce(
        (count, section) =>
          count +
          section.fixtures.filter((fixture) => fixture.visibleInFilters.includes('favorites'))
            .length,
        0,
      ),
    }),
    [dateFilteredSections],
  );

  const filteredSections = useMemo(
    () =>
      dateFilteredSections
        .map((section) => ({
          ...section,
          fixtures: section.fixtures.filter((fixture) =>
            selectedFilter === 'all' ? true : fixture.visibleInFilters.includes(selectedFilter),
          ),
        }))
        .filter((section) => section.fixtures.length > 0),
    [dateFilteredSections, selectedFilter],
  );

  const hasFixturesOnSelectedDate = hasFixturesForDate(FIXTURES_PAGE_MOCK.sections, selectedDate);

  const syncSelectedDate = (nextDate: Date) => {
    const normalizedDate = normalizeDate(nextDate);
    setSelectedDate(normalizedDate);
    setVisibleMonth(startOfMonth(normalizedDate));
  };

  return (
    <div className="-mx-6 w-auto bg-app-canvas">
      <div className="mx-auto flex max-w-[820px] flex-col gap-4 px-4 lg:w-[820px] lg:px-0">
        <h1 className="app-type-inter-20-26-semibold text-white">Matches</h1>

        <FixturesDesktopDateBar
          selectedDate={selectedDate}
          visibleMonth={visibleMonth}
          onPrevious={() => setSelectedDate((prev) => startOfDay(subDays(prev, 1)))}
          onNext={() => setSelectedDate((prev) => startOfDay(addDays(prev, 1)))}
          onOpenCalendar={() => setVisibleMonth(startOfMonth(selectedDate))}
          onSelectDate={syncSelectedDate}
          onMonthChange={setVisibleMonth}
        />

        <FixturesMobileDateRibbon
          selectedDate={selectedDate}
          visibleMonth={visibleMonth}
          mobileCalendarOpen={mobileCalendarOpen}
          onSelectDate={syncSelectedDate}
          onOpenCalendar={() => {
            setVisibleMonth(startOfMonth(selectedDate));
            setMobileCalendarOpen(true);
          }}
          onCloseCalendar={() => setMobileCalendarOpen(false)}
          onMonthChange={setVisibleMonth}
        />

        <FixturesFilterChips
          chipCounts={chipCounts}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        {filteredSections.length > 0 ? (
          filteredSections.map((section) => <CompetitionCard key={section.id} section={section} />)
        ) : (
          <section className="flex min-h-[220px] items-center justify-center rounded-lg border border-app-border-base bg-app-surface p-6 text-center">
            <div className="space-y-2">
              <h2 className="app-type-inter-20-26-semibold text-white">No matches scheduled</h2>
              <p className="app-type-inter-14-20-normal text-app-text-muted">
                {hasFixturesOnSelectedDate
                  ? `No matches are available in this filter for ${format(selectedDate, EMPTY_STATE_DATE_FORMAT)}.`
                  : `There are no scheduled fixtures for ${format(selectedDate, EMPTY_STATE_DATE_FORMAT)}.`}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
