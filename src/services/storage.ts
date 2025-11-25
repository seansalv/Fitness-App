import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'heroarc:onboarding';

export type OnboardingAnswerValue = string | string[] | Record<string, unknown>;
export type OnboardingAnswers = Record<string, OnboardingAnswerValue>;

export const saveOnboardingAnswers = async (answers: OnboardingAnswers) => {
  await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(answers));
};

export const getOnboardingAnswers = async () => {
  const payload = await AsyncStorage.getItem(ONBOARDING_KEY);
  return payload ? (JSON.parse(payload) as OnboardingAnswers) : {};
};

