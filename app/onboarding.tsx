import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ONBOARDING_QUESTIONS } from '@/src/config/onboarding';
import { palette } from '@/src/theme/palette';
import { saveOnboardingAnswers } from '@/src/services/storage';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = ONBOARDING_QUESTIONS;
  const current = questions[step];
  const total = questions.length;
  const progress = (step + 1) / total;
  const selected = answers[current.id];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleContinue = async () => {
    if (!selected) return;
    if (step === total - 1) {
      await saveOnboardingAnswers(answers);
      router.push('/(auth)/auth');
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.prompt}>{current.prompt}</Text>
        <View style={styles.options}>
          {current.options.map((option) => {
            const isActive = selected === option.value;
            return (
              <Pressable
                key={option.value}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={styles.optionRow}>
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    {option.helper && <Text style={styles.optionHelper}>{option.helper}</Text>}
                  </View>
                  {option.icon && <Text style={styles.optionIcon}>{option.icon}</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Pressable
        style={[styles.cta, !selected && styles.ctaDisabled]}
        onPress={handleContinue}
        disabled={!selected}
      >
        <Text style={styles.ctaLabel}>{step === total - 1 ? 'Finish' : 'Continue'}</Text>
      </Pressable>
      <View style={styles.gesture} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    padding: 24,
    paddingBottom: 40,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#1c2238',
    marginTop: 16,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#65cfff',
  },
  content: {
    flexGrow: 1,
    gap: 16,
  },
  prompt: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.textPrimary,
    textAlign: 'center',
  },
  options: {
    gap: 12,
  },
  option: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f2640',
    padding: 18,
    backgroundColor: '#0a0f20',
  },
  optionActive: {
    borderColor: '#3dd598',
    backgroundColor: '#0f2b24',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTextWrap: {
    flex: 1,
    gap: 4,
  },
  optionLabel: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  optionHelper: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  optionIcon: {
    fontSize: 20,
    color: '#9fb4ff',
  },
  cta: {
    marginTop: 24,
    borderRadius: 999,
    backgroundColor: palette.neon,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaLabel: {
    color: '#050505',
    fontSize: 18,
    fontWeight: '700',
  },
  gesture: {
    width: '40%',
    height: 4,
    borderRadius: 999,
    backgroundColor: '#ffffff20',
    alignSelf: 'center',
    marginTop: 12,
  },
});

