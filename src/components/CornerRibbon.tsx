import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { BOW_TIE_MS } from '../constants/config';
import { theme } from '../constants/theme';

const SIZE = 58;

type Props = {
  tied: boolean;
  /** Plays the 420ms tie animation the first time `tied` flips to true. */
  animate?: boolean;
};

/**
 * The card's ribbon motif. Untied it is a folded corner; tied it becomes a bow.
 * Both layers are plain SVG inside Animated.Views, so only transform/opacity
 * is ever animated and the native driver stays safe.
 */
function CornerRibbonBase({ tied, animate = false }: Props) {
  const progress = useRef(new Animated.Value(tied ? 1 : 0)).current;

  useEffect(() => {
    if (!animate) {
      progress.setValue(tied ? 1 : 0);
      return;
    }
    Animated.timing(progress, {
      toValue: tied ? 1 : 0,
      duration: BOW_TIE_MS,
      easing: Easing.bezier(0.2, 0.9, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [animate, progress, tied]);

  const bowScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const bowSpin = progress.interpolate({ inputRange: [0, 1], outputRange: ['-18deg', '0deg'] });
  const ribbonOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Animated.View pointerEvents="none" style={styles.host}>
      <Animated.View pointerEvents="none" style={[styles.layer, { opacity: ribbonOpacity }]}>
        <Svg width={SIZE} height={SIZE} viewBox="0 0 58 58">
          <Path d="M20 0 L58 0 L58 38 Z" fill={theme.colors.primary} />
          <Path
            d="M26 0 L58 32"
            stroke={theme.colors.bgDeep}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.layer,
          { opacity: progress, transform: [{ scale: bowScale }, { rotate: bowSpin }] },
        ]}>
        <Svg width={SIZE} height={SIZE} viewBox="0 0 58 58">
          <Path d="M20 0 L58 0 L58 38 Z" fill={theme.colors.accent} />
          <Path
            d="M41 13 C34 6, 30 12, 36 18 C30 24, 34 30, 41 23 C48 30, 52 24, 46 18 C52 12, 48 6, 41 13 Z"
            fill={theme.colors.bgDeep}
          />
          <Circle cx={41} cy={18} r={3.6} fill={theme.colors.primary} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: SIZE,
    height: SIZE,
  },
  layer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: SIZE,
    height: SIZE,
  },
});

export const CornerRibbon = React.memo(CornerRibbonBase);
export default CornerRibbon;
