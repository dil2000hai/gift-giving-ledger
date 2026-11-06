import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

/** Icon geometry is fixed for EVERY button in the app (rule #20). */
export const BTN_ICON = 24;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  height?: number;
  disabled?: boolean;
  full?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  Icon,
  height = 56,
  disabled = false,
  full = true,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.press,
        { height },
        full ? styles.full : null,
        disabled ? styles.disabled : null,
      ]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrap, { height, transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.primary as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.grad, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={BTN_ICON} color={theme.colors.onPrimary} strokeWidth={2.4} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.lg,
  },
  full: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.55,
  },
  wrap: {
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  grad: {
    borderRadius: theme.radius.lg,
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
    fontSize: 16,
    lineHeight: BTN_ICON,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: theme.colors.onPrimary,
  },
});

export default PrimaryButton;
