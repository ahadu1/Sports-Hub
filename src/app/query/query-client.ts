import { DEFAULT_QUERY_GC_TIME_MS, DEFAULT_QUERY_STALE_TIME_MS } from '@/app/config/app-config';
import { getRetryDelayMs, shouldRetryQuery } from '@/app/query/retry-policy';
import { QueryClient } from '@tanstack/react-query';

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
