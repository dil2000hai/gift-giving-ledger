import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { spriteFor } from '../assets';
import { theme } from '../constants/theme';
import { REACTIONS } from './ReactionPicker';
import { CornerRibbon } from './CornerRibbon';

type Props = {
  title: string;
  occasion: string;
  year: number;
  reaction?: string;
  photo: number;
  anim: Animated.Value;
  justTied?: boolean;
};

/** A gift already given. The sprite is a plain <Image>, never masked. */
function GiftCardBase({ title, occasion, year, reaction, photo, anim, justTied = false }: Props) {
  const slide = anim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
  const meta = REACTIONS.find(r => r.id === reaction);
  const ReactionIcon = meta ? meta.Icon : null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.host, { opacity: anim, transform: [{ translateX: slide }] }]}>
      <View style={styles.card}>
        <View style={styles.photo}>
          <Image source={spriteFor(photo)} style={styles.sprite} resizeMode="contain" />
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {occasion + ' · ' + year}
          </Text>
          {ReactionIcon ? (
            <View style={styles.chip}>
              <ReactionIcon size={13} color={theme.colors.accent} strokeWidth={2.4} />
              <Text style={styles.chipText}>{meta ? meta.label : ''}</Text>
            </View>
          ) : null}
        </View>

        <CornerRibbon tied animate={justTied} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: 'stretch',
  },
  card: {
    height: 104,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 14,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 56,
    height: 56,
  },
  body: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMid,
  },
  chip: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentBorder,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: theme.colors.accent,
  },
});

export const GiftCard = React.memo(GiftCardBase);
export default GiftCard;
