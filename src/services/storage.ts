import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'heroarc:onboarding';

export const saveOnboardingAnswers = async (answers: Record<string, string>) => {
  await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(answers));
};

export const getOnboardingAnswers = async () => {
  const payload = await AsyncStorage.getItem(ONBOARDING_KEY);
  return payload ? (JSON.parse(payload) as Record<string, string>) : {};
};

