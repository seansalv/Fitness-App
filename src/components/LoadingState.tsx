import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';

export const LoadingState = ({ label = 'Booting system...' }: { label?: string }) => (
  <View style={styles.container}>
    <ActivityIndicator color={palette.neon} size="large" />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  label: {
    color: palette.textSecondary,
    fontSize: 14,
  },
});

