import type { CompetitionSection, Fixture } from '@/features/fixtures/types/fixtures.types';

export function groupFixturesByCompetition(fixtures: Fixture[]): CompetitionSection[] {
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
