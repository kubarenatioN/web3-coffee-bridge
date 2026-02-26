import { fetchMailBridgeHistory } from '@/shared/api/MailBridgeHistory';
import { useQuery } from '@tanstack/react-query';

export function useMailBridgeHistory(
  user: string | undefined,
  pageIndex = 0,
  size = 20,
) {
  return useQuery({
    queryKey: ['mail-bridge-history', user, pageIndex, size],
    queryFn: async () => {
      const pagination = { size, skip: pageIndex * size };
      return fetchMailBridgeHistory(user!, pagination);
    },
    staleTime: 2 * 60 * 1000,
    enabled: user != null,
  });
}
