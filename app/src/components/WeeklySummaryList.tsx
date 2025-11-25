import { FlatList, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/src/theme/palette';

export type WeeklyDatum = {
  key: string;
  label: string;
  count: number;
};

export const WeeklySummaryList = ({ data }: { data: WeeklyDatum[] }) => (
  <FlatList
    data={data}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.list}
    keyExtractor={(item) => item.key}
    renderItem={({ item }) => (
      <View style={[styles.item, item.count > 0 && styles.itemActive]}>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.value}>{item.count}</Text>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  item: {
    width: 66,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: palette.surface,
  },
  itemActive: {
    borderColor: palette.neon,
    backgroundColor: '#181f38',
  },
  label: {
    color: palette.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  value: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
});

