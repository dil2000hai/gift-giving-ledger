import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { HeaderGlyph, ScreenHeader } from '../components/ScreenHeader';
import { ReceivedCard } from '../components/ReceivedCard';
import { EmptyState } from '../components/EmptyState';
import { useStagger } from '../hooks/useStagger';
import type { GiftState, ReceivedItem } from '../game/types';

type Props = {
  state: GiftState;
  onBack: () => void;
  onToggleThanks: (id: string) => void;
};

export function ReceivedScreen({ state, onBack, onToggleThanks }: Props) {
  /** Unthanked first — the whole point of the log. */
  const items = useMemo(
    () =>
      state.received
        .slice()
        .sort((a, b) => (a.thanked === b.thanked ? 0 : a.thanked ? 1 : -1)),
    [state.received],
  );

  const thankedCount = items.filter(r => r.thanked).length;

  const rows = useStagger(Math.min(items.length, 12), 60);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const keyOf = useCallback((item: ReceivedItem) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ReceivedItem; index: number }) => (
      <ReceivedCard
        id={item.id}
        title={item.title}
        fromName={item.fromName}
        month={item.month}
        day={item.day}
        thanked={item.thanked}
        anim={rowsRef.current[Math.min(index, rowsRef.current.length - 1)]}
        onToggle={onToggleThanks}
      />
    ),
    [onToggleThanks],
  );

  return (
    <AppShell variant="page">
      <ScreenHeader
        title="RECEIVED"
        subtitle="WHAT CAME BACK TO YOU"
        onBack={onBack}
        rightSlot={<HeaderGlyph source={assets.iconPause} />}
      />

      {items.length > 0 ? (
        <View style={styles.summaryHost}>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {items.length + ' received · ' + thankedCount + ' thanked'}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.listArea}>
        <FlatList
          data={items}
          keyExtractor={keyOf}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={Empty}
          showsVerticalScrollIndicator={false}
          windowSize={7}
        />
      </View>
    </AppShell>
  );
}

const Separator = () => <View style={styles.sep} />;

const Empty = () => (
  <EmptyState
    Icon={Inbox}
    title="Nothing received yet"
    hint="Log a gift from a person page and it will wait here until you have said thank you."
  />
);

const styles = StyleSheet.create({
  summaryHost: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  summary: {
    height: 52,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryText: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.primary,
  },
  listArea: {
    flex: 1,
    marginTop: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  sep: {
    height: 10,
  },
});

export default ReceivedScreen;
