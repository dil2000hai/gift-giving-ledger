import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Gift,
  HandHeart,
  Inbox,
  Lightbulb,
  PartyPopper,
  Package,
} from 'lucide-react-native';
import {
  BANDS,
  GIVEN_SHEET_H,
  HIT_SLOP,
  OCCASIONS,
  QUICK_SHEET_H,
  RECAP_YEAR,
  TOAST_MS,
} from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { IdeaTag } from '../components/IdeaTag';
import { GiftCard } from '../components/GiftCard';
import { ReceivedCard } from '../components/ReceivedCard';
import { EmptyState } from '../components/EmptyState';
import { BottomSheet } from '../components/BottomSheet';
import { Chip } from '../components/Chip';
import { ReactionPicker } from '../components/ReactionPicker';
import { PhotoPicker } from '../components/PhotoPicker';
import { PrimaryButton } from '../components/PrimaryButton';
import { Toast } from '../components/Toast';
import { usePressScale } from '../hooks/usePressScale';
import { useStagger } from '../hooks/useStagger';
import { givenFor, ideasFor, receivedFrom } from '../game/store';
import { alreadyGivenYear } from '../game/duplicateCheck';
import type { Band, GiftState, Idea, Occasion, Person, ReactionId, ReceivedItem } from '../game/types';
import { shortDate } from '../utils/format';

type Props = {
  person: Person;
  state: GiftState;
  onBack: () => void;
  onGameOver: () => void;
  onAddIdea: (personId: string | null, title: string, band: Band) => void;
  onTieTheBow: (ideaId: string, occasion: Occasion, reaction: ReactionId, photo: number) => void;
  onLogReceived: (person: Person, title: string) => void;
  onToggleThanks: (id: string) => void;
};

