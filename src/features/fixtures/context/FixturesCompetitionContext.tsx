import {
  FixturesCompetitionContext,
  type FixturesCompetitionContextValue,
} from '@/features/fixtures/context/fixturesCompetition.context';
import { useLeagueOption } from '@/hooks/fixtures/useLeagueOption';
import { useLeagueOptions } from '@/hooks/fixtures/useLeagueOptions';
import { useLeagueSeasons } from '@/hooks/fixtures/useLeagueSeasons';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

type FixturesCompetitionProviderProps = {
  children: ReactNode;
};

const DEFAULT_LEAGUE_LABELS = ['English Premier League', 'Premier League'] as const;

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function getDefaultLeagueId(
  leagueOptions: FixturesCompetitionContextValue['leagueOptions'],
): string {
  const defaultLeague = leagueOptions.find((league) =>
    DEFAULT_LEAGUE_LABELS.some((label) => normalizeLabel(league.label) === normalizeLabel(label)),
  );

  return defaultLeague?.id ?? leagueOptions[0]?.id ?? '';
}

export function FixturesCompetitionProvider({ children }: FixturesCompetitionProviderProps) {
  const [selectedLeagueId, setSelectedLeagueIdRaw] = useState('');
  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  const leaguesQuery = useLeagueOptions();

  const leagueOptions = useMemo(() => leaguesQuery.data ?? [], [leaguesQuery.data]);
  const selectedLeagueQuery = useLeagueOption(selectedLeagueId);

  const seasonsQuery = useLeagueSeasons(selectedLeagueId);

  const seasonOptions = useMemo(() => seasonsQuery.data ?? [], [seasonsQuery.data]);

  useEffect(() => {
    if (leagueOptions.length === 0) return;

    const defaultLeagueId = getDefaultLeagueId(leagueOptions);

    if (!selectedLeagueId) {
      setSelectedLeagueIdRaw(defaultLeagueId);
      return;
    }

    const stillExists = leagueOptions.some((l) => l.id === selectedLeagueId);
    if (!stillExists) {
      setSelectedLeagueIdRaw(defaultLeagueId);
    }
  }, [leagueOptions, selectedLeagueId]);

  useEffect(() => {
    if (seasonOptions.length === 0) {
      if (selectedSeasonId) setSelectedSeasonId('');
      return;
    }

    if (!selectedSeasonId || !seasonOptions.some((s) => s.id === selectedSeasonId)) {
      setSelectedSeasonId(seasonOptions[0]!.id);
    }
  }, [seasonOptions, selectedSeasonId]);

  const handleLeagueChange = useCallback((leagueId: string) => {
    setSelectedLeagueIdRaw(leagueId);
    setSelectedSeasonId('');
  }, []);

  const hasSeasonQuery = selectedLeagueId.length > 0;
  const isError = leaguesQuery.isError || (hasSeasonQuery && seasonsQuery.isError);
  const failureCount = Math.max(
    leaguesQuery.failureCount,
    hasSeasonQuery ? seasonsQuery.failureCount : 0,
  );

  const handleRetry = useCallback(async () => {
    await leaguesQuery.refetch();

    if (hasSeasonQuery) {
      await seasonsQuery.refetch();
    }
  }, [hasSeasonQuery, leaguesQuery, seasonsQuery]);

  const value = useMemo<FixturesCompetitionContextValue>(
    () => ({
      isLoading: leaguesQuery.isPending || (hasSeasonQuery && seasonsQuery.isPending),
      isLeagueLoading: leaguesQuery.isPending,
      isSeasonLoading: hasSeasonQuery && seasonsQuery.isPending,
      isError,
      failureCount,
      leagueOptions,
      seasonOptions,
      selectedLeagueId,
      selectedSeasonId,
      selectedLeagueOption: (() => {
        const selectedLeagueOption = leagueOptions.find((l) => l.id === selectedLeagueId) ?? null;
        const selectedLeagueDetails = selectedLeagueQuery.data;

        if (!selectedLeagueOption) {
          return selectedLeagueDetails ?? null;
        }

        if (!selectedLeagueDetails) {
          return selectedLeagueOption;
        }

        return {
          ...selectedLeagueOption,
          label: selectedLeagueDetails.label || selectedLeagueOption.label,
          badgeSrc: selectedLeagueDetails.badgeSrc ?? selectedLeagueOption.badgeSrc,
        };
      })(),
      selectedSeasonOption: seasonOptions.find((s) => s.id === selectedSeasonId) ?? null,
      retry: handleRetry,
      setSelectedLeagueId: handleLeagueChange,
      setSelectedSeasonId,
    }),
    [
      leaguesQuery.isPending,
      hasSeasonQuery,
      seasonsQuery.isPending,
      isError,
      failureCount,
      leagueOptions,
      seasonOptions,
      selectedLeagueId,
      selectedSeasonId,
      selectedLeagueQuery.data,
      handleRetry,
      handleLeagueChange,
    ],
  );

  return (
    <FixturesCompetitionContext.Provider value={value}>
      {children}
    </FixturesCompetitionContext.Provider>
  );
}
