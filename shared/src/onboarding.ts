export type Motivation =
  | 'strength'
  | 'discipline'
  | 'confidence'
  | 'legacy'
  | 'appearance'
  | 'stress'
  | 'social'
  | 'enjoyment';

export type FocusArea =
  | 'full'
  | 'chest'
  | 'back'
  | 'arms'
  | 'shoulders'
  | 'abs'
  | 'legs'
  | 'glutes';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy';

export type WeightAnswer = {
  unit: 'kg' | 'lbs';
  value: string;
};

export type HeightAnswer =
  | {
      unit: 'cm';
      cm: string;
    }
  | {
      unit: 'ft';
      feet: string;
      inches: string;
    };

export type FrequencyAnswer = {
  value: number;
};

export type ScheduleAnswer = {
  days: string[];
  reminder: boolean;
};

export type QuestPayload = {
  type: 'gym' | 'cardio' | 'at_home' | 'custom';
  intensity: 'light' | 'medium' | 'intense';
  durationMinutes: number;
};

export type OnboardingAnswerValue =
  | string
  | string[]
  | WeightAnswer
  | HeightAnswer
  | FrequencyAnswer
  | ScheduleAnswer
  | QuestPayload
  | Record<string, unknown>;

export type OnboardingAnswers = Record<string, OnboardingAnswerValue> & {
  userId?: string;
  gender?: string;
  motivation?: Motivation | Motivation[];
  experience?: 'beginner' | 'intermediate' | 'advanced';
  activity?: ActivityLevel;
  focus?: FocusArea[] | string;
  age?: string;
  weight?: WeightAnswer;
  target_weight?: WeightAnswer;
  height?: HeightAnswer;
  frequency?: FrequencyAnswer;
  equipment?: string[];
  schedule?: ScheduleAnswer;
  quest?: QuestPayload;
};

