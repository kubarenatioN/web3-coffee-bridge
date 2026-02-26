import { fetchTokenBridgeHistory } from '@/shared/api/TokenBridgeHistory';
import { useQuery } from '@tanstack/react-query';

export function useTokenBridgeHistory(
  user: string | undefined,
  pageIndex = 0,
  size = 20,
) {
  return useQuery({
    queryKey: ['token-bridge-history', user, pageIndex, size],
    queryFn: async () => {
      const pagination = { size, skip: pageIndex * size };
      return fetchTokenBridgeHistory(user!, pagination);
    },
    staleTime: 2 * 60 * 1000,
    enabled: user != null,
  });
}
