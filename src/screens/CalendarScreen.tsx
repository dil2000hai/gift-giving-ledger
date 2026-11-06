import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CAL_BOARD_W, BOARD_PAD, MONTH_SHEET_H, RECAP_YEAR } from '../constants/config';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { HeaderGlyph, ScreenHeader } from '../components/ScreenHeader';
import { MonthTile } from '../components/MonthTile';
import { BottomSheet } from '../components/BottomSheet';
import { SecondaryButton } from '../components/SecondaryButton';
import { GiftBoxMarker } from '../components/GiftBoxMarker';
import type { GiftState, Person } from '../game/types';
import { MONTHS_LONG, shortDate } from '../utils/format';

type Props = {
  state: GiftState;
  onBack: () => void;
  onOpenPerson: (id: string) => void;
};

export function CalendarScreen({ state, onBack, onOpenPerson }: Props) {
  const [openMonth, setOpenMonth] = useState<number | null>(null);

  const byMonth = useMemo(() => {
    const buckets: number[] = new Array(12).fill(0);
    state.people.forEach(p => {
      buckets[p.month] += 1;
    });
    return buckets;
  }, [state.people]);

  const monthPeople = useMemo(
    () => (openMonth === null ? [] : state.people.filter(p => p.month === openMonth)),
    [openMonth, state.people],
  );

  const handleOpen = useCallback((month: number) => setOpenMonth(month), []);
  const handleClose = useCallback(() => setOpenMonth(null), []);

  const total = state.people.length;

  return (
    <AppShell variant="list">
      <ScreenHeader
        title={RECAP_YEAR + ' OCCASIONS'}
        subtitle={total + ' DATES TO REMEMBER'}
        onBack={onBack}
        rightSlot={<HeaderGlyph source={assets.iconHome} />}
      />

      <View style={styles.boardHost}>
        <View style={styles.board}>
          {byMonth.map((count, month) => (
            <MonthTile key={'m' + month} month={month} count={count} onPress={handleOpen} />
          ))}
        </View>

        <View style={styles.legend}>
          <GiftBoxMarker color={theme.colors.primary} />
          <Text style={styles.legendText}>A GIFT BOX IS ONE OCCASION THAT MONTH</Text>
        </View>
      </View>

      <BottomSheet
        visible={openMonth !== null}
        height={MONTH_SHEET_H}
        title={openMonth === null ? '' : MONTHS_LONG[openMonth]}
        onClose={handleClose}>
        {monthPeople.length === 0 ? (
          <Text style={styles.empty}>
            Nothing booked this month. A quiet one — enjoy it.
          </Text>
        ) : (
          monthPeople.map(p => (
            <MonthRow key={p.id} person={p} onOpenPerson={onOpenPerson} />
          ))
        )}
      </BottomSheet>
    </AppShell>
  );
}

function MonthRow({
  person,
  onOpenPerson,
}: {
  person: Person;
  onOpenPerson: (id: string) => void;
}) {
  const open = useCallback(() => onOpenPerson(person.id), [onOpenPerson, person.id]);
  return (
    <View style={styles.row}>
      <GiftBoxMarker color={theme.colors.primary} size={16} />
      <View style={styles.rowBody}>
        <Text style={styles.rowName}>{person.name}</Text>
        <Text style={styles.rowMeta}>
          {person.occasion + ' · ' + shortDate(person.month, person.day)}
        </Text>
      </View>
      <View style={styles.rowCta}>
        <SecondaryButton label="VIEW" onPress={open} height={48} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardHost: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  board: {
    width: CAL_BOARD_W,
    padding: BOARD_PAD,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255,255,255,0.55)',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legend: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  legendText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: theme.colors.textSoft,
  },
  empty: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 20,
    color: theme.colors.textMid,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowBody: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  rowMeta: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMid,
  },
  rowCta: {
    width: 96,
  },
});

export default CalendarScreen;
