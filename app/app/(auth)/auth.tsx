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
import { signInWithEmail, signUpWithProfile } from '@/src/services/api';
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

  const authMutation = useMutation({
    mutationFn: async () => {
      setError('');
      if (mode === 'signin') {
        return signInWithEmail({ email, password });
      }
      if (!handle) throw new Error('Pick a hero alias.');
      return signUpWithProfile({ email, password, handle, goal });
    },
    onSuccess: () => {
      // User will be redirected via useEffect when session is available
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.keyboardView}
      >
        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleWrapper}>
            <Pressable
              style={[styles.toggleButton, mode === 'signup' && styles.toggleButtonActive]}
              onPress={() => setMode('signup')}
            >
              <Text style={mode === 'signup' ? styles.toggleTextActive : styles.toggleText}>Create hero</Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, mode === 'signin' && styles.toggleButtonActive]}
              onPress={() => setMode('signin')}
            >
              <Text style={mode === 'signin' ? styles.toggleTextActive : styles.toggleText}>Login</Text>
            </Pressable>
          </View>
        </View>

        {/* Form */}
        <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.field}>
                <Text style={styles.label}>Hero alias</Text>
                <Input
                  placeholder="What should we call you?"
                  value={handle}
                  onChangeText={setHandle}
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <Input
                placeholder="hero@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <Input placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={[styles.submitButton, disableSubmit && styles.submitButtonDisabled]}
              disabled={disableSubmit}
              onPress={() => authMutation.mutate()}
            >
              {authMutation.isPending ? (
                <View style={styles.loadingButtonContent}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.submitButtonText}>Syncing with HQ...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>{mode === 'signup' ? 'Create hero' : 'Sign in'}</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const Input = (props: TextInputProps) => (
  <TextInput
    placeholderTextColor="#9ca3af"
    style={styles.input}
    autoCapitalize="none"
    autoCorrect={false}
    {...props}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  toggleContainer: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 0,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 24,
    paddingTop: 16,
  },
  form: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#6b7280',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#111827',
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  loadingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

