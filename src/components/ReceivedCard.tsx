import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { shortDate } from '../utils/format';

type Props = {
  id: string;
  title: string;
  fromName: string;
  month: number;
  day: number;
  thanked: boolean;
  anim: Animated.Value;
  onToggle: (id: string) => void;
};

function ReceivedCardBase({
  id,
  title,
  fromName,
  month,
  day,
  thanked,
  anim,
  onToggle,
}: Props) {
  const tick = useRef(new Animated.Value(thanked ? 1 : 0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      tick.setValue(thanked ? 1 : 0);
      return;
    }
    Animated.spring(tick, {
      toValue: thanked ? 1 : 0,
      tension: 220,
      friction: 9,
      useNativeDriver: true,
    }).start();
    if (thanked) {
      ring.setValue(0);
      Animated.timing(ring, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [ring, thanked, tick]);

  const handleToggle = useCallback(() => onToggle(id), [id, onToggle]);

  const slide = anim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, { opacity: anim, transform: [{ translateX: slide }] }]}>
      <View style={styles.card}>
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {'from ' + fromName + ' · ' + shortDate(month, day)}
          </Text>
          <Text style={[styles.state, thanked ? styles.stateOn : null]}>
            {thanked ? 'THANKED' : 'SAY THANK YOU'}
          </Text>
        </View>

        <Pressable
          onPress={handleToggle}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityState={{ checked: thanked }}
          accessibilityLabel={'Mark thank you for ' + title}
          style={styles.togglePress}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              { opacity: ringOpacity, transform: [{ scale: ringScale }] },
            ]}
          />
          <View style={[styles.toggle, thanked ? styles.toggleOn : styles.toggleOff]}>
            <Animated.View pointerEvents="none" style={{ transform: [{ scale: tick }], opacity: tick }}>
              <Check size={22} color={theme.colors.onPrimary} strokeWidth={3} />
            </Animated.View>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: 'stretch',
  },
  card: {
    minHeight: 92,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  body: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 11.5,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  state: {
    marginTop: 7,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textFaint,
  },
  stateOn: {
    color: theme.colors.accent,
  },
  togglePress: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
  },
  toggle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  toggleOff: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.pink300,
  },
  toggleOn: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
});

export const ReceivedCard = React.memo(ReceivedCardBase);
export default ReceivedCard;