export function GameScreen({
  person,
  state,
  onBack,
  onGameOver,
  onAddIdea,
  onTieTheBow,
  onLogReceived,
  onToggleThanks,
}: Props) {
  const [tab, setTab] = useState(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const [givenOpen, setGivenOpen] = useState(false);
  const [receivedOpen, setReceivedOpen] = useState(false);
  const [toast, setToast] = useState('');

  const [draft, setDraft] = useState('');
  const [band, setBand] = useState<Band>('MID');
  const [receivedDraft, setReceivedDraft] = useState('');

  const [promoting, setPromoting] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<Occasion>('BIRTHDAY');
  const [reaction, setReaction] = useState<ReactionId | null>(null);
  const [photo, setPhoto] = useState(0);

  const justTied = useRef<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ideas = useMemo(() => ideasFor(state, person.id), [state, person.id]);
  const given = useMemo(() => givenFor(state, person.id), [state, person.id]);
  const received = useMemo(() => receivedFrom(state, person.id), [state, person.id]);

  const tabs = useMemo(
    () => [
      'IDEAS (' + ideas.length + ')',
      'GIVEN (' + given.length + ')',
      'RECEIVED (' + received.length + ')',
    ],
    [given.length, ideas.length, received.length],
  );

  const activeLength = tab === 0 ? ideas.length : tab === 1 ? given.length : received.length;
  const rows = useStagger(Math.min(activeLength, 12), 60);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const popToast = useCallback((text: string) => {
    setToast(text);
    if (toastTimer.current !== null) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(''), TOAST_MS);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current !== null) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  /* ---------------- quick idea ---------------- */

  const warnYear = alreadyGivenYear(state.ideas, person.id, draft);

  const openQuick = useCallback(() => {
    setDraft('');
    setBand('MID');
    setQuickOpen(true);
  }, []);

  const saveIdea = useCallback(() => {
    onAddIdea(person.id, draft, band);
    setQuickOpen(false);
    setTab(0);
    popToast('IDEA SAVED');
  }, [band, draft, onAddIdea, person.id, popToast]);

  /* ---------------- mark as given ---------------- */

  const openPromote = useCallback((id: string) => {
    setPromoting(id);
    setOccasion('BIRTHDAY');
    setReaction(null);
    setPhoto(0);
    setGivenOpen(true);
  }, []);

  const tieBow = useCallback(() => {
    if (promoting === null || reaction === null) {
      return;
    }
    justTied.current = promoting;
    onTieTheBow(promoting, occasion, reaction, photo);
    setGivenOpen(false);
    setPromoting(null);
    setTab(1);
    popToast('TIED UP NICELY');
  }, [occasion, onTieTheBow, photo, popToast, promoting, reaction]);

  /* ---------------- received ---------------- */

  const openReceived = useCallback(() => {
    setReceivedDraft('');
    setReceivedOpen(true);
  }, []);

  const saveReceived = useCallback(() => {
    onLogReceived(person, receivedDraft);
    setReceivedOpen(false);
    setTab(2);
    popToast('LOGGED WITH THANKS');
  }, [onLogReceived, person, popToast, receivedDraft]);

  /* ---------------- rendering ---------------- */

  const keyOf = useCallback((item: Idea | ReceivedItem) => item.id, []);

  const renderIdea = useCallback(
    ({ item, index }: { item: Idea; index: number }) => (
      <IdeaTag
        id={item.id}
        title={item.title}
        band={item.band}
        caption={'for ' + person.name}
        index={index}
        anim={rowsRef.current[Math.min(index, rowsRef.current.length - 1)]}
        warnYear={alreadyGivenYear(state.ideas, person.id, item.title)}
        onPromote={openPromote}
      />
    ),
    [openPromote, person.id, person.name, state.ideas],
  );

  const renderGift = useCallback(
    ({ item, index }: { item: Idea; index: number }) => (
      <GiftCard
        title={item.title}
        occasion={item.occasion ?? 'JUST BECAUSE'}
        year={item.givenYear ?? RECAP_YEAR}
        reaction={item.reaction}
        photo={item.photo ?? 0}
        anim={rowsRef.current[Math.min(index, rowsRef.current.length - 1)]}
        justTied={justTied.current === item.id}
      />
    ),
    [],
  );

  const renderReceived = useCallback(
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

  const recapButton = <RecapButton onPress={onGameOver} />;

  return (
    <AppShell variant="page">
      <ScreenHeader
        title={person.name}
        subtitle={person.occasion + ' · ' + shortDate(person.month, person.day)}
        onBack={onBack}
        rightSlot={recapButton}
      />

      <View style={styles.strip}>
        <SegmentedTabs items={tabs} value={tab} onChange={setTab} />
      </View>

      <View style={styles.listArea}>
        {tab === 0 ? (
          <FlatList
            data={ideas}
            keyExtractor={keyOf}
            renderItem={renderIdea}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyIdeas}
            showsVerticalScrollIndicator={false}
            windowSize={7}
          />
        ) : null}
        {tab === 1 ? (
          <FlatList
            data={given}
            keyExtractor={keyOf}
            renderItem={renderGift}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyGiven}
            showsVerticalScrollIndicator={false}
            windowSize={7}
          />
        ) : null}
        {tab === 2 ? (
          <FlatList
            data={received}
            keyExtractor={keyOf}
            renderItem={renderReceived}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyReceived}
            showsVerticalScrollIndicator={false}
            windowSize={7}
          />
        ) : null}
      </View>

      <Toast text={toast} visible={toast.length > 0} />

      {/* G2 floating control bar */}
      <View style={styles.bar}>
        <View style={styles.barPrimary}>
          <PrimaryButton label="QUICK IDEA" Icon={Lightbulb} onPress={openQuick} height={56} />
        </View>
        <SquareAction onPress={openReceived} />
      </View>

      <BottomSheet
        visible={quickOpen}
        height={QUICK_SHEET_H}
        title="Quick idea"
        onClose={() => setQuickOpen(false)}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="What could they love?"
          placeholderTextColor={theme.colors.textFaint}
          style={styles.input}
          returnKeyType="done"
        />
        {warnYear > 0 ? (
          <View style={styles.warn}>
            <Text style={styles.warnText}>{'ALREADY GIVEN IN ' + warnYear}</Text>
          </View>
        ) : null}
        <Text style={styles.sheetLabel}>HOW BIG A GESTURE</Text>
        <View style={styles.chipRow}>
          {BANDS.map(b => (
            <BandChip key={b} band={b} active={band === b} onChange={setBand} />
          ))}
        </View>
        <View style={styles.sheetCta}>
          <PrimaryButton
            label="SAVE IDEA"
            Icon={Gift}
            onPress={saveIdea}
            height={56}
            disabled={draft.trim().length === 0}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={givenOpen}
        height={GIVEN_SHEET_H}
        title="Mark as given"
        onClose={() => setGivenOpen(false)}>
        <Text style={styles.sheetLabel}>THE OCCASION</Text>
        <View style={styles.chipRow}>
          {OCCASIONS.slice(0, 2).map(o => (
            <OccasionChip key={o} occasion={o} active={occasion === o} onChange={setOccasion} />
          ))}
        </View>
        <View style={styles.chipRowNext}>
          {OCCASIONS.slice(2).map(o => (
            <OccasionChip key={o} occasion={o} active={occasion === o} onChange={setOccasion} />
          ))}
        </View>

        <Text style={styles.sheetLabel}>HOW IT LANDED</Text>
        <ReactionPicker value={reaction} onChange={setReaction} />

        <Text style={styles.sheetLabel}>A PICTURE FOR THE LEDGER</Text>
        <PhotoPicker value={photo} onChange={setPhoto} />

        <View style={styles.sheetCta}>
          <PrimaryButton
            label="TIE THE BOW"
            Icon={Package}
            onPress={tieBow}
            height={56}
            disabled={reaction === null}
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={receivedOpen}
        height={QUICK_SHEET_H}
        title={'Received from ' + person.name}
        onClose={() => setReceivedOpen(false)}>
        <TextInput
          value={receivedDraft}
          onChangeText={setReceivedDraft}
          placeholder="What did they give you?"
          placeholderTextColor={theme.colors.textFaint}
          style={styles.input}
          returnKeyType="done"
        />
        <Text style={styles.sheetHint}>
          It lands in your received log unthanked, so you remember to write back.
        </Text>
        <View style={styles.sheetCta}>
          <PrimaryButton
            label="LOG IT"
            Icon={HandHeart}
            onPress={saveReceived}
            height={56}
            disabled={receivedDraft.trim().length === 0}
          />
        </View>
      </BottomSheet>
    </AppShell>
  );
}

