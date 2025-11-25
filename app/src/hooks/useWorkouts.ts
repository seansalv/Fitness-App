import { useQuery } from '@tanstack/react-query';

import { fetchQuestCount, fetchRecentWorkouts } from '@/src/services/api';

export const useRecentWorkouts = (userId?: string) =>
  useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => fetchRecentWorkouts(userId!),
    enabled: Boolean(userId),
  });

export const useQuestCount = (userId?: string) =>
  useQuery({
    queryKey: ['quest-count', userId],
    queryFn: () => fetchQuestCount(userId!),
    enabled: Boolean(userId),
  });

