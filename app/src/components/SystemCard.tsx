import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';

type Props = {
  title?: string;
  subtitle?: string;
  accent?: string;
  children?: ReactNode;
};

export const SystemCard = ({ title, subtitle, accent, children }: Props) => (
  <View style={[styles.card, accent ? { borderColor: accent } : null]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: palette.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    gap: 8,
  },
  title: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: palette.textSecondary,
    fontSize: 13,
  },
});

