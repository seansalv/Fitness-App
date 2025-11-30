import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { RankBanner } from '@/src/components/RankBanner';
import { SystemCard } from '@/src/components/SystemCard';
import {
  INTENSITY_LABELS,
  IntensityLevel,
  QUEST_TYPES,
  QuestType,
} from '@/src/config/progression';
import { logQuest } from '@/src/services/api';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';
import { palette } from '@/src/theme/palette';
import { useRouter } from 'expo-router';

type QuestResult = Awaited<ReturnType<typeof logQuest>>;

export default function QuestScreen() {
  const router = useRouter();
  const { session } = useSupabaseSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const [questType, setQuestType] = useState<QuestType>('gym');
  const [intensity, setIntensity] = useState<IntensityLevel>('medium');
  const [duration, setDuration] = useState('30');
  const [result, setResult] = useState<QuestResult | null>(null);

  const questMutation = useMutation({
    mutationFn: () =>
      logQuest({
        userId: userId!,
        quest: {
          type: questType,
          intensity,
          durationMinutes: Number(duration),
        },
      }),
    onSuccess: async (data) => {
      setResult(data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user-stats', userId] }),
        queryClient.invalidateQueries({ queryKey: ['workouts', userId] }),
        queryClient.invalidateQueries({ queryKey: ['quest-count', userId] }),
      ]);
    },
    onError: (error: Error) => {
      Alert.alert('Quest failed', error.message);
    },
  });

  const handleSubmit = () => {
    if (!userId) {
      Alert.alert('No session', 'Sign in before logging quests.');
      return;
    }
    const numericDuration = Number(duration);
    if (!duration || Number.isNaN(numericDuration) || numericDuration < 5) {
      Alert.alert('Duration', 'Minimum quest duration is 5 minutes.');
      return;
    }
    questMutation.mutate();
  };

  const rankChanged = result && result.previousStats.rank !== result.updatedStats.rank;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <RankBanner
          previousRank={result?.previousStats.rank ?? 'E'}
          nextRank={result?.updatedStats.rank ?? 'E'}
          visible={Boolean(rankChanged)}
        />
        <Text style={styles.title}>Quest builder</Text>
        <Text style={styles.subtitle}>Log the details, then complete the quest.</Text>

        <Text style={styles.sectionLabel}>Quest type</Text>
        <View style={styles.choices}>
          {Object.entries(QUEST_TYPES).map(([key, label]) => (
            <Pressable
              key={key}
              style={[styles.choice, questType === key && styles.choiceActive]}
              onPress={() => setQuestType(key as QuestType)}
            >
              <Text style={questType === key ? styles.choiceLabelActive : styles.choiceLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Intensity</Text>
        <View style={styles.choices}>
          {Object.entries(INTENSITY_LABELS).map(([key, label]) => (
            <Pressable
              key={key}
              style={[styles.choice, intensity === key && styles.choiceActive]}
              onPress={() => setIntensity(key as IntensityLevel)}
            >
              <Text style={intensity === key ? styles.choiceLabelActive : styles.choiceLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="30"
          placeholderTextColor="#a0a3b1"
        />

        <Pressable
          style={[styles.submit, questMutation.isPending && styles.submitDisabled]}
          disabled={questMutation.isPending}
          onPress={handleSubmit}
        >
          <Text style={styles.submitLabel}>
            {questMutation.isPending ? 'Calculating XP...' : 'Complete Quest'}
          </Text>
        </Pressable>

        {result && (
          <SystemCard title="Quest complete" subtitle={`+${result.xpAwarded} XP`}>
            <Text style={styles.cardText}>
              Level {result.previousStats.level} ➜ Level {result.updatedStats.level}
            </Text>
            <Text style={styles.cardText}>
              Rank {result.previousStats.rank} ➜ Rank {result.updatedStats.rank}
            </Text>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonLabel}>Return to HQ</Text>
            </Pressable>
          </SystemCard>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 120,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.textSecondary,
  },
  sectionLabel: {
    color: palette.textSecondary,
    textTransform: 'uppercase',
    fontSize: 12,
    marginTop: 8,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choice: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  choiceActive: {
    borderColor: palette.neon,
    backgroundColor: '#eef2ff',
  },
  choiceLabel: {
    color: palette.textSecondary,
  },
  choiceLabelActive: {
    color: palette.neon,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    padding: 12,
    color: palette.textPrimary,
    backgroundColor: palette.muted,
    fontSize: 16,
  },
  submit: {
    borderRadius: 16,
    backgroundColor: palette.neon,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardText: {
    color: palette.textPrimary,
  },
  backButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  backButtonLabel: {
    color: palette.neon,
    fontWeight: '600',
  },
});

