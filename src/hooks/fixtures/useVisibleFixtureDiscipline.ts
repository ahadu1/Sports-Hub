import type {
  CompetitionSection,
  FixtureDiscipline,
} from '@/features/fixtures/types/fixtures.types';
import { getMatchTimelineQueryOptions } from '@/hooks/match/useMatchTimeline';
import {
  mapFixtureDisciplineFromTimelineItems,
  mergeCompetitionSectionsWithDiscipline,
} from '@/utils/fixtures/fixtureDiscipline.utils';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

function shouldFetchFixtureDetail(state: CompetitionSection['fixtures'][number]['state']): boolean {
  return state !== 'scheduled' && state !== 'Match Postponed' && state !== 'canceled';
}

export function useVisibleFixtureDiscipline(sections: CompetitionSection[]): CompetitionSection[] {
  const visibleFixtures = useMemo(
    () =>
      sections
        .flatMap((section) => section.fixtures)
        .filter((fixture) => shouldFetchFixtureDetail(fixture.state)),
    [sections],
  );

  const timelineQueries = useQueries({
    queries: visibleFixtures.map((fixture) =>
      getMatchTimelineQueryOptions({
        eventId: fixture.eventId,
        selectedFixture: fixture,
      }),
    ),
  });

  const disciplineByEventId = useMemo(() => {
    const byEventId = new Map<string, FixtureDiscipline[]>();

    visibleFixtures.forEach((fixture, index) => {
      const timeline = timelineQueries[index]?.data;
      if (!timeline) {
        return;
      }

      const discipline = mapFixtureDisciplineFromTimelineItems(timeline.items);
      if (discipline.length === 0) {
        return;
      }

      byEventId.set(fixture.eventId, discipline);
    });

    return byEventId;
  }, [timelineQueries, visibleFixtures]);

  return useMemo(
    () => mergeCompetitionSectionsWithDiscipline(sections, disciplineByEventId),
    [disciplineByEventId, sections],
  );
}
