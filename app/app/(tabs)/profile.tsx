import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { LoadingState } from '@/src/components/LoadingState';
import { useProfile } from '@/src/hooks/useProfile';
import { useUserStats } from '@/src/hooks/useUserStats';
import { useQuestCount } from '@/src/hooks/useWorkouts';
import { signOut } from '@/src/services/api';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';

const achievements = [
  { id: 1, name: 'First Quest', icon: 'sword-outline' as const, unlocked: true, color: '#3b82f6' },
  { id: 2, name: 'Week Warrior', icon: 'flash-outline' as const, unlocked: true, color: '#f59e0b' },
  { id: 3, name: 'Consistency King', icon: 'trophy-outline' as const, unlocked: false, color: '#9ca3af' },
  { id: 4, name: 'Century Club', icon: 'target-outline' as const, unlocked: false, color: '#9ca3af' },
];

export default function ProfileScreen() {
  const { session } = useSupabaseSession();
  const userId = session?.user?.id;
  const profileQuery = useProfile(userId);
  const statsQuery = useUserStats(userId);
  const questCountQuery = useQuestCount(userId);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (profileQuery.isLoading || statsQuery.isLoading) {
    return <LoadingState label="Loading profile..." />;
  }

  const profile = profileQuery.data;
  const stats = statsQuery.data;
  const questCount = questCountQuery.data ?? 0;

  const statsData = [
    { label: 'Total XP', value: (stats?.total_xp ?? 0).toLocaleString(), icon: 'flash-outline' as const, color: '#f59e0b' },
    { label: 'Best Streak', value: `${stats?.streak_days ?? 0} days`, icon: 'calendar-outline' as const, color: '#2563eb' },
    { label: 'Quests Done', value: questCount.toString(), icon: 'target-outline' as const, color: '#10b981' },
  ];

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await signOut();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#2563eb', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#ffffff" />
            </View>

            {/* Name & Level */}
            <Text style={styles.name}>{profile?.handle ?? 'Hero'}</Text>
            <View style={styles.levelBadge}>
              <Ionicons name="shield" size={16} color="#ffffff" />
              <Text style={styles.levelText}>
                Level {stats?.level ?? 1} · Rank {stats?.rank ?? 'E'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              {statsData.map((stat, i) => (
                <View key={i} style={styles.statItem}>
                  <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: `${achievement.color}15` },
                    !achievement.unlocked && styles.achievementLocked,
                  ]}
                >
                  <Ionicons
                    name={achievement.icon}
                    size={28}
                    color={achievement.unlocked ? achievement.color : '#9ca3af'}
                  />
                </View>
                <Text
                  style={[styles.achievementName, !achievement.unlocked && styles.achievementNameLocked]}
                >
                  {achievement.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="person-outline" size={20} color="#6b7280" />
                </View>
                <Text style={styles.menuItemText}>Edit profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="settings-outline" size={20} color="#6b7280" />
                </View>
                <Text style={styles.menuItemText}>Preferences</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="notifications-outline" size={20} color="#6b7280" />
                </View>
                <Text style={styles.menuItemText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="help-circle-outline" size={20} color="#6b7280" />
                </View>
                <Text style={styles.menuItemText}>Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="trophy-outline" size={20} color="#6b7280" />
                </View>
                <View>
                  <Text style={styles.menuItemText}>About Hero Arc</Text>
                  <Text style={styles.menuItemSubtext}>Version 1.0.0</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Pressable
            style={styles.logoutButton}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>End your session?</Text>
            <Text style={styles.modalText}>
              You can always return to Hero HQ and continue your training arc.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButtonPrimary} onPress={handleLogout}>
                <Text style={styles.modalButtonPrimaryText}>Log out</Text>
              </Pressable>
              <Pressable style={styles.modalButtonSecondary} onPress={() => setShowLogoutConfirm(false)}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsSection: {
    marginTop: -24,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementName: {
    color: '#111827',
    fontSize: 12,
    textAlign: 'center',
  },
  achievementNameLocked: {
    color: '#9ca3af',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    color: '#111827',
    fontSize: 16,
  },
  menuItemSubtext: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
  },
  logoutText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    gap: 24,
  },
  modalTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '600',
  },
  modalText: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
  },
  modalButtons: {
    gap: 12,
  },
  modalButtonPrimary: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonSecondary: {
    padding: 12,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#6b7280',
    fontSize: 16,
  },
});

