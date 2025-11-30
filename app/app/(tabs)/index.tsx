import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  { day: 'Friday', sessions: ['Flexibility'] },
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

  const questIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    gym: 'barbell-outline',
    cardio: 'heart-outline',
    study: 'book-outline',
    mindfulness: 'sparkles-outline',
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome back, {profile?.handle ?? 'Hero'}</Text>
            <Text style={styles.subheading}>Day {Math.max(streakDays, 1)} of your arc</Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Ionicons name="shield-outline" size={20} color={palette.neon} />
              <Text style={styles.badgeText}>
                LV {stats?.level ?? xpDetail.level} · Rank {stats?.rank ?? 'E'}
              </Text>
            </View>
          </View>
        </View>

        {/* XP & Streak Section */}
        <View style={styles.xpSection}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP Progress</Text>
            <Text style={styles.xpValue}>
              {Math.round(xpDetail.xpIntoLevel)} / {xpDetail.xpToLevelUp}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${xpPercent * 100}%` }]}
            />
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={20} color="#f59e0b" />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{streakDays} day streak</Text>
                <Text style={styles.statSubtext}>Keep it up!</Text>
              </View>
            </View>
            <View style={styles.statItemRight}>
              <Text style={styles.statValue}>{weeklyQuestCount} / {profile?.weekly_goal ?? 3}</Text>
              <Text style={styles.statSubtext}>this week</Text>
            </View>
          </View>
        </View>

        {/* Today's Quests */}
        <View style={styles.questsSection}>
          <Text style={styles.sectionTitle}>Today's quests</Text>
          <View style={styles.questList}>
            {loadingQuests && <Text style={styles.empty}>Loading quests...</Text>}
            {!loadingQuests && workouts.length === 0 && (
              <View style={styles.questCard}>
                <View style={styles.questInfo}>
                  <View style={styles.questIconContainer}>
                    <Ionicons name="barbell-outline" size={20} color={palette.neon} />
                  </View>
                  <View style={styles.questDetails}>
                    <Text style={styles.questTitle}>Morning strength session</Text>
                    <View style={styles.questMetaRow}>
                      <Text style={styles.questMeta}>Strength</Text>
                      <Text style={styles.questXp}>+50 XP</Text>
                    </View>
                  </View>
                </View>
                <Pressable style={styles.logButton} onPress={() => router.push('/quest')}>
                  <Text style={styles.logButtonText}>Log</Text>
                </Pressable>
              </View>
            )}
            {!loadingQuests && workouts.slice(0, 3).map((quest) => (
              <View key={quest.id} style={styles.questCard}>
                <View style={styles.questInfo}>
                  <View style={styles.questIconContainer}>
                    <Ionicons
                      name={questIcons[quest.type] || 'barbell-outline'}
                      size={20}
                      color={palette.neon}
                    />
                  </View>
                  <View style={styles.questDetails}>
                    <Text style={styles.questTitle}>{QUEST_TYPES[quest.type]}</Text>
                    <View style={styles.questMetaRow}>
                      <Text style={styles.questMeta}>{INTENSITY_LABELS[quest.intensity]}</Text>
                      <Text style={styles.questXp}>+{quest.xp_awarded} XP</Text>
                    </View>
                  </View>
                </View>
                <Pressable style={styles.logButton} onPress={() => router.push('/quest')}>
                  <Text style={styles.logButtonText}>Log</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Training */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming training</Text>
          <View style={styles.scheduleCard}>
            {UPCOMING_TEMPLATE.map((entry, idx) => (
              <View key={entry.day} style={[styles.scheduleRow, idx < UPCOMING_TEMPLATE.length - 1 && styles.scheduleRowBorder]}>
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

        {/* Hero Tip */}
        <View style={styles.tipCard}>
          <Ionicons name="flash-outline" size={20} color={palette.neon} style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>Hero tip</Text>
            <Text style={styles.tipCopy}>
              Consistency beats intensity. Even a short session counts toward your arc.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
  headerContent: {
    marginBottom: 12,
  },
  greeting: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subheading: {
    color: '#6b7280',
    fontSize: 14,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  xpSection: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpLabel: {
    color: '#6b7280',
    fontSize: 13,
  },
  xpValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItemRight: {
    alignItems: 'flex-end',
  },
  statContent: {
    gap: 2,
  },
  statValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  statSubtext: {
    color: '#6b7280',
    fontSize: 13,
  },
  questsSection: {
    padding: 24,
    gap: 16,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  questList: {
    gap: 12,
  },
  questCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  questIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questDetails: {
    flex: 1,
    gap: 4,
  },
  questTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  questMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questMeta: {
    color: '#6b7280',
    fontSize: 12,
  },
  questXp: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: '600',
  },
  logButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    color: '#6b7280',
    padding: 16,
    textAlign: 'center',
  },
  upcomingSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  scheduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  scheduleRow: {
    padding: 16,
    gap: 8,
  },
  scheduleRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  scheduleDay: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 4,
  },
  sessionChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  sessionChipText: {
    color: '#374151',
    fontSize: 13,
  },
  tipCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    padding: 24,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#eff6ff',
  },
  tipIcon: {
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
    gap: 4,
  },
  tipLabel: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipCopy: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18,
  },
});
