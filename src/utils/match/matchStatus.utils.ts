import type { MatchState } from '@/features/match/types/match.types';

const LIVE_STATUSES = new Set(['LIVE', '1H', '2H', 'ET', 'BT', 'P', 'INT', 'IN PLAY']);

const HALFTIME_STATUSES = new Set(['HT', 'HALF TIME']);

const FINISHED_STATUSES = new Set(['MATCH FINISHED', 'FINISHED', 'FT', 'AET', 'AFTER ET', 'PEN']);

const POSTPONED_STATUSES = new Set(['PST', 'Match Postponed']);
const CANCELED_STATUSES = new Set(['CANC', 'CANCELLED', 'CANCELED']);
const SUSPENDED_STATUSES = new Set(['SUSP', 'SUSPENDED']);
const ABANDONED_STATUSES = new Set(['ABD', 'ABANDONED']);
const AWARDED_STATUSES = new Set(['AWD', 'AWARDED', 'WO', 'WALKOVER']);

const TIMELINE_POLLING_STATUSES = new Set(['1H', 'HT', '2H', 'ET', 'P', 'BT', 'INT', 'SUSP']);
const ACTIVE_MATCH_STATES = new Set<MatchState>(['live', 'halftime', 'suspended']);
const TERMINAL_MATCH_STATES = new Set<MatchState>([
  'finished',
  'Match Postponed',
  'canceled',
  'abandoned',
  'awarded',
]);

type MatchStateInput = {
  status?: string | null | undefined;
  homeScore?: number | null | undefined;
  awayScore?: number | null | undefined;
};

function normalizeStatus(status: string | null | undefined): string {
  return status?.trim().toUpperCase() ?? '';
}

export function getMatchState({ status, homeScore, awayScore }: MatchStateInput): MatchState {
  const normalized = normalizeStatus(status);

  if (FINISHED_STATUSES.has(normalized)) return 'finished';
  if (HALFTIME_STATUSES.has(normalized)) return 'halftime';
  if (LIVE_STATUSES.has(normalized)) return 'live';
  if (POSTPONED_STATUSES.has(normalized)) return 'Match Postponed';
  if (CANCELED_STATUSES.has(normalized)) return 'canceled';
  if (SUSPENDED_STATUSES.has(normalized)) return 'suspended';
  if (ABANDONED_STATUSES.has(normalized)) return 'abandoned';
  if (AWARDED_STATUSES.has(normalized)) return 'awarded';

  if (normalized === 'NS' || normalized === 'TBD' || normalized === 'NOT STARTED' || !normalized) {
    if (homeScore != null && awayScore != null) return 'finished';
    return 'scheduled';
  }

  return 'unknown';
}

export function isMatchLive(state: MatchState): boolean {
  return state === 'live' || state === 'halftime';
}

export function isMatchActive(state: MatchState | undefined | null): boolean {
  return state != null && ACTIVE_MATCH_STATES.has(state);
}

export function isMatchLiveOrInProgress(status: string | undefined | null): boolean {
  return TIMELINE_POLLING_STATUSES.has(normalizeStatus(status));
}

export function isMatchTerminal(state: MatchState | undefined | null): boolean {
  return state != null && TERMINAL_MATCH_STATES.has(state);
}

export function getPreferredMatchState(
  primaryState: MatchState | undefined | null,
  fallbackState: MatchState | undefined | null,
): MatchState | undefined {
  if (primaryState == null) {
    return fallbackState ?? undefined;
  }

  if (
    (primaryState === 'scheduled' || primaryState === 'unknown') &&
    isMatchActive(fallbackState)
  ) {
    return fallbackState ?? undefined;
  }

  return primaryState;
}

export function getMatchRefetchInterval(
  state: MatchState | undefined | null,
  {
    scheduledMs,
    activeMs,
  }: {
    scheduledMs: number;
    activeMs: number;
  },
): number | false {
  if (state == null || isMatchTerminal(state)) {
    return false;
  }

  if (isMatchActive(state)) {
    return activeMs;
  }

  if (state === 'scheduled' || state === 'unknown') {
    return scheduledMs;
  }

  return false;
}

export function isMatchFinished(
  statusOrInput: string | MatchStateInput | undefined | null,
): boolean {
  const state =
    typeof statusOrInput === 'string' || statusOrInput == null
      ? getMatchState({ status: statusOrInput })
      : getMatchState(statusOrInput);

  return state === 'finished';
}
