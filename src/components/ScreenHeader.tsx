import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { HEADER_H, HEADER_TOP_PAD } from '../constants/config';
import { theme } from '../constants/theme';
import { IconButton } from './IconButton';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Rendered on the right. Keep every screen on this one component (rule #12). */
  rightSlot?: React.ReactNode;
  align?: 'left' | 'center';
};

/**
 * The one header used by Menu / Person page / Recap / Calendar / Received /
 * Settings, so padding and surfaces never drift between screens.
 */
export function ScreenHeader({ title, subtitle, onBack, rightSlot, align = 'left' }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <IconButton onPress={onBack} label="Go back">
            <ChevronLeft size={22} color={theme.colors.primary} strokeWidth={2.5} />
          </IconButton>
        ) : null}
      </View>

      <View style={[styles.middle, align === 'center' ? styles.centered : styles.leftish]}>
        <Text
          numberOfLines={1}
          style={[styles.title, align === 'center' ? styles.textCenter : null]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, align === 'center' ? styles.textCenter : null]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightSide}>{rightSlot}</View>
    </View>
  );
}

/** A non-interactive 48x48 badge so every header's right edge has the same mass. */
export function HeaderGlyph({ source }: { source: number }) {
  return (
    <View style={styles.glyphBadge}>
      <Image source={source} style={styles.glyph} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  glyphBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    width: 26,
    height: 26,
  },
  header: {
    height: HEADER_H + HEADER_TOP_PAD,
    paddingTop: HEADER_TOP_PAD,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  side: {
    minWidth: 0,
    justifyContent: 'center',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
  },
  middle: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  leftish: {
    alignItems: 'flex-start',
  },
  centered: {
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: theme.colors.textSoft,
  },
});

export default ScreenHeader;
