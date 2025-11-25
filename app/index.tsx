import { Redirect } from 'expo-router';

import { LoadingState } from '@/src/components/LoadingState';
import { useSupabaseSession } from '@/src/providers/SupabaseSessionProvider';

export default function Index() {
  const { session, isLoading } = useSupabaseSession();

  if (isLoading) {
    return <LoadingState />;
  }

  return <Redirect href={session ? '/(tabs)' : '/(auth)/auth'} />;
}

