import { MAX_QUERY_RETRIES } from '@/app/config/app-config';
import { InlineErrorState } from '@/components/ui/InlineErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatePanel } from '@/components/ui/StatePanel';
import { CompetitionCard } from '@/features/fixtures/components/CompetitionCard';
import { FixturesDateSelector } from '@/features/fixtures/components/FixturesDateSelector';
import { FixturesFilterChips } from '@/features/fixtures/components/FixturesFilterChips';
import { useFixturesCompetition } from '@/hooks/fixtures/useFixturesCompetition';
import { useVisibleFixtureDiscipline } from '@/hooks/fixtures/useVisibleFixtureDiscipline';
import { usePersistedFixturesDate } from '@/hooks/fixtures/usePersistedFixturesDate';
import { useFixturesQuery } from '@/hooks/fixtures/useFixturesQuery';
import { formatLocalDateLong, formatWeekdayLong } from '@/lib/datetime/kickoff';
import { addCalendarDays, startOfLocalDay, startOfLocalMonth } from '@/lib/datetime/date';
import {
  filterFixturesByDate,
  getClosestFixtureDate,
  hasFixturesForDate,
  normalizeDate,
} from '@/utils/fixtures/date-selector.utils';
import type { FixturesFilterKey } from '@/features/fixtures/types/fixtures.types';
import { groupFixturesByCompetition } from '@/utils/fixtures/fixturesPage.utils';
import { copy } from '@/lib/constants/copy';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function FixturesPage() {
  const {
    isLoading: isCompetitionLoading,
    isError: isCompetitionError,
    failureCount: competitionFailureCount,
    retry: retryCompetitionQueries,
    selectedLeagueId,
    selectedSeasonId,
  } = useFixturesCompetition();

  const { selectedDate, setSelectedDate } = usePersistedFixturesDate();
  const [selectedFilter, setSelectedFilter] = useState<FixturesFilterKey>('all');
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfLocalMonth(selectedDate));
  const [shouldAutoSelectClosestDate, setShouldAutoSelectClosestDate] = useState(true);

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
  const visibleSections = useVisibleFixtureDiscipline(filteredSections);

  const hasFixturesOnSelectedDate = hasFixturesForDate(allSections, selectedDate);
  const selectedDateLabel = `${formatWeekdayLong(selectedDate)}, ${formatLocalDateLong(selectedDate)}`;

  const syncSelectedDate = useCallback(
    (nextDate: Date) => {
      const normalizedDate = normalizeDate(nextDate);
      setSelectedDate(normalizedDate);
      setVisibleMonth(startOfLocalMonth(normalizedDate));
    },
    [setSelectedDate],
  );

  const handleSelectDate = useCallback(
    (nextDate: Date) => {
      setShouldAutoSelectClosestDate(false);
      syncSelectedDate(nextDate);
    },
    [syncSelectedDate],
  );

  useEffect(() => {
    setShouldAutoSelectClosestDate(true);
  }, [selectedLeagueId, selectedSeasonId]);

  useEffect(() => {
    if (!shouldAutoSelectClosestDate || fixturesQuery.isPending || allSections.length === 0) {
      return;
    }

    const closestFixtureDate = getClosestFixtureDate(allSections);
    if (!closestFixtureDate) {
      return;
    }

    syncSelectedDate(closestFixtureDate);
    setShouldAutoSelectClosestDate(false);
  }, [allSections, fixturesQuery.isPending, shouldAutoSelectClosestDate, syncSelectedDate]);

  const isInitialLoading =
    (isCompetitionLoading && (!selectedLeagueId || !selectedSeasonId)) ||
    (fixturesQuery.isPending && allSections.length === 0);
  const hasBlockingCompetitionError =
    isCompetitionError && (!selectedLeagueId || !selectedSeasonId) && allSections.length === 0;

  return (
    <div className="-mx-4 w-auto bg-app-canvas lg:mx-0">
      <div className="mx-auto flex max-w-[820px] flex-col gap-4 px-4 lg:w-[820px] lg:px-0">
        <h1 className="hidden text-title-md text-app-text lg:block">{copy.matchesHeading}</h1>

        {isInitialLoading ? (
          <StatePanel className="min-h-[320px]">
            <LoadingState className="justify-center" size="large" label="Loading matches" />
          </StatePanel>
        ) : hasBlockingCompetitionError ? (
          <StatePanel>
            <InlineErrorState
              title={copy.inlineErrorTitle}
              message={copy.matchesFiltersUnavailableMessage}
              retryLabel={copy.retry}
              onRetry={() => {
                void retryCompetitionQueries();
              }}
              attempt={Math.max(1, competitionFailureCount)}
              maxAttempts={MAX_QUERY_RETRIES}
            />
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
        ) : (
          <>
            <FixturesDateSelector
              selectedDate={selectedDate}
              visibleMonth={visibleMonth}
              onPrevious={() =>
                handleSelectDate(startOfLocalDay(addCalendarDays(selectedDate, -1)))
              }
              onNext={() => handleSelectDate(startOfLocalDay(addCalendarDays(selectedDate, 1)))}
              onOpenCalendar={() => setVisibleMonth(startOfLocalMonth(selectedDate))}
              onSelectDate={handleSelectDate}
              onMonthChange={setVisibleMonth}
            />

            <FixturesFilterChips
              chipCounts={chipCounts}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
            />

            {visibleSections.length > 0 ? (
              visibleSections.map((section) => (
                <CompetitionCard key={section.id} section={section} />
              ))
            ) : (
              <StatePanel>
                <div className="space-y-2">
                  <h2 className="text-title-md text-app-text">{copy.matchesEmptyTitle}</h2>
                  <p className="text-body-md text-app-text-muted">
                    {hasFixturesOnSelectedDate
                      ? `No matches are available in this filter for ${selectedDateLabel}.`
                      : `There are no scheduled fixtures for ${selectedDateLabel}.`}
                  </p>
                </div>
              </StatePanel>
            )}
          </>
        )}
      </div>
    </div>
  );
}
