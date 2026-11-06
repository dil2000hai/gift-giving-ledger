import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { FADE_MS, STAGGER_MS } from '../constants/config';

/**
 * One Animated.Value per row, driven with Animated.stagger. Only opacity and
 * transform read from it, so useNativeDriver stays true.
 */
export function useStagger(count: number, delayMs: number = STAGGER_MS) {
  const values = useRef<Animated.Value[]>([]).current;

  const target = Math.max(count, 1);
  while (values.length < target) {
    values.push(new Animated.Value(0));
  }

  useEffect(() => {
    const animations = [];
    for (let i = 0; i < target; i += 1) {
      values[i].setValue(0);
      animations.push(
        Animated.timing(values[i], {
          toValue: 1,
          duration: FADE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      );
    }
    const seq = Animated.stagger(delayMs, animations);
    seq.start();
    return () => {
      seq.stop();
    };
  }, [target, delayMs, values]);

  return values;
}

export default useStagger;
