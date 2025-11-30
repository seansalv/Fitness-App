import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { LoadingState } from '@/src/components/LoadingState';
import { useUserStats } from '@/src/hooks/useUserStats';
import { useQuestCount, useRecentWorkouts } from '@/src/hooks/useWorkouts';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';

export default function StatusScreen() {
  const { session } = useSupabaseSession();
  const userId = session?.user?.id;
  const statsQuery = useUserStats(userId);
  const workoutsQuery = useRecentWorkouts(userId);
  const questCountQuery = useQuestCount(userId);

  if (statsQuery.isLoading) {
    return <LoadingState label="Pulling status report..." />;
  }

  const stats = statsQuery.data;
  const questCount = questCountQuery.data ?? 0;

  const weeklyData = useMemo(() => {
    const workouts = workoutsQuery.data ?? [];
    const today = dayjs().startOf('day');
    return Array.from({ length: 7 }).map((_, idx) => {
      const day = today.subtract(6 - idx, 'day');
      const count = workouts.filter((workout) => dayjs(workout.timestamp).isSame(day, 'day')).length;
      return {
        day: day.format('ddd').charAt(0),
        quests: count,
      };
    });
  }, [workoutsQuery.data]);

  const maxQuests = Math.max(...weeklyData.map((d) => d.quests), 1);

  const missions = [
    { id: 1, title: 'Complete 30 quests', progress: Math.min(questCount, 30), total: 30 },
    { id: 2, title: 'Maintain 14-day streak', progress: Math.min(stats?.streak_days ?? 0, 14), total: 14 },
    { id: 3, title: 'Reach Level 10', progress: stats?.level ?? 1, total: 10 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Status</Text>
          <Text style={styles.subtitle}>Track your progress</Text>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>This week</Text>
            <View style={styles.chartContainer}>
              {weeklyData.map((data, i) => (
                <View key={i} style={styles.chartBarWrapper}>
                  <View style={styles.chartBarContainer}>
                    {data.quests > 0 && (
                      <LinearGradient
                        colors={['#3b82f6', '#60a5fa']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={[
                          styles.chartBar,
                          { height: data.quests > 0 ? `${(data.quests / maxQuests) * 100}%` : 4 },
                        ]}
                      />
                    )}
                    {data.quests === 0 && <View style={[styles.chartBar, styles.chartBarEmpty]} />}
                  </View>
                  <Text style={styles.chartLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Streak Stats */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Streak stats</Text>
            <View style={styles.statsGrid}>
              <StatCard
                label="Current"
                value={`${stats?.streak_days ?? 0}`}
                icon={<Ionicons name="flame" size={24} color="#f59e0b" />}
              />
              <StatCard
                label="Best"
                value="12"
                icon={<Ionicons name="trophy" size={24} color="#2563eb" />}
              />
              <StatCard
                label="Total"
                value={`${questCount}`}
                icon={<Ionicons name="target" size={24} color="#6b7280" />}
              />
            </View>
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Reminders</Text>
            <View style={styles.remindersList}>
              {['Morning training (8:00 AM)', 'Midday check-in (12:00 PM)', 'Evening log (8:00 PM)'].map(
                (reminder, index) => (
                  <View key={reminder} style={styles.reminderRow}>
                    <Text style={styles.reminderText}>{reminder}</Text>
                    <Switch
                      value={index < 2}
                      onValueChange={() => {}}
                      trackColor={{ false: '#d1d5db', true: '#2563eb' }}
                      thumbColor="#ffffff"
                    />
                  </View>
                ),
              )}
            </View>
          </View>
        </View>

        {/* Hero Missions */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hero missions</Text>
            <View style={styles.missionsList}>
              {missions.map((mission) => (
                <View key={mission.id} style={styles.missionItem}>
                  <View style={styles.missionHeader}>
                    <Text style={styles.missionTitle}>{mission.title}</Text>
                    <Text style={styles.missionProgress}>
                      {mission.progress}/{mission.total}
                    </Text>
                  </View>
                  <View style={styles.missionBar}>
                    <LinearGradient
                      colors={['#3b82f6', '#2563eb']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.missionBarFill, { width: `${(mission.progress / mission.total) * 100}%` }]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
  },
  section: {
    padding: 24,
    paddingBottom: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    gap: 16,
  },
  cardTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 128,
    gap: 8,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarEmpty: {
    backgroundColor: '#e5e7eb',
    height: 4,
  },
  chartLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  remindersList: {
    gap: 12,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reminderText: {
    color: '#111827',
    fontSize: 16,
  },
  missionsList: {
    gap: 16,
  },
  missionItem: {
    gap: 8,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTitle: {
    color: '#111827',
    fontSize: 16,
  },
  missionProgress: {
    color: '#6b7280',
    fontSize: 14,
  },
  missionBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  missionBarFill: {
    height: '100%',
    borderRadius: 999,
  },
});

