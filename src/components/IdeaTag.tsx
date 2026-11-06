import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Tag } from 'lucide-react-native';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const EDGE_COLORS = [theme.colors.primary, theme.colors.accent, theme.colors.pink300];

type Props = {
  id: string;
  title: string;
  band: string;
  caption: string;
  index: number;
  anim: Animated.Value;
  warnYear?: number;
  onPromote?: (id: string) => void;
};

/** The sticky paper tag. Even rows lean one way, odd rows the other. */
function IdeaTagBase({ id, title, band, caption, index, anim, warnYear = 0, onPromote }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.92);
  const handlePromote = useCallback(() => {
    if (onPromote) {
      onPromote(id);
    }
  }, [id, onPromote]);

  const slide = anim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
  const tilt = index % 2 === 0 ? '-0.6deg' : '0.5deg';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.host,
        { opacity: anim, transform: [{ translateX: slide }, { rotate: tilt }] },
      ]}>
      <View style={[styles.card, { borderLeftColor: EDGE_COLORS[index % EDGE_COLORS.length] }]}>
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.band}>{band}</Text>
            <Text style={styles.caption} numberOfLines={1}>
              {caption}
            </Text>
          </View>
          {warnYear > 0 ? (
            <View style={styles.warn}>
              <Text style={styles.warnText}>{'ALREADY GIVEN IN ' + warnYear}</Text>
            </View>
          ) : null}
        </View>

        {onPromote ? (
          <Pressable
            onPress={handlePromote}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={'Mark ' + title + ' as given'}
            style={styles.promotePress}>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.promote, { transform: [{ scale }] }]}>
              <Tag size={22} color={theme.colors.primary} strokeWidth={2.4} />
            </Animated.View>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: 'stretch',
  },
  card: {
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceAlt,
    borderLeftWidth: 5,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.border,
    borderRightColor: theme.colors.border,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 14,
    paddingRight: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 14.5,
    fontWeight: '600',
    color: theme.colors.text,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  band: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  caption: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: '600',
    color: theme.colors.textSoft,
  },
  warn: {
    marginTop: 7,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(194,24,91,0.10)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  warnText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.primary,
  },
  promotePress: {
    width: 56,
    height: 56,
  },
  promote: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(194,24,91,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(194,24,91,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const IdeaTag = React.memo(IdeaTagBase);
export default IdeaTag;
