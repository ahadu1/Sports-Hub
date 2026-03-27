export const APP_NAME = 'Sports Hub';

/** Live fixtures list polling interval for TanStack Query `refetchInterval`. */
export const LIVE_FIXTURES_REFETCH_INTERVAL_MS = 15_000;

export const DEFAULT_QUERY_STALE_TIME_MS = 60_000;

export const DEFAULT_QUERY_GC_TIME_MS = 5 * 60_000;

/** Grace window after data is stale before treating it as beyond acceptable freshness. */
export const STALE_GRACE_WINDOW_MS = 30_000;

export const MAX_QUERY_RETRIES = 3;

export const RETRY_BASE_DELAY_MS = 500;

export const RETRY_MAX_DELAY_MS = 8_000;

/** Placeholder event id for navigation demos only (not real data). */
export const DEMO_MATCH_EVENT_ID = 'demo-event-001';
