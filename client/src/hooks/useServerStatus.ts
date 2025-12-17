import { useQuery } from '@tanstack/react-query';
import { checkServer } from '../api/health';

// Hook to monitor server status
export function useServerStatus() {
  return useQuery({
    queryKey: ['server-status'],
    queryFn: checkServer,
    retry: 1,
    refetchInterval: 30_000, // check every 30s
    staleTime: 30_000, // consider data is legit and fresh for 30s
  });
}