/* ---------------- small local pieces ---------------- */

function RecapButton({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.94);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel="Open the year recap"
      style={styles.recapPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.recapPill, { transform: [{ scale }] }]}>
        <PartyPopper size={24} color={theme.colors.accent} strokeWidth={2.4} />
        <Text style={styles.recapText}>RECAP</Text>
      </Animated.View>
    </Pressable>
  );
}

function SquareAction({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.93);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel="Log a received gift"
      style={styles.squarePress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.square, { transform: [{ scale }] }]}>
        <HandHeart size={24} color={theme.colors.accent} strokeWidth={2.4} />
      </Animated.View>
    </Pressable>
  );
}

function BandChip({
  band,
  active,
  onChange,
}: {
  band: Band;
  active: boolean;
  onChange: (b: Band) => void;
}) {
  const handle = useCallback(() => onChange(band), [band, onChange]);
  return <Chip label={band} active={active} onPress={handle} grow tone="accent" />;
}

function OccasionChip({
  occasion,
  active,
  onChange,
}: {
  occasion: Occasion;
  active: boolean;
  onChange: (o: Occasion) => void;
}) {
  const handle = useCallback(() => onChange(occasion), [occasion, onChange]);
  return <Chip label={occasion} active={active} onPress={handle} grow />;
}

const Separator = () => <View style={styles.sep} />;

const EmptyIdeas = () => (
  <EmptyState
    Icon={Lightbulb}
    title="No ideas yet"
    hint="Tap QUICK IDEA below and write down the first thing that comes to mind."
  />
);

const EmptyGiven = () => (
  <EmptyState
    Icon={Gift}
    title="Nothing given yet"
    hint="Once you tie the bow on an idea it moves here, with the year, so you never repeat it."
  />
);

const EmptyReceived = () => (
  <EmptyState
    Icon={Inbox}
    title="Nothing received yet"
    hint="Log what you were given and the thank-you tick will keep you honest."
  />
);

const styles = StyleSheet.create({
  strip: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  listArea: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 150,
  },
  sep: {
    height: 10,
  },
  recapPress: {
    width: 120,
    height: 48,
  },
  recapPill: {
    width: 120,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentBorder,
  },
  recapText: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.accent,
  },
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    height: 72,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
  },
  barPrimary: {
    flex: 1,
  },
  squarePress: {
    width: 56,
    height: 56,
  },
  square: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentBorder,
  },
  input: {
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: theme.colors.text,
  },
  warn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(194,24,91,0.10)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warnText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: theme.colors.primary,
  },
  sheetLabel: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.textSoft,
  },
  sheetHint: {
    marginTop: 12,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipRowNext: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  sheetCta: {
    marginTop: 'auto',
    paddingTop: 16,
  },
});

export default GameScreen;
