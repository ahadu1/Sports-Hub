import { STATIC_QUERY_GC_TIME_MS, STATIC_QUERY_STALE_TIME_MS } from '@/app/config/app-config';
import { fetchLeagueOptions, fetchLeagueSeasons } from '@/features/fixtures/api/competition.api';
import {
  FixturesCompetitionContext,
  type FixturesCompetitionContextValue,
} from '@/features/fixtures/context/fixturesCompetition.context';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
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

  const leaguesQuery = useQuery({
    queryKey: queryKeys.fixtures.leagues(),
    queryFn: ({ signal }) => fetchLeagueOptions(signal),
    staleTime: STATIC_QUERY_STALE_TIME_MS,
    gcTime: STATIC_QUERY_GC_TIME_MS,
  });

  const leagueOptions = useMemo(() => leaguesQuery.data ?? [], [leaguesQuery.data]);

  const seasonsQuery = useQuery({
    queryKey: queryKeys.fixtures.seasons(selectedLeagueId),
    queryFn: ({ signal }) => fetchLeagueSeasons(selectedLeagueId, signal),
    enabled: selectedLeagueId.length > 0,
    staleTime: STATIC_QUERY_STALE_TIME_MS,
    gcTime: STATIC_QUERY_GC_TIME_MS,
  });

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

  const value = useMemo<FixturesCompetitionContextValue>(
    () => ({
      isLoading: leaguesQuery.isPending || (selectedLeagueId.length > 0 && seasonsQuery.isPending),
      isLeagueLoading: leaguesQuery.isPending,
      isSeasonLoading: selectedLeagueId.length > 0 && seasonsQuery.isPending,
      leagueOptions,
      seasonOptions,
      selectedLeagueId,
      selectedSeasonId,
      selectedLeagueOption: leagueOptions.find((l) => l.id === selectedLeagueId) ?? null,
      selectedSeasonOption: seasonOptions.find((s) => s.id === selectedSeasonId) ?? null,
      setSelectedLeagueId: handleLeagueChange,
      setSelectedSeasonId,
    }),
    [
      leaguesQuery.isPending,
      seasonsQuery.isPending,
      leagueOptions,
      seasonOptions,
      selectedLeagueId,
      selectedSeasonId,
      handleLeagueChange,
    ],
  );

  return (
    <FixturesCompetitionContext.Provider value={value}>
      {children}
    </FixturesCompetitionContext.Provider>
  );
}
