import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { palette } from '@/src/theme/palette';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';
import { LoadingState } from '@/src/components/LoadingState';

export default function TabLayout() {
  const { session, isLoading } = useSupabaseSession();

  if (isLoading) {
    return <LoadingState label="Syncing system..." />;
  }

  if (!session) {
    return <Redirect href="/(auth)/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.neon,
        tabBarInactiveTintColor: palette.textSecondary,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hero HQ',
          tabBarIcon: ({ color }) => <Ionicons name="flash-outline" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="status"
        options={{
          title: 'Status',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
