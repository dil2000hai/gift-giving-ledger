import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatCard } from './StatCard';

export type StatSpec = {
  key: string;
  value: number;
  label: string;
  color: string;
};

type Props = {
  stats: StatSpec[];
};

/**
 * Renders nothing at all unless at least two pills carry a value — a lone pill
 * or an empty box reads as a broken skeleton (rule #21).
 */
export function StatRow({ stats }: Props) {
  const visible = stats.filter(s => s.value > 0);
  if (visible.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {visible.map(s => (
        <View key={s.key} style={styles.slot}>
          <StatCard value={s.value} label={s.label} color={s.color} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  slot: {
    flex: 1,
  },
});

export default StatRow;
