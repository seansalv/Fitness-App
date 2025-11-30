import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoadingState } from '@/src/components/LoadingState';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserStats } from '@/src/hooks/useUserStats';
import { useRecentWorkouts } from '@/src/hooks/useWorkouts';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';
import { palette } from '@/src/theme/palette';
import { INTENSITY_LABELS, QUEST_TYPES, getLevelProgressDetail } from '@/src/config/progression';

dayjs.extend(relativeTime);

const UPCOMING_TEMPLATE = [
  { day: 'Tomorrow', sessions: ['Strength', 'Cardio'] },
  { day: 'Friday', sessions: ['Mobility'] },
  { day: 'Saturday', sessions: ['Zone 2', 'Core'] },
];

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

  const xpDetail = getLevelProgressDetail(stats?.total_xp ?? 0);
  const xpPercent = Math.min(1, xpDetail.xpIntoLevel / Math.max(1, xpDetail.xpToLevelUp));
  const streakDays = stats?.streak_days ?? 0;
  const weeklyQuestCount = workouts.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.greeting}>Welcome back, {profile?.handle ?? 'Hero'}</Text>
          <Text style={styles.subheading}>Ready for day {Math.max(streakDays, 1)} of your arc</Text>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Level</Text>
            <Text style={styles.badgeValue}>{stats?.level ?? xpDetail.level}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Rank</Text>
            <Text style={styles.badgeValue}>{stats?.rank ?? 'E'}</Text>
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>XP Progress</Text>
          <Text style={styles.progressValue}>
            {Math.round(xpDetail.xpIntoLevel)} / {xpDetail.xpToLevelUp}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${xpPercent * 100}%` }]} />
        </View>

        <View style={styles.heroStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{weeklyQuestCount}</Text>
            <Text style={styles.statLabel}>Quests this week</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stats?.total_xp ?? 0}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        <Pressable style={styles.primaryCta} onPress={() => router.push('/quest')}>
          <Text style={styles.primaryCtaLabel}>Start quest</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent quests</Text>
          <Text style={styles.sectionMeta}>
            {loadingQuests ? 'Syncing...' : `${Math.min(workouts.length, 5)} shown`}
          </Text>
        </View>
        <View style={styles.questList}>
          {loadingQuests && <Text style={styles.empty}>Fetching quest log...</Text>}
          {!loadingQuests && workouts.length === 0 && (
            <Text style={styles.empty}>No quests logged yet. Start one now.</Text>
          )}
          {workouts.slice(0, 5).map((quest) => (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questInfo}>
                <Text style={styles.questTitle}>{QUEST_TYPES[quest.type]}</Text>
                <Text style={styles.questMeta}>
                  {INTENSITY_LABELS[quest.intensity]} • {quest.duration_minutes} min
                </Text>
                <Text style={styles.questTime}>{dayjs(quest.timestamp).fromNow()}</Text>
              </View>
              <Text style={styles.questXp}>+{quest.xp_awarded} XP</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming training</Text>
        <View style={styles.scheduleCard}>
          {UPCOMING_TEMPLATE.map((entry) => (
            <View key={entry.day} style={styles.scheduleRow}>
              <Text style={styles.scheduleDay}>{entry.day}</Text>
              <View style={styles.sessionChipRow}>
                {entry.sessions.map((session) => (
                  <View key={session} style={styles.sessionChip}>
                    <Text style={styles.sessionChipText}>{session}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Hero tip</Text>
        <Text style={styles.tipCopy}>
          Consistency beats intensity. Even a short check-in counts toward your arc—protect the streak.
        </Text>
      </View>
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
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  heroHeader: {
    gap: 4,
  },
  greeting: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '600',
  },
  subheading: {
    color: palette.textSecondary,
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: palette.muted,
    padding: 12,
  },
  badgeLabel: {
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 1,
    color: palette.textSecondary,
  },
  badgeValue: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.textPrimary,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  progressValue: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  progressBar: {
    height: 10,
    backgroundColor: palette.muted,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: palette.neon,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'flex-start',
    flex: 1,
  },
  statValue: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  primaryCta: {
    marginTop: 8,
    backgroundColor: palette.neon,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryCtaLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  sectionMeta: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  questList: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#ffffff',
  },
  questCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  questInfo: {
    flex: 1,
    gap: 2,
  },
  questTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  questMeta: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  questTime: {
    color: palette.textSecondary,
    fontSize: 12,
  },
  questXp: {
    color: palette.neon,
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    color: palette.textSecondary,
    padding: 16,
    textAlign: 'center',
  },
  scheduleCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#ffffff',
  },
  scheduleRow: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
    gap: 8,
  },
  scheduleDay: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  sessionChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: palette.muted,
  },
  sessionChipText: {
    color: palette.textPrimary,
    fontSize: 12,
  },
  tipCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#ffffff',
    padding: 20,
    gap: 6,
  },
  tipLabel: {
    textTransform: 'uppercase',
    color: palette.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  tipCopy: {
    color: palette.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});
