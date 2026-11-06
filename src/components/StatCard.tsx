import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
  value: number | string;
  label: string;
  color: string;
};

/**
 * Accent dot + big number + caption. No raster icons — three AI sprites in one
 * row never read as the same size (rule #21). `width:'100%'` and a fixed
 * padding, never flex:1 inside a flex:1 slot (rule #19a).
 */
function StatCardBase({ value, label, color }: Props) {
  return (
    <View style={[styles.card, { borderColor: color + '55' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textSoft,
  },
});

export const StatCard = React.memo(StatCardBase);
export default StatCard;
