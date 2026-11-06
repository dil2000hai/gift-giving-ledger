import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Cake, Gift, HeartHandshake, Sparkles } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { initial, shortDate } from '../utils/format';
import type { Occasion } from '../game/types';
import { CornerRibbon } from './CornerRibbon';

const OCCASION_ICON: Record<Occasion, LucideIcon> = {
  BIRTHDAY: Cake,
  HOLIDAY: Gift,
  'THANK YOU': HeartHandshake,
  'JUST BECAUSE': Sparkles,
};

type Props = {
  id: string;
  name: string;
  occasion: Occasion;
  month: number;
  day: number;
  ideaCount: number;
  givenCount: number;
  anim: Animated.Value;
  onPress: (id: string) => void;
};

function PersonCardBase({
  id,
  name,
  occasion,
  month,
  day,
  ideaCount,
  givenCount,
  anim,
  onPress,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const handlePress = useCallback(() => onPress(id), [id, onPress]);

  const OccasionIcon = OCCASION_ICON[occasion];
  const slide = anim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{ opacity: anim, transform: [{ translateX: slide }] }}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={HIT_SLOP}
        accessibilityRole="button"
        accessibilityLabel={'Open ' + name}
        style={styles.press}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, { transform: [{ scale }] }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial(name)}</Text>
          </View>

          <View style={styles.middle}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.occasionRow}>
              <OccasionIcon size={13} color={theme.colors.accent} strokeWidth={2.4} />
              <Text style={styles.occasion} numberOfLines={1}>
                {occasion + ' · ' + shortDate(month, day)}
              </Text>
            </View>
          </View>

          {/* Sits low in the card so the corner ribbon never lands on the text. */}
          <View style={styles.right}>
            <Text style={styles.ideaCount}>{ideaCount + ' ideas'}</Text>
            <Text style={styles.givenCount}>{givenCount + ' given'}</Text>
          </View>

          <CornerRibbon tied={givenCount > 0} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  press: {
    alignSelf: 'stretch',
    height: 92,
  },
  card: {
    height: 92,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  middle: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  occasionRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  occasion: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: theme.colors.textMid,
  },
  right: {
    width: 74,
    height: 92,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  ideaCount: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  givenCount: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSoft,
  },
});

export const PersonCard = React.memo(PersonCardBase);
export default PersonCard;
