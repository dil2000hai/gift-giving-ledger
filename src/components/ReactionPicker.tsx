import React, { useCallback, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, Smile, Sparkles, Star, PartyPopper } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { HIT_SLOP, REACTION_POP_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { ReactionId } from '../game/types';

export const REACTIONS: { id: ReactionId; label: string; Icon: LucideIcon }[] = [
  { id: 'LOVED', label: 'LOVED', Icon: Smile },
  { id: 'ADORED', label: 'ADORED', Icon: Heart },
  { id: 'WOWED', label: 'WOWED', Icon: Star },
  { id: 'THRILLED', label: 'THRILLED', Icon: PartyPopper },
  { id: 'TOUCHED', label: 'TOUCHED', Icon: Sparkles },
];

function Tile({
  id,
  label,
  Icon,
  active,
  onChange,
}: {
  id: ReactionId;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  onChange: (id: ReactionId) => void;
}) {
  const pop = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    pop.setValue(1);
    Animated.sequence([
      Animated.timing(pop, {
        toValue: 1.3,
        duration: REACTION_POP_MS / 2,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pop, {
        toValue: 1,
        duration: REACTION_POP_MS / 2,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    onChange(id);
  }, [id, onChange, pop]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.tile, active ? styles.tileOn : styles.tileOff, { transform: [{ scale: pop }] }]}>
        <Icon
          size={22}
          color={active ? theme.colors.onPrimary : theme.colors.accent}
          strokeWidth={2.4}
        />
      </Animated.View>
      <Text style={[styles.label, active ? styles.labelOn : null]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

type Props = {
  value: ReactionId | null;
  onChange: (id: ReactionId) => void;
};

/** Five icon tiles with ASCII labels — never emoji (rule #16). */
export function ReactionPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {REACTIONS.map(r => (
        <Tile
          key={r.id}
          id={r.id}
          label={r.label}
          Icon={r.Icon}
          active={value === r.id}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  press: {
    width: 58,
    alignItems: 'center',
  },
  tile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tileOff: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accentBorder,
  },
  tileOn: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  label: {
    marginTop: 6,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.textSoft,
  },
  labelOn: {
    color: theme.colors.accent,
  },
});

export default ReactionPicker;
