import { FixturesCompetitionContext } from '@/features/fixtures/context/fixturesCompetition.context';
import { useContext } from 'react';

export function useFixturesCompetition() {
  const context = useContext(FixturesCompetitionContext);
  if (!context) {
    throw new Error('useFixturesCompetition must be used within FixturesCompetitionProvider.');
  }

  return context;
}
