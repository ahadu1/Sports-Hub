import { MAX_QUERY_RETRIES } from '@/app/config/app-config';
import { InlineErrorState } from '@/components/ui/InlineErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatePanel } from '@/components/ui/StatePanel';
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
import { useFixturesCompetition } from '@/features/fixtures/context/useFixturesCompetition';
import { usePersistedFixturesDate } from '@/features/fixtures/hooks/usePersistedFixturesDate';
import { useFixturesQuery } from '@/features/fixtures/hooks/useFixturesQuery';
import type { FixturesFilterKey } from '@/features/fixtures/types/fixtures.types';
import { groupFixturesByCompetition } from '@/features/fixtures/utils/fixturesPage.utils';
import { copy } from '@/lib/constants/copy';
import { addDays, format, startOfDay, startOfMonth, subDays } from 'date-fns';
import { useMemo, useState } from 'react';

export function FixturesPage() {
  const {
    isLoading: isCompetitionLoading,
    selectedLeagueId,
    selectedSeasonId,
  } = useFixturesCompetition();

  const { selectedDate, setSelectedDate } = usePersistedFixturesDate();
  const [selectedFilter, setSelectedFilter] = useState<FixturesFilterKey>('all');
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(selectedDate));

  const fixturesQuery = useFixturesQuery(selectedLeagueId, selectedSeasonId);

  const allSections = useMemo(
    () => groupFixturesByCompetition(fixturesQuery.data ?? []),
    [fixturesQuery.data],
  );

  const dateFilteredSections = useMemo(
    () => filterFixturesByDate(allSections, selectedDate),
    [allSections, selectedDate],
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

  const hasFixturesOnSelectedDate = hasFixturesForDate(allSections, selectedDate);

  const syncSelectedDate = (nextDate: Date) => {
    const normalizedDate = normalizeDate(nextDate);
    setSelectedDate(normalizedDate);
    setVisibleMonth(startOfMonth(normalizedDate));
  };

  const isInitialLoading =
    (isCompetitionLoading && (!selectedLeagueId || !selectedSeasonId)) ||
    (fixturesQuery.isPending && allSections.length === 0);

  return (
    <div className="-mx-6 w-auto bg-app-canvas">
      <div className="mx-auto flex max-w-[820px] flex-col gap-4 px-4 lg:w-[820px] lg:px-0">
        <h1 className="app-type-inter-20-26-semibold text-app-text">{copy.matchesHeading}</h1>

        <FixturesDesktopDateBar
          selectedDate={selectedDate}
          visibleMonth={visibleMonth}
          onPrevious={() => syncSelectedDate(startOfDay(subDays(selectedDate, 1)))}
          onNext={() => syncSelectedDate(startOfDay(addDays(selectedDate, 1)))}
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

        {isInitialLoading ? (
          <StatePanel>
            <LoadingState className="justify-center" />
          </StatePanel>
        ) : fixturesQuery.isError && allSections.length === 0 ? (
          <StatePanel>
            <InlineErrorState
              title={copy.inlineErrorTitle}
              message={copy.inlineErrorMessage}
              retryLabel={copy.retry}
              onRetry={() => {
                void fixturesQuery.refetch();
              }}
              attempt={Math.max(1, fixturesQuery.failureCount)}
              maxAttempts={MAX_QUERY_RETRIES}
            />
          </StatePanel>
        ) : filteredSections.length > 0 ? (
          filteredSections.map((section) => <CompetitionCard key={section.id} section={section} />)
        ) : (
          <StatePanel>
            <div className="space-y-2">
              <h2 className="app-type-inter-20-26-semibold text-app-text">
                {copy.matchesEmptyTitle}
              </h2>
              <p className="app-type-inter-14-20-normal text-app-text-muted">
                {hasFixturesOnSelectedDate
                  ? `No matches are available in this filter for ${format(selectedDate, EMPTY_STATE_DATE_FORMAT)}.`
                  : `There are no scheduled fixtures for ${format(selectedDate, EMPTY_STATE_DATE_FORMAT)}.`}
              </p>
            </div>
          </StatePanel>
        )}
      </div>
    </div>
  );
}
