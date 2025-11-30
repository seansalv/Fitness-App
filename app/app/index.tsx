import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { LoadingState } from '@/src/components/LoadingState';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';
import { palette } from '@/src/theme/palette';

export default function Index() {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();
  const [showInvite, setShowInvite] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <LinearGradient colors={['#f3f6ff', '#ffffff']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        <View style={styles.heroIllustration}>
          <View style={styles.heroCore} />
          <View style={[styles.sparkle, styles.sparkleLeft]} />
          <View style={[styles.sparkle, styles.sparkleRight]} />
          <View style={styles.swordLine} />
        </View>
        <View style={styles.copyBlock}>
          <Text style={styles.tagline}>Hero Arc</Text>
          <Text style={styles.heading}>This is your training arc.</Text>
          <Text style={styles.subtitle}>
            Build habits, complete quests, and level up your real-world stats—one session at a time.
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.primaryCta} onPress={() => setShowInvite(true)}>
            <Text style={styles.primaryCtaLabel}>Begin training</Text>
          </Pressable>
          <Pressable style={styles.secondaryCta} onPress={() => router.push('/(auth)/auth')}>
            <Text style={styles.secondaryCtaLabel}>Log in to Hero HQ</Text>
          </Pressable>
        </View>
      </View>
      {showInvite && (
        <View style={styles.inviteOverlay}>
          <View style={styles.inviteCard}>
            <View style={styles.inviteBadge}>
              <Text style={styles.inviteBadgeText}>!</Text>
            </View>
            <Text style={styles.inviteTitle}>Hero Notification</Text>
            <Text style={styles.inviteBody}>
              You’ve been granted access to Hero Arc. Accept the call and start your awakening?
            </Text>
            <Pressable
              style={styles.inviteButton}
              onPress={() => {
                setShowInvite(false);
                router.push('/onboarding');
              }}
            >
              <Text style={styles.inviteButtonLabel}>Accept</Text>
            </Pressable>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  frame: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    shadowColor: palette.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 6,
    minHeight: 640,
    justifyContent: 'space-between',
  },
  heroIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
  },
  heroCore: {
    width: 190,
    height: 190,
    borderRadius: 40,
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#2563eb22',
  },
  sparkle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fcd34d40',
  },
  sparkleLeft: {
    top: 35,
    left: 40,
  },
  sparkleRight: {
    bottom: 40,
    right: 30,
  },
  swordLine: {
    position: 'absolute',
    width: 4,
    height: 180,
    borderRadius: 2,
    backgroundColor: '#2563eb33',
  },
  copyBlock: {
    gap: 12,
  },
  tagline: {
    textTransform: 'uppercase',
    color: palette.textSecondary,
    letterSpacing: 1.5,
    fontSize: 12,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  primaryCta: {
    backgroundColor: palette.neon,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryCtaLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryCta: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryCtaLabel: {
    color: palette.neon,
    fontSize: 16,
    fontWeight: '500',
  },
  inviteOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(3, 2, 19, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inviteCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: palette.border,
    gap: 12,
    shadowColor: palette.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  inviteBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.neon,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inviteBadgeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  inviteTitle: {
    textAlign: 'center',
    color: palette.textPrimary,
    fontWeight: '700',
    fontSize: 18,
  },
  inviteBody: {
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inviteButton: {
    marginTop: 4,
    borderRadius: 16,
    paddingVertical: 12,
    backgroundColor: palette.neon,
  },
  inviteButtonLabel: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});

