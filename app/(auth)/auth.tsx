import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { GOALS } from '@/src/config/progression';
import { SystemCard } from '@/src/components/SystemCard';
import { signInWithEmail, signUpWithProfile } from '@/src/services/api';
import { palette } from '@/src/theme/palette';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';

type Mode = 'signin' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const { session } = useSupabaseSession();
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [goal, setGoal] = useState<typeof GOALS[number]>(GOALS[0]);
  const [error, setError] = useState('');
  const [activated, setActivated] = useState(false);

  const authMutation = useMutation({
    mutationFn: async () => {
      setError('');
      if (mode === 'signin') {
        return signInWithEmail({ email, password });
      }
      if (!handle) throw new Error('Pick a hunter handle.');
      return signUpWithProfile({ email, password, handle, goal });
    },
    onSuccess: () => {
      if (mode === 'signup') {
        setActivated(true);
      }
    },
    onError: (mutationError: Error) => setError(mutationError.message),
  });

  const disableSubmit =
    !email || !password || (mode === 'signup' && (!handle || !goal)) || authMutation.isPending;

  useEffect(() => {
    if (session && !authMutation.isPending) {
      router.replace('/(tabs)');
    }
  }, [session, authMutation.isPending, router]);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.stack}
        >
          <Text style={styles.kicker}>Level-Up IRL</Text>
          <Text style={styles.title}>Solo-level your real life grind.</Text>
          <View style={styles.modeSwitch}>
            <ModeToggle label="Create Hunter" active={mode === 'signup'} onPress={() => setMode('signup')} />
            <ModeToggle label="Sign In" active={mode === 'signin'} onPress={() => setMode('signin')} />
          </View>
          <View style={styles.form}>
            <Label>System email</Label>
            <Input placeholder="you@hunter.com" keyboardType="email-address" value={email} onChangeText={setEmail} />

            <Label>Secret phrase</Label>
            <Input placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />

            {mode === 'signup' && (
              <>
                <Label>Hunter handle</Label>
                <Input placeholder="ShadowMonarch" value={handle} onChangeText={setHandle} autoCapitalize="none" />

                <Label>Primary goal</Label>
                <View style={styles.goalGrid}>
                  {GOALS.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setGoal(option)}
                      style={[styles.goalChip, goal === option && styles.goalChipActive]}
                    >
                      <Text style={goal === option ? styles.goalChipActiveText : styles.goalChipText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.cta, disableSubmit && styles.ctaDisabled]}
            disabled={disableSubmit}
            onPress={() => authMutation.mutate()}
          >
            <Text style={styles.ctaLabel}>
              {authMutation.isPending ? 'Booting System...' : mode === 'signup' ? 'Activate System' : 'Enter HQ'}
            </Text>
          </Pressable>

          {activated && (
            <SystemCard
              title="System online!"
              subtitle="Rank: E-Rank • Level 1 • XP: 0"
              accent={palette.neonSoft}
            >
              <Text style={styles.cardText}>Welcome to your training arc. Tap “Enter HQ” once the portal opens.</Text>
            </SystemCard>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
      {authMutation.isPending && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator color={palette.neon} size="large" />
          <Text style={styles.loadingTitle}>Initializing greatness...</Text>
          <Text style={styles.loadingSubtitle}>Syncing with the System</Text>
        </View>
      )}
    </>
  );
}

const Label = ({ children }: { children: string }) => <Text style={styles.label}>{children}</Text>;

const Input = (props: TextInputProps) => (
  <TextInput
    placeholderTextColor="#5f678a"
    style={styles.input}
    autoCapitalize="none"
    autoCorrect={false}
    {...props}
  />
);

const ModeToggle = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable style={[styles.mode, active && styles.modeActive]} onPress={onPress}>
    <Text style={active ? styles.modeLabelActive : styles.modeLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    padding: 24,
  },
  stack: {
    gap: 16,
  },
  kicker: {
    color: palette.neonSoft,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  modeSwitch: {
    flexDirection: 'row',
    gap: 12,
  },
  mode: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modeActive: {
    borderColor: palette.neon,
    backgroundColor: '#1a1f38',
  },
  modeLabel: {
    color: palette.textSecondary,
    fontWeight: '500',
  },
  modeLabelActive: {
    color: palette.textPrimary,
    fontWeight: '700',
  },
  form: {
    gap: 8,
    marginTop: 8,
  },
  label: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.textPrimary,
    backgroundColor: palette.surface,
    fontSize: 16,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  goalChipActive: {
    borderColor: palette.neon,
    backgroundColor: '#211c3f',
  },
  goalChipText: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  goalChipActiveText: {
    color: palette.textPrimary,
    fontWeight: '600',
  },
  cta: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: palette.neon,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: palette.neon,
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaLabel: {
    color: '#050505',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  error: {
    color: palette.danger,
    textAlign: 'center',
  },
  cardText: {
    color: palette.textPrimary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(5, 6, 14, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  loadingTitle: {
    color: palette.neon,
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  loadingSubtitle: {
    color: palette.textSecondary,
    fontSize: 14,
  },
});

