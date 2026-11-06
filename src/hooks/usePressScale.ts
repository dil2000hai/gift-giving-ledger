import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { PRESS_SPRING } from '../constants/config';

/**
 * Press feedback for the rule-#8 pattern: the <Pressable> is the PARENT and
 * drives this scale, the <Animated.View> sits INSIDE it. Only `transform` is
 * animated, so useNativeDriver stays safe.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: PRESS_SPRING.tension,
      friction: PRESS_SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: PRESS_SPRING.tension,
      friction: PRESS_SPRING.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
