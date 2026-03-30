export const APP_NAME = 'Sports Hub';

/** Live fixtures list polling interval for TanStack Query `refetchInterval`. */
export const LIVE_FIXTURES_REFETCH_INTERVAL_MS = 15_000;

export const DEFAULT_QUERY_STALE_TIME_MS = 60_000;

export const DEFAULT_QUERY_GC_TIME_MS = 5 * 60_000;

export const STATIC_QUERY_STALE_TIME_MS = 24 * 60 * 60_000;

export const STATIC_QUERY_GC_TIME_MS = 7 * 24 * 60 * 60_000;

export const HISTORICAL_QUERY_STALE_TIME_MS = 6 * 60 * 60_000;

export const HISTORICAL_QUERY_GC_TIME_MS = 7 * 24 * 60 * 60_000;

/** Grace window after data is stale before treating it as beyond acceptable freshness. */
export const STALE_GRACE_WINDOW_MS = 30_000;

export const MAX_QUERY_RETRIES = 3;

export const RETRY_BASE_DELAY_MS = 500;

export const RETRY_MAX_DELAY_MS = 8_000;

export const QUERY_CACHE_STORAGE_KEY = 'sports-hub-query-cache';

export const QUERY_CACHE_BUSTER = 'v2';

export const QUERY_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60_000;

export const QUERY_CACHE_THROTTLE_MS = 1_000;

export const APP_SERVICE_WORKER_PATH = '/sw.js';

export const TEAM_ASSET_CACHE_NAME = 'sports-hub-team-assets-v2';
