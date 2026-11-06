import React, { useCallback } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { giftSprites } from '../assets';
import { HIT_SLOP } from '../constants/config';
import { theme } from '../constants/theme';

function Tile({
  index,
  source,
  active,
  onChange,
}: {
  index: number;
  source: number;
  active: boolean;
  onChange: (index: number) => void;
}) {
  const handlePress = useCallback(() => onChange(index), [index, onChange]);
  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={'Gift picture ' + (index + 1)}
      style={[styles.tile, active ? styles.tileOn : styles.tileOff]}>
      <Image source={source} style={styles.sprite} resizeMode="contain" />
    </Pressable>
  );
}

type Props = {
  value: number;
  onChange: (index: number) => void;
};

/** The "photo" is a pick from the five shipped sprites — no camera, no storage. */
export function PhotoPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {giftSprites.map((src, i) => (
        <Tile key={'sprite' + i} index={i} source={src} active={value === i} onChange={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tile: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: theme.colors.bg,
  },
  tileOff: {
    borderColor: theme.colors.border,
  },
  tileOn: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.bgDeep,
  },
  sprite: {
    width: 42,
    height: 42,
  },
});

export default PhotoPicker;
