import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WeeklySummaryList, WeeklyDatum } from '@/src/components/WeeklySummaryList';
import { LoadingState } from '@/src/components/LoadingState';
import { SystemCard } from '@/src/components/SystemCard';
import { GOALS } from '@/src/config/progression';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserStats } from '@/src/hooks/useUserStats';
import { useQuestCount, useRecentWorkouts } from '@/src/hooks/useWorkouts';
import { signOut } from '@/src/services/api';
import { cancelReminders, scheduleDailyReminder } from '@/src/services/reminders';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';
import { palette } from '@/src/theme/palette';

export default function StatusScreen() {
  const { session } = useSupabaseSession();
  const userId = session?.user?.id;
  const statsQuery = useUserStats(userId);
  const profileQuery = useProfile(userId);
  const workoutsQuery = useRecentWorkouts(userId);
  const questCountQuery = useQuestCount(userId);
  const [reminderArmed, setReminderArmed] = useState(false);

  const weeklyStats: WeeklyDatum[] = useMemo(() => {
    const workouts = workoutsQuery.data ?? [];
    const today = dayjs().startOf('day');
    return Array.from({ length: 7 }).map((_, idx) => {
      const day = today.subtract(6 - idx, 'day');
      const count = workouts.filter((workout) =>
        dayjs(workout.timestamp).isSame(day, 'day'),
      ).length;
      return {
        key: day.toISOString(),
        label: day.format('ddd'),
        count,
      };
    });
  }, [workoutsQuery.data]);

  if (statsQuery.isLoading || profileQuery.isLoading) {
    return <LoadingState label="Pulling status report..." />;
  }

  const stats = statsQuery.data;
  const profile = profileQuery.data;
  const questCount = questCountQuery.data ?? 0;

  const handleReminder = async () => {
    try {
      if (reminderArmed) {
        await cancelReminders();
        setReminderArmed(false);
      } else {
        await scheduleDailyReminder();
        setReminderArmed(true);
      }
    } catch (error) {
      Alert.alert('Reminder', (error as Error).message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Status Screen</Text>
      <Text style={styles.subtitle}>Goal: {profile?.goal ?? GOALS[0]}</Text>

      <View style={styles.metrics}>
        <Metric title="Rank" value={stats?.rank ?? 'E'} />
        <Metric title="Level" value={stats?.level?.toString() ?? '1'} />
        <Metric title="XP" value={stats?.total_xp?.toString() ?? '0'} />
        <Metric title="Streak" value={`${stats?.streak_days ?? 0}d`} />
      </View>

      <SystemCard title="Past 7 days" subtitle="Quest count per day">
        <WeeklySummaryList data={weeklyStats} />
      </SystemCard>

      <SystemCard title="Quest archive" subtitle={`${questCount} quests completed in total`}>
        <Text style={styles.cardBody}>
          {stats?.last_activity_date
            ? `Last activity: ${dayjs(stats.last_activity_date).format('MMM D, YYYY')}`
            : 'No activity tracked yet.'}
        </Text>
      </SystemCard>

      <Pressable style={[styles.reminderButton, reminderArmed && styles.reminderActive]} onPress={handleReminder}>
        <Text style={styles.reminderLabel}>
          {reminderArmed ? 'Disable daily reminder' : 'Schedule daily reminder'}
        </Text>
      </Pressable>

      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <Text style={styles.signOutLabel}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const Metric = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.metric}>
    <Text style={styles.metricLabel}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 80,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metric: {
    width: '47%',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: palette.surface,
  },
  metricLabel: {
    color: palette.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  cardBody: {
    color: palette.textSecondary,
    marginTop: 8,
  },
  reminderButton: {
    borderWidth: 1,
    borderColor: palette.neon,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  reminderActive: {
    backgroundColor: '#191d32',
  },
  reminderLabel: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  signOut: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  signOutLabel: {
    color: palette.textSecondary,
  },
});

