import {
  DEFAULT_QUERY_GC_TIME_MS,
  DEFAULT_QUERY_STALE_TIME_MS,
  MAX_QUERY_RETRIES,
  RETRY_BASE_DELAY_MS,
  RETRY_MAX_DELAY_MS,
} from '@/app/config/app-config';
import { isNonRetryableClientError } from '@/lib/api/errors';
import { QueryClient } from '@tanstack/react-query';

function getRetryDelayMs(attemptIndex: number): number {
  const raw = RETRY_BASE_DELAY_MS * 2 ** attemptIndex;
  return Math.min(raw, RETRY_MAX_DELAY_MS);
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_QUERY_RETRIES) {
    return false;
  }

  return !isNonRetryableClientError(error);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => shouldRetryQuery(failureCount, error),
      retryDelay: (attemptIndex) => getRetryDelayMs(attemptIndex),
      staleTime: DEFAULT_QUERY_STALE_TIME_MS,
      gcTime: DEFAULT_QUERY_GC_TIME_MS,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});
