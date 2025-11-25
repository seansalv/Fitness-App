import dayjs from 'dayjs';

export type QuestType = 'gym' | 'cardio' | 'at_home' | 'custom';
export type IntensityLevel = 'light' | 'medium' | 'intense';
export type RankTier = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export const QUEST_TYPES: Record<QuestType, string> = {
  gym: 'Gym',
  cardio: 'Cardio',
  at_home: 'At-home',
  custom: 'Custom',
};

export const GOALS = ['Build strength', 'Lose fat', 'Stay consistent', 'General leveling'] as const;

const BASE_XP_PER_MINUTE = 12;
const COMPLETION_BONUS = 20;

const INTENSITY_MULTIPLIER: Record<IntensityLevel, number> = {
  light: 0.85,
  medium: 1,
  intense: 1.35,
};

const TYPE_MULTIPLIER: Record<QuestType, number> = {
  gym: 1.1,
  cardio: 1.05,
  at_home: 0.95,
  custom: 1,
};

export const RANK_THRESHOLDS: { rank: RankTier; minXp: number }[] = [
  { rank: 'E', minXp: 0 },
  { rank: 'D', minXp: 500 },
  { rank: 'C', minXp: 1500 },
  { rank: 'B', minXp: 3200 },
  { rank: 'A', minXp: 5200 },
  { rank: 'S', minXp: 8200 },
  { rank: 'SS', minXp: 12000 },
  { rank: 'SSS', minXp: 17000 },
];

const LEVEL_BASE = 180;
const LEVEL_GROWTH = 1.12;

export const INTENSITY_LABELS: Record<IntensityLevel, string> = {
  light: 'Light',
  medium: 'Medium',
  intense: 'Intense',
};

export type QuestInput = {
  type: QuestType;
  intensity: IntensityLevel;
  durationMinutes: number;
};

export const calculateQuestXp = ({ type, intensity, durationMinutes }: QuestInput) => {
  const duration = Math.max(durationMinutes, 5);
  const raw =
    duration * BASE_XP_PER_MINUTE * INTENSITY_MULTIPLIER[intensity] * TYPE_MULTIPLIER[type] +
    COMPLETION_BONUS;
  return Math.round(raw);
};

export const deriveLevelFromXp = (totalXp: number) => {
  let level = 1;
  let remainingXp = Math.max(totalXp, 0);
  let threshold = LEVEL_BASE;

  while (remainingXp >= threshold) {
    remainingXp -= threshold;
    level += 1;
    threshold = Math.round(threshold * LEVEL_GROWTH);
  }

  return level;
};

export const deriveRankFromXp = (totalXp: number): RankTier => {
  const sorted = [...RANK_THRESHOLDS].sort((a, b) => a.minXp - b.minXp);
  let currentRank: RankTier = 'E';
  for (const rank of sorted) {
    if (totalXp >= rank.minXp) {
      currentRank = rank.rank;
    }
  }
  return currentRank;
};

export const calculateStreak = (previousDate: string | null, questDateIso: string, previousStreak: number) => {
  if (!previousDate) return 1;
  const prev = dayjs(previousDate).startOf('day');
  const current = dayjs(questDateIso).startOf('day');
  const diff = current.diff(prev, 'day');

  if (diff === 0) return previousStreak;
  if (diff === 1) return previousStreak + 1;
  return 1;
};

export const getProgressSnapshot = (totalXp: number) => ({
  totalXp,
  level: deriveLevelFromXp(totalXp),
  rank: deriveRankFromXp(totalXp),
});

