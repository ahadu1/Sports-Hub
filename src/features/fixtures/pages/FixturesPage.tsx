import { LoadingState } from '@/components/ui/LoadingState';
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
import { useFixturesQuery } from '@/features/fixtures/hooks/useFixturesQuery';
import type {
  CompetitionSection,
  Fixture,
  FixturesFilterKey,
} from '@/features/fixtures/types/fixtures.types';
import { copy } from '@/lib/constants/copy';
import { addDays, format, startOfDay, startOfMonth, subDays } from 'date-fns';
import { useMemo, useState } from 'react';

let lastSelectedFixturesDate: Date | null = null;

function getInitialSelectedDate(): Date {
  return lastSelectedFixturesDate ? new Date(lastSelectedFixturesDate) : startOfDay(new Date());
}

function groupFixturesByCompetition(fixtures: Fixture[]): CompetitionSection[] {
  const sectionsByLeague = new Map<string, CompetitionSection>();

  fixtures.forEach((fixture) => {
    const existingSection = sectionsByLeague.get(fixture.leagueId);

    if (existingSection) {
      existingSection.fixtures.push(fixture);
      return;
    }

    sectionsByLeague.set(fixture.leagueId, {
      id: fixture.leagueId,
      name: fixture.leagueName,
      fixtures: [fixture],
    });
  });

  return Array.from(sectionsByLeague.values());
}

export function FixturesPage() {
  const {
    isLoading: isCompetitionLoading,
    selectedLeagueId,
    selectedSeasonId,
  } = useFixturesCompetition();

  const [selectedFilter, setSelectedFilter] = useState<FixturesFilterKey>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(() => getInitialSelectedDate());
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    startOfMonth(getInitialSelectedDate()),
  );

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
    lastSelectedFixturesDate = normalizedDate;
    setSelectedDate(normalizedDate);
    setVisibleMonth(startOfMonth(normalizedDate));
  };

  const isInitialLoading =
    (isCompetitionLoading && (!selectedLeagueId || !selectedSeasonId)) ||
    (fixturesQuery.isPending && allSections.length === 0);

  return (
    <div className="-mx-6 w-auto bg-app-canvas">
      <div className="mx-auto flex max-w-[820px] flex-col gap-4 px-4 lg:w-[820px] lg:px-0">
        <h1 className="app-type-inter-20-26-semibold text-white">Matches</h1>

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
          <section className="flex min-h-[220px] items-center justify-center rounded-lg border border-app-border-base bg-app-surface p-6 text-center">
            <LoadingState className="justify-center" />
          </section>
        ) : fixturesQuery.isError && allSections.length === 0 ? (
          <section className="flex min-h-[220px] items-center justify-center rounded-lg border border-app-border-base bg-app-surface p-6 text-center">
            <div className="space-y-2">
              <h2 className="app-type-inter-20-26-semibold text-white">{copy.inlineErrorTitle}</h2>
              <p className="app-type-inter-14-20-normal text-app-text-muted">
                {copy.inlineErrorMessage}
              </p>
            </div>
          </section>
        ) : filteredSections.length > 0 ? (
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
