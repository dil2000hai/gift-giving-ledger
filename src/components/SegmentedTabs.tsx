import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from './Chip';

type Props = {
  items: string[];
  value: number;
  onChange: (index: number) => void;
};

function Segment({
  label,
  index,
  active,
  onChange,
}: {
  label: string;
  index: number;
  active: boolean;
  onChange: (index: number) => void;
}) {
  const handle = useCallback(() => onChange(index), [index, onChange]);
  return <Chip label={label} active={active} onPress={handle} grow />;
}

export function SegmentedTabs({ items, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {items.map((label, i) => (
        <Segment key={label} label={label} index={i} active={i === value} onChange={onChange} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default SegmentedTabs;
