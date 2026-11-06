import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  text: string;
  visible: boolean;
};

/** Rises 40px, holds, fades. Transform + opacity only. */
export function Toast({ text, visible }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, visible]);

  const rise = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity: anim, transform: [{ translateY: rise }] }]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 112,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 9,
  },
  text: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#FFFFFF',
  },
});

export default Toast;
