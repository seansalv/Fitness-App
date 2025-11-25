import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProviders } from '@/src/providers/AppProviders';
import { palette } from '@/src/theme/palette';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AppProviders>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="quest"
            options={{
              headerShown: true,
              presentation: 'modal',
              title: 'Start Quest',
              headerTintColor: palette.textPrimary,
              headerStyle: { backgroundColor: palette.background },
            }}
          />
        </Stack>
        <StatusBar style="light" />
      </AppProviders>
    </ThemeProvider>
  );
}
