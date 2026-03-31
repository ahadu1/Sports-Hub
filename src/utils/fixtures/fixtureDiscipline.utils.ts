import type {
  CompetitionSection,
  FixtureDiscipline,
} from '@/features/fixtures/types/fixtures.types';
import type { TimelineItem } from '@/features/match/types/match-events.types';

function appendCards(
  target: FixtureDiscipline[],
  side: 'home' | 'away',
  card: FixtureDiscipline['card'],
  count: number,
) {
  if (count <= 0) {
    return;
  }

  target.push(
    ...Array.from({ length: count }, () => ({
      side,
      card,
    })),
  );
}

export function mapFixtureDisciplineFromTimelineItems(items: TimelineItem[]): FixtureDiscipline[] {
  const discipline: FixtureDiscipline[] = [];
  let homeYellowCards = 0;
  let homeRedCards = 0;
  let awayYellowCards = 0;
  let awayRedCards = 0;

  items.forEach((item) => {
    if (item.kind !== 'event') {
      return;
    }

    if (item.home?.eventType === 'yellow-card') {
      homeYellowCards += 1;
    }

    if (item.home?.eventType === 'red-card') {
      homeRedCards += 1;
    }

    if (item.away?.eventType === 'yellow-card') {
      awayYellowCards += 1;
    }

    if (item.away?.eventType === 'red-card') {
      awayRedCards += 1;
    }
  });

  appendCards(discipline, 'home', 'yellow', homeYellowCards);
  appendCards(discipline, 'home', 'red', homeRedCards);
  appendCards(discipline, 'away', 'yellow', awayYellowCards);
  appendCards(discipline, 'away', 'red', awayRedCards);

  return discipline;
}

export function mergeCompetitionSectionsWithDiscipline(
  sections: CompetitionSection[],
  disciplineByEventId: ReadonlyMap<string, FixtureDiscipline[]>,
): CompetitionSection[] {
  return sections.map((section) => ({
    ...section,
    fixtures: section.fixtures.map((fixture) => {
      const discipline = disciplineByEventId.get(fixture.eventId);

      if (discipline === undefined) {
        return fixture;
      }

      return {
        ...fixture,
        discipline,
      };
    }),
  }));
}
