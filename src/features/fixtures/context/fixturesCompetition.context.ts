import type { CompetitionOption } from '@/features/fixtures/api/competition.mappers';
import { createContext } from 'react';

export type FixturesCompetitionContextValue = {
  isLoading: boolean;
  isLeagueLoading: boolean;
  isSeasonLoading: boolean;
  isError: boolean;
  failureCount: number;
  leagueOptions: CompetitionOption[];
  seasonOptions: CompetitionOption[];
  selectedLeagueId: string;
  selectedSeasonId: string;
  selectedLeagueOption: CompetitionOption | null;
  selectedSeasonOption: CompetitionOption | null;
  retry: () => Promise<void>;
  setSelectedLeagueId: (leagueId: string) => void;
  setSelectedSeasonId: (seasonId: string) => void;
};

export const FixturesCompetitionContext = createContext<FixturesCompetitionContextValue | null>(
  null,
);
