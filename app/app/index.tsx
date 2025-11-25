import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
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
    <LinearGradient colors={['#03050C', '#071833', '#02040B']} style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/hero-bg.png')}
        style={StyleSheet.absoluteFill}
        blurRadius={14}
        imageStyle={{ opacity: 0.35 }}
      />
      <StatusBar style="light" />
      <View style={styles.logoBadge}>
        <Text style={styles.logoMark}>HERO · ARC</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.hero}>AWAKEN</Text>
        <Text style={styles.subtitle}>Forge your Hero Arc.</Text>
      </View>
      <Pressable style={styles.cta} onPress={() => setShowInvite(true)}>
        <Text style={styles.ctaLabel}>Begin Training ›</Text>
      </Pressable>
      <View style={styles.progress} />
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
    padding: 32,
    justifyContent: 'space-between',
    backgroundColor: palette.background,
  },
  logoBadge: {
    marginTop: 32,
    alignItems: 'center',
  },
  logoMark: {
    color: '#d9e6ff',
    letterSpacing: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  hero: {
    color: palette.textPrimary,
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 18,
  },
  cta: {
    backgroundColor: '#fdfdfd',
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: palette.neon,
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  ctaLabel: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
  },
  progress: {
    height: 4,
    borderRadius: 999,
    backgroundColor: '#ffffff33',
    marginBottom: 8,
  },
  inviteOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(5, 6, 14, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inviteCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#0b1327',
    borderWidth: 1,
    borderColor: '#3d7bff',
    gap: 12,
    shadowColor: '#5fb4ff',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  inviteBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#5fb4ff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  inviteBadgeText: {
    color: '#5fb4ff',
    fontSize: 18,
    fontWeight: '700',
  },
  inviteTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#e4edff',
    fontWeight: '700',
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
    backgroundColor: '#5fb4ff',
  },
  inviteButtonLabel: {
    textAlign: 'center',
    color: '#050505',
    fontWeight: '700',
    fontSize: 16,
  },
});

