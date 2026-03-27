import { fetchMatchDetails } from '@/features/match/api/match.api';
import { queryKeys } from '@/lib/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export function useMatchDetailsQuery(eventId: string) {
  return useQuery({
    queryKey: queryKeys.match.detail(eventId),
    queryFn: ({ signal }) => fetchMatchDetails(eventId, signal),
    enabled: eventId.length > 0,
  });
}
