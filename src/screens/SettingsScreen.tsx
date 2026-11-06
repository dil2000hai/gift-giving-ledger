import React, { useCallback, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Download, Lock, Palette, Upload } from 'lucide-react-native';
import { assets } from '../assets';
import { QUICK_SHEET_H } from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { HeaderGlyph, ScreenHeader } from '../components/ScreenHeader';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { SecondaryButton } from '../components/SecondaryButton';
import { BottomSheet } from '../components/BottomSheet';
import type { GiftState } from '../game/types';

const THEMES = ['BLUSH', 'PAPER'];

type Props = {
  state: GiftState;
  onBack: () => void;
};

export function SettingsScreen({ state, onBack }: Props) {
  const [themeIndex, setThemeIndex] = useState(0);
  const [pinOn, setPinOn] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const openExport = useCallback(() => setExportOpen(true), []);
  const closeExport = useCallback(() => setExportOpen(false), []);

  const summary =
    state.people.length +
    ' people, ' +
    state.ideas.filter(i => i.status === 'idea').length +
    ' ideas, ' +
    state.ideas.filter(i => i.status === 'given').length +
    ' given, ' +
    state.received.length +
    ' received';

  return (
    <AppShell variant="page">
      <ScreenHeader
        title="SETTINGS"
        subtitle="THIS PHONE ONLY"
        onBack={onBack}
        rightSlot={<HeaderGlyph source={assets.iconPause} />}
      />

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Palette size={24} color={theme.colors.primary} strokeWidth={2.3} />
            <Text style={styles.cardTitle}>THEME</Text>
          </View>
          <SegmentedTabs items={THEMES} value={themeIndex} onChange={setThemeIndex} />
          <Text style={styles.cardHint}>
            Both sit inside the same blush palette — pick the one that is kinder on your eyes.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Lock size={24} color={theme.colors.primary} strokeWidth={2.3} />
            <Text style={styles.cardTitle}>LOCAL PIN</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {pinOn ? 'Ask for a PIN on open' : 'No PIN, open straight away'}
            </Text>
            <Switch
              value={pinOn}
              onValueChange={setPinOn}
              thumbColor={pinOn ? theme.colors.primary : '#FFFFFF'}
              trackColor={{ false: theme.colors.pink100, true: 'rgba(194,24,91,0.35)' }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Download size={24} color={theme.colors.primary} strokeWidth={2.3} />
            <Text style={styles.cardTitle}>BACKUP</Text>
          </View>
          <SecondaryButton label="EXPORT TO TEXT" Icon={Upload} onPress={openExport} height={56} />
          <View style={styles.spacer} />
          <SecondaryButton
            label="IMPORT FROM TEXT"
            Icon={Download}
            onPress={openExport}
            height={56}
          />
        </View>
      </View>

      <Text style={styles.footer}>
        All data stays on this phone. No accounts, no shops, no ads.
      </Text>

      <BottomSheet
        visible={exportOpen}
        height={QUICK_SHEET_H}
        title="Your ledger as text"
        onClose={closeExport}>
        <View style={styles.exportBox}>
          <Text style={styles.exportText}>{summary}</Text>
        </View>
        <Text style={styles.exportHint}>
          Copy this block somewhere safe. Nothing is uploaded — the text never leaves the device.
        </Text>
      </BottomSheet>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 14,
  },
  card: {
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text,
  },
  cardHint: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  switchRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flex: 1,
    paddingRight: 12,
    fontSize: 13.5,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  spacer: {
    height: 10,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 26,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: theme.colors.textSoft,
  },
  exportBox: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
  },
  exportText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  exportHint: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
});

export default SettingsScreen;
