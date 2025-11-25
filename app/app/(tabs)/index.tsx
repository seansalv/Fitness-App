import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

import { LoadingState } from '@/src/components/LoadingState';
import { SystemCard } from '@/src/components/SystemCard';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserStats } from '@/src/hooks/useUserStats';
import { useRecentWorkouts } from '@/src/hooks/useWorkouts';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';
import { palette } from '@/src/theme/palette';
import { QUEST_TYPES, INTENSITY_LABELS } from '@/src/config/progression';

dayjs.extend(relativeTime);

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useSupabaseSession();
  const userId = session?.user?.id;
  const profileQuery = useProfile(userId);
  const statsQuery = useUserStats(userId);
  const workoutsQuery = useRecentWorkouts(userId);

  if (profileQuery.isLoading || statsQuery.isLoading) {
    return <LoadingState label="Syncing hero data..." />;
  }

  const profile = profileQuery.data;
  const stats = statsQuery.data;
  const workouts = workoutsQuery.data ?? [];
  const loadingQuests = workoutsQuery.isLoading;

  const lastQuest = workouts[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Hero HQ</Text>
      <Text style={styles.hero}>
        Hero {profile?.handle ?? '???'}
        {'\n'}
        <Text style={styles.goal}>{profile?.goal}</Text>
      </Text>

      <SystemCard title={`Rank ${stats?.rank}`} subtitle={`Level ${stats?.level} • ${stats?.total_xp} XP`}>
        <Text style={styles.cardBody}>
          {stats?.total_xp ? 'Keep stacking quests to evolve.' : 'Complete your first quest to earn XP.'}
        </Text>
      </SystemCard>

      <Pressable style={styles.cta} onPress={() => router.push('/quest')}>
        <Text style={styles.ctaLabel}>Start Quest</Text>
        <Text style={styles.ctaHint}>Log a workout and earn XP</Text>
      </Pressable>

      <SystemCard title="Streak monitor" subtitle={`Current streak: ${stats?.streak_days ?? 0} days`}>
        <Text style={styles.cardBody}>
          {stats?.last_activity_date
            ? `Last quest: ${dayjs(stats.last_activity_date).format('MMM D')}`
            : 'No quests logged yet.'}
        </Text>
      </SystemCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent quests</Text>
        <Text style={styles.sectionCount}>{workouts.length} logged this week</Text>
      </View>
      <View style={styles.list}>
        {loadingQuests && <Text style={styles.empty}>Fetching quest log...</Text>}
        {!loadingQuests && workouts.length === 0 && (
          <Text style={styles.empty}>No quests logged yet. Start one now.</Text>
        )}
        {workouts.slice(0, 5).map((quest) => (
          <View key={quest.id} style={styles.questRow}>
            <View>
              <Text style={styles.questTitle}>{QUEST_TYPES[quest.type]}</Text>
              <Text style={styles.questMeta}>
                {INTENSITY_LABELS[quest.intensity]} • {quest.duration_minutes} min •{' '}
                {dayjs(quest.timestamp).fromNow()}
              </Text>
            </View>
            <Text style={styles.questXp}>+{quest.xp_awarded} XP</Text>
          </View>
        ))}
      </View>

      {lastQuest && (
        <SystemCard title="Latest quest" subtitle={dayjs(lastQuest.timestamp).format('MMM D, h:mma')}>
          <Text style={styles.cardBody}>
            {QUEST_TYPES[lastQuest.type]} • {INTENSITY_LABELS[lastQuest.intensity]} • {lastQuest.duration_minutes} min
          </Text>
        </SystemCard>
      )}
    </ScrollView>
  );
}

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
  kicker: {
    color: palette.neonSoft,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  hero: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  goal: {
    color: palette.textSecondary,
    fontSize: 16,
    fontWeight: '400',
  },
  cardBody: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  cta: {
    borderRadius: 18,
    padding: 20,
    backgroundColor: palette.neon,
    shadowColor: palette.neon,
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  ctaLabel: {
    color: '#050505',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ctaHint: {
    color: '#1a1231',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionCount: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  list: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 18,
    backgroundColor: palette.surface,
  },
  empty: {
    color: palette.textSecondary,
    padding: 16,
    textAlign: 'center',
  },
  questRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3d',
  },
  questTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  questMeta: {
    color: palette.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  questXp: {
    color: palette.neon,
    fontWeight: '700',
  },
});
