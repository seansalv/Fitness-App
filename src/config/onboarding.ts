export type OnboardingOption = {
  label: string;
  value: string;
  icon?: string;
  helper?: string;
};

export type OnboardingQuestion = {
  id: string;
  prompt: string;
  options: OnboardingOption[];
};

export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'gender',
    prompt: 'Choose your identity',
    options: [
      { label: 'Hero', value: 'male', icon: '♂' },
      { label: 'Heroine', value: 'female', icon: '♀' },
      { label: 'Custom', value: 'other', icon: '⚬' },
    ],
  },
  {
    id: 'motivation',
    prompt: 'What drives your arc?',
    options: [
      { label: 'Strength', value: 'strength' },
      { label: 'Discipline', value: 'discipline' },
      { label: 'Confidence', value: 'confidence' },
      { label: 'Legacy', value: 'legacy' },
    ],
  },
  {
    id: 'experience',
    prompt: 'What is your hero tier?',
    options: [
      { label: 'Rookie', value: 'beginner', helper: 'New to training' },
      { label: 'Provisional', value: 'intermediate', helper: 'Some reps logged' },
      { label: 'Veteran', value: 'advanced', helper: 'Seasoned hero' },
    ],
  },
];

