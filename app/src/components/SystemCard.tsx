import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';

type Props = {
  title?: string;
  subtitle?: string;
  accent?: string;
  children?: ReactNode;
};

export const SystemCard = ({ title, subtitle, accent = palette.neon, children }: Props) => (
  <View style={[styles.card, { borderColor: accent }]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: palette.neon,
    padding: 16,
    borderRadius: 16,
    backgroundColor: palette.surface,
    shadowColor: palette.neon,
    shadowOpacity: 0.3,
    shadowRadius: 12,
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

