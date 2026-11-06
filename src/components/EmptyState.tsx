import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';

type Props = {
  Icon: LucideIcon;
  title: string;
  hint: string;
};

export function EmptyState({ Icon, title, hint }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Icon size={40} color={theme.colors.pink300} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  hint: {
    marginTop: 8,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
    color: theme.colors.textMid,
  },
});

export default EmptyState;
