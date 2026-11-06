import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  tone?: 'light' | 'accent';
  label: string;
};

/** 48x48 round icon button — explicit width AND height, never intrinsic. */
export function IconButton({ onPress, children, tone = 'light', label }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.circle,
          tone === 'accent' ? styles.accent : styles.light,
          { transform: [{ scale }] },
        ]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: 48,
    height: 48,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  light: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  accent: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accentBorder,
  },
});

export default IconButton;
