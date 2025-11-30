import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Sparkles, Sword } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LoadingState } from '@/src/components/LoadingState';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';

export default function Index() {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();

  if (isLoading) {
    return <LoadingState />;
  }

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <LinearGradient colors={['#eff6ff', '#ffffff']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Hero Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationWrapper}>
            {/* Central rotated gradient box */}
            <View style={styles.heroCore}>
              <LinearGradient
                colors={['#60a5fa', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCoreGradient}
              />
            </View>
            
            {/* Top left sparkle */}
            <View style={styles.sparkleTopLeft}>
              <Sparkles size={32} color="#3b82f6" strokeWidth={2.5} />
            </View>
            
            {/* Bottom right sparkle */}
            <View style={styles.sparkleBottomRight}>
              <Sparkles size={24} color="#f59e0b" strokeWidth={2.5} />
            </View>
            
            {/* Center sword */}
            <View style={styles.swordContainer}>
              <Sword size={96} color="#2563eb" strokeWidth={2.5} />
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.copyBlock}>
          <Text style={styles.heading}>This is your training arc.</Text>
          <Text style={styles.subtitle}>
            Build habits, complete quests, and level up your real-world stats—one session at a time.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.primaryCta} onPress={() => router.push('/onboarding')}>
            <Text style={styles.primaryCtaLabel}>Begin training</Text>
          </Pressable>
          <Pressable style={styles.secondaryCta} onPress={() => router.push('/(auth)/auth')}>
            <Text style={styles.secondaryCtaLabel}>Log in to Hero HQ</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationWrapper: {
    width: 256,
    height: 256,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCore: {
    width: 160,
    height: 192,
    borderRadius: 24,
    transform: [{ rotate: '45deg' }],
    overflow: 'hidden',
    opacity: 0.1,
    zIndex: 1,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -96,
    marginLeft: -80,
  },
  heroCoreGradient: {
    width: '100%',
    height: '100%',
  },
  sparkleTopLeft: {
    position: 'absolute',
    top: 48,
    left: 32,
    zIndex: 20,
    opacity: 0.3,
  },
  sparkleBottomRight: {
    position: 'absolute',
    bottom: 64,
    right: 48,
    zIndex: 20,
    opacity: 0.4,
  },
  swordContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    opacity: 0.2,
  },
  copyBlock: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: 24,
  },
  heading: {
    color: '#111827',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    paddingBottom: 32,
  },
  primaryCta: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryCtaLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryCta: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  secondaryCtaLabel: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
});

