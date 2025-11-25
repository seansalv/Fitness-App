import { useQuery } from '@tanstack/react-query';

import { fetchProfile } from '@/src/services/api';

export const useProfile = (userId?: string) =>
  useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId!),
    enabled: Boolean(userId),
  });

