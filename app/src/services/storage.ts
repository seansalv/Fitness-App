import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OnboardingAnswers } from '@hero-arc/shared';

const ONBOARDING_KEY = 'heroarc:onboarding';

export const saveOnboardingAnswers = async (answers: OnboardingAnswers) => {
  await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(answers));
};

export const getOnboardingAnswers = async () => {
  const payload = await AsyncStorage.getItem(ONBOARDING_KEY);
  return payload ? (JSON.parse(payload) as OnboardingAnswers) : {};
};

