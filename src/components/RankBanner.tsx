import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { RankTier } from '@/src/config/progression';
import { palette } from '@/src/theme/palette';

type Props = {
  previousRank: RankTier;
  nextRank: RankTier;
  visible: boolean;
};

export const RankBanner = ({ previousRank, nextRank, visible }: Props) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 12,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -80,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.banner, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.title}>Rank Up!</Text>
      <Text style={styles.body}>
        You evolved from {previousRank}-Rank to {nextRank}-Rank hunter.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 32,
    left: 16,
    right: 16,
    borderRadius: 16,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.neon,
    padding: 16,
    shadowColor: palette.neon,
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  title: {
    color: palette.neon,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  body: {
    color: palette.textPrimary,
    marginTop: 4,
    fontSize: 14,
  },
});

