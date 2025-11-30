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
          backgroundColor: '#ffffff',
          borderTopColor: 'transparent',
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 24,
          height: 70,
          paddingBottom: 8,
          shadowColor: palette.shadow,
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
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
