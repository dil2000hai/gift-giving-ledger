import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { CAL_TILE, HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { MONTHS_SHORT } from '../utils/format';
import { GiftBoxMarker } from './GiftBoxMarker';

const MARKER_COLORS = [theme.colors.primary, theme.colors.accent, theme.colors.pink300];

type Props = {
  month: number;
  count: number;
  onPress: (month: number) => void;
};

function MonthTileBase({ month, count, onPress }: Props) {
  const bounce = useRef(new Animated.Value(0)).current;
  const handlePress = useCallback(() => onPress(month), [month, onPress]);

  useEffect(() => {
    const seq = Animated.sequence([
      Animated.delay(month * 40),
      Animated.spring(bounce, {
        toValue: 1,
        tension: 120,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(bounce, {
        toValue: 0,
        tension: 120,
        friction: 6,
        useNativeDriver: true,
      }),
    ]);
    seq.start();
    return () => seq.stop();
  }, [bounce, month]);

  const hop = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const shown = Math.min(count, 3);
  const extra = count - shown;

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={MONTHS_SHORT[month] + ', ' + count + ' occasions'}
      style={styles.press}>
      <View style={styles.tile}>
        <Text style={styles.month}>{MONTHS_SHORT[month]}</Text>

        <Animated.View
          pointerEvents="none"
          style={[styles.markers, { transform: [{ translateY: hop }] }]}>
          {count === 0 ? (
            <GiftBoxMarker color={theme.colors.pink100} hollow />
          ) : (
            Array.from({ length: shown }).map((_, i) => (
              <GiftBoxMarker key={'m' + i} color={MARKER_COLORS[i % MARKER_COLORS.length]} />
            ))
          )}
        </Animated.View>

        {extra > 0 ? <Text style={styles.extra}>{'+' + extra}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: CAL_TILE,
    height: 86,
    padding: 4,
  },
  tile: {
    flex: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  month: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.textMid,
  },
  markers: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 16,
  },
  extra: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textSoft,
  },
});

export const MonthTile = React.memo(MonthTileBase);
export default MonthTile;
