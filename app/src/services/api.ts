import dayjs from 'dayjs';

import {
  GOALS,
  IntensityLevel,
  QuestInput,
  QuestType,
  RankTier,
  calculateQuestXp,
  calculateStreak,
  getProgressSnapshot,
} from '@/src/config/progression';
import { supabase } from '@/src/lib/supabase';

type MaybeGoal = (typeof GOALS)[number];

export type UserProfile = {
  id: string;
  email: string;
  handle: string;
  goal: MaybeGoal | string;
  created_at?: string;
};

export type UserStats = {
  user_id: string;
  level: number;
  rank: RankTier;
  total_xp: number;
  streak_days: number;
  last_activity_date: string | null;
};

export type WorkoutEntry = {
  id: string;
  user_id: string;
  type: QuestType;
  intensity: IntensityLevel;
  duration_minutes: number;
  xp_awarded: number;
  timestamp: string;
};

const emptyStats = (userId: string): UserStats => ({
  user_id: userId,
  level: 1,
  rank: 'E',
  total_xp: 0,
  streak_days: 0,
  last_activity_date: null,
});

const formatError = (error: { message?: string } | null) =>
  error?.message ?? 'The system encountered an unexpected error.';

export const signUpWithProfile = async (params: {
  email: string;
  password: string;
  handle: string;
  goal: MaybeGoal;
}) => {
  const { email, password, handle, goal } = params;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    throw new Error(formatError(error));
  }

  const userId = data.user.id;

  const { error: profileError } = await supabase.from('users').insert({
    id: userId,
    email,
    handle,
    goal,
  });

  if (profileError && profileError.code !== '23505') {
    throw new Error(formatError(profileError));
  }

  const { error: statsError } = await supabase.from('user_stats').insert({
    user_id: userId,
    level: 1,
    rank: 'E',
    total_xp: 0,
    streak_days: 0,
    last_activity_date: null,
  });

  if (statsError && statsError.code !== '23505') {
    throw new Error(formatError(statsError));
  }

  return data.user;
};

export const signInWithEmail = async (params: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signInWithPassword(params);
  if (error || !data.session) {
    throw new Error(formatError(error));
  }
  return data.session;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(formatError(error));
};

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) {
    throw new Error(formatError(error));
  }
  return data as UserProfile;
};

export const fetchUserStats = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(formatError(error));
  }

  return (data as UserStats | null) ?? emptyStats(userId);
};

export const fetchRecentWorkouts = async (userId: string, lookbackDays = 7) => {
  const since = dayjs().subtract(lookbackDays, 'day').startOf('day').toISOString();
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .gte('timestamp', since)
    .order('timestamp', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(formatError(error));
  }

  return (data as WorkoutEntry[]) ?? [];
};

export const fetchQuestCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw new Error(formatError(error));
  return count ?? 0;
};

export const logQuest = async (params: { userId: string; quest: QuestInput }) => {
  const { userId, quest } = params;

  const stats = await fetchUserStats(userId);
  const xpAwarded = calculateQuestXp(quest);
  const questTime = new Date().toISOString();
  const nextTotalXp = stats.total_xp + xpAwarded;
  const { level, rank } = getProgressSnapshot(nextTotalXp);
  const streak = calculateStreak(stats.last_activity_date, questTime, stats.streak_days);

  const { data: workout, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      type: quest.type,
      intensity: quest.intensity,
      duration_minutes: quest.durationMinutes,
      xp_awarded: xpAwarded,
      timestamp: questTime,
    })
    .select()
    .single();

  if (workoutError) {
    throw new Error(formatError(workoutError));
  }

  const { data: updatedStats, error: statsError } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      total_xp: nextTotalXp,
      level,
      rank,
      streak_days: streak,
      last_activity_date: questTime,
    })
    .select()
    .single();

  if (statsError) throw new Error(formatError(statsError));

  return {
    workout: workout as WorkoutEntry,
    xpAwarded,
    previousStats: stats,
    updatedStats: updatedStats as UserStats,
  };
};

