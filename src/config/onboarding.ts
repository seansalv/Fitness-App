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
  type?: 'select' | 'input' | 'wheel' | 'weight' | 'height' | 'slider' | 'chips' | 'schedule';
  multi?: boolean;
  placeholder?: string;
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
      { label: 'Appearance', value: 'appearance' },
      { label: 'Stress relief', value: 'stress' },
      { label: 'Social support', value: 'social' },
      { label: 'Enjoyment', value: 'enjoyment' },
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
  {
    id: 'activity',
    prompt: 'Choose your activity level',
    options: [
      { label: 'Sedentary', value: 'sedentary', helper: 'Little to no exercise' },
      { label: 'Lightly active', value: 'light', helper: '1-3 sessions per week' },
      { label: 'Moderately active', value: 'moderate', helper: '4-6 sessions per week' },
      { label: 'Very active', value: 'heavy', helper: 'Training every day' },
    ],
  },
  {
    id: 'focus',
    prompt: 'Choose your focus areas',
    multi: true,
    options: [
      { label: 'Full Body', value: 'full' },
      { label: 'Chest', value: 'chest' },
      { label: 'Back', value: 'back' },
      { label: 'Arms', value: 'arms' },
      { label: 'Shoulders', value: 'shoulders' },
      { label: 'Abs', value: 'abs' },
      { label: 'Legs', value: 'legs' },
      { label: 'Glutes', value: 'glutes' },
    ],
  },
  {
    id: 'age',
    prompt: 'How old are you?',
    type: 'wheel',
    options: [],
  },
  {
    id: 'weight',
    prompt: 'What is your current weight?',
    type: 'weight',
    options: [],
  },
  {
    id: 'height',
    prompt: 'How tall are you?',
    type: 'height',
    options: [],
  },
  {
    id: 'frequency',
    prompt: 'How often would you like to work out?',
    type: 'slider',
    options: [],
  },
  {
    id: 'equipment',
    prompt: 'What equipment do you have access to?',
    type: 'chips',
    multi: true,
    options: [
      { label: 'None (bodyweight)', value: 'bodyweight' },
      { label: 'Full gym', value: 'gym' },
      { label: 'Barbells', value: 'barbells' },
      { label: 'Dumbbells', value: 'dumbbells' },
      { label: 'Kettlebells', value: 'kettlebells' },
      { label: 'Machines', value: 'machines' },
    ],
  },
  {
    id: 'schedule',
    prompt: 'Set your workout days',
    type: 'schedule',
    options: [],
  },
];

