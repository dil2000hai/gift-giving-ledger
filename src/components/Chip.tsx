import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  grow?: boolean;
  tone?: 'primary' | 'accent';
};

export function Chip({ label, active, onPress, grow = false, tone = 'primary' }: Props) {
  const activeBg = tone === 'accent' ? theme.colors.accent : theme.colors.primary;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[
        styles.chip,
        grow ? styles.grow : null,
        active ? { backgroundColor: activeBg, borderColor: activeBg } : styles.idle,
      ]}>
      <Text style={[styles.label, active ? styles.labelOn : styles.labelOff]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    minWidth: 76,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grow: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 8,
  },
  idle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  labelOn: {
    color: theme.colors.onPrimary,
  },
  labelOff: {
    color: theme.colors.textMid,
  },
});

export default React.memo(Chip);
