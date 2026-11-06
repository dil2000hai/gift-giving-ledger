import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { BTN_ICON } from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  height?: number;
};

/** Same icon box and lineHeight as PrimaryButton — they never diverge. */
export function SecondaryButton({ label, onPress, Icon, height = 48 }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.surface, { height, transform: [{ scale }] }]}>
        <View style={styles.row}>
          {Icon ? <Icon size={BTN_ICON} color={theme.colors.primary} strokeWidth={2.2} /> : null}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    alignSelf: 'stretch',
    borderRadius: theme.radius.md,
  },
  surface: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: BTN_ICON,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primary,
  },
});

export default SecondaryButton;
