import { useQuery } from '@tanstack/react-query';

import { fetchUserStats } from '@/src/services/api';

export const useUserStats = (userId?: string) =>
  useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => fetchUserStats(userId!),
    enabled: Boolean(userId),
  });

