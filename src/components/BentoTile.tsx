import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  style?: ViewStyle | ViewStyle[];
  anim?: Animated.Value;
  children: React.ReactNode;
};

/** The SOFT_UI surface every bento cell sits on. */
export function BentoTile({ style, anim, children }: Props) {
  if (!anim) {
    return <View style={[styles.tile, style]}>{children}</View>;
  }
  const pop = anim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.tile, style, { opacity: anim, transform: [{ scale: pop }] }]}>
      {children}
    </Animated.View>
  );
}

type StatProps = {
  label: string;
  value: number;
  color: string;
};

/** A bento stat cell: dot + number + caption. A zero shows an em dash. */
export function BentoStat({ label, value, color }: StatProps) {
  return (
    <View style={styles.statInner}>
      <View style={styles.statTop}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={[styles.statValue, value > 0 ? { color } : styles.statZero]}>
        {value > 0 ? value : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  statInner: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.textSoft,
  },
  statValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  statZero: {
    color: '#C8A8B6',
  },
});

export default BentoTile;
