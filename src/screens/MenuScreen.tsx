import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  Calendar as CalendarIcon,
  Gift,
  HandHeart,
  Lightbulb,
  Settings as SettingsIcon,
  Users,
} from 'lucide-react-native';
import { BENTO_GAP, BENTO_W, HIT_SLOP, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { BentoTile, BentoStat } from '../components/BentoTile';
import { PersonCard } from '../components/PersonCard';
import { IdeaTag } from '../components/IdeaTag';
import { EmptyState } from '../components/EmptyState';
import { SegmentedTabs } from '../components/SegmentedTabs';
import { usePressScale } from '../hooks/usePressScale';
import { useStagger } from '../hooks/useStagger';
import { givenFor, ideasFor, openIdeaCount } from '../game/store';
import type { GiftState, Idea, Person } from '../game/types';
import { countdownLabel, daysUntil, initial, shortDate, todayLabel } from '../utils/format';

const CTA_W = Math.round((BENTO_W - BENTO_GAP) * 0.62);
const STAT_W = BENTO_W - BENTO_GAP - CTA_W;
const TABS = ['PEOPLE', 'IDEAS'];

const DOT_GRID = Array.from({ length: 18 }).map((_, i) => ({
  left: 24 + (i % 6) * 58,
  top: 300 + Math.floor(i / 6) * 34,
}));

type Props = {
  state: GiftState;
  onStartPlanning: () => void;
  onOpenPerson: (id: string) => void;
  onOpenCalendar: () => void;
  onOpenSettings: () => void;
  onOpenReceived: () => void;
};

export function MenuScreen({
  state,
  onStartPlanning,
  onOpenPerson,
  onOpenCalendar,
  onOpenSettings,
  onOpenReceived,
}: Props) {
  const [tab, setTab] = useState(0);
  const cta = usePressScale();
  const tiles = useStagger(4, 70);

  const people = state.people;
  const inbox = useMemo(() => state.ideas.filter(i => i.status === 'idea'), [state.ideas]);
  const ideaTotal = openIdeaCount(state);

  const nextUp = useMemo(() => {
    const sorted = people
      .slice()
      .sort((a, b) => daysUntil(a.month, a.day) - daysUntil(b.month, b.day));
    return sorted.length > 0 ? sorted[0] : null;
  }, [people]);

  const soonCount = useMemo(
    () => people.filter(p => daysUntil(p.month, p.day) <= 30).length,
    [people],
  );

  const listCount = tab === 0 ? people.length : inbox.length;
  const rows = useStagger(Math.min(listCount, 12), 60);
  const rowsRef = useRef(rows);
  rowsRef.current = rows;

  const personKey = useCallback((p: Person) => p.id, []);
  const ideaKey = useCallback((i: Idea) => i.id, []);

  const renderPerson = useCallback(
    ({ item, index }: { item: Person; index: number }) => (
      <PersonCard
        id={item.id}
        name={item.name}
        occasion={item.occasion}
        month={item.month}
        day={item.day}
        ideaCount={ideasFor(state, item.id).length}
        givenCount={givenFor(state, item.id).length}
        anim={rowsRef.current[Math.min(index, rowsRef.current.length - 1)]}
        onPress={onOpenPerson}
      />
    ),
    [onOpenPerson, state],
  );

  const renderIdea = useCallback(
    ({ item, index }: { item: Idea; index: number }) => {
      const owner = state.people.find(p => p.id === item.personId);
      return (
        <IdeaTag
          id={item.id}
          title={item.title}
          band={item.band}
          caption={owner ? 'for ' + owner.name : 'UNASSIGNED'}
          index={index}
          anim={rowsRef.current[Math.min(index, rowsRef.current.length - 1)]}
        />
      );
    },
    [state.people],
  );

  const headerRight = (
    <>
      <IconButton onPress={onOpenCalendar} label="Occasion calendar">
        <CalendarIcon size={22} color={theme.colors.primary} strokeWidth={2.3} />
      </IconButton>
      <IconButton onPress={onOpenSettings} label="Settings">
        <SettingsIcon size={22} color={theme.colors.primary} strokeWidth={2.3} />
      </IconButton>
    </>
  );

  return (
    <AppShell variant="menu">
      <View pointerEvents="none" style={styles.decor}>
        <Svg width={SCREEN_W} height={260} style={styles.ribbon}>
          <Path
            d="M-30 150 C 90 40, 250 180, 420 60"
            stroke={theme.colors.bgDeep}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
        </Svg>
        {DOT_GRID.map((d, i) => (
          <View key={'g' + i} style={[styles.gridDot, { left: d.left, top: d.top }]} />
        ))}
      </View>

      <ScreenHeader title="GIFT LEDGER" subtitle={todayLabel()} rightSlot={headerRight} />

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your people</Text>
        <Text style={styles.heroSub}>
          {soonCount + ' occasions in the next 30 days'}
        </Text>
      </View>

      <View style={styles.bento}>
        <View style={styles.bentoRow}>
          <Pressable
            onPress={onStartPlanning}
            onPressIn={cta.onPressIn}
            onPressOut={cta.onPressOut}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Start planning"
            style={styles.ctaPress}>
            <Animated.View
              pointerEvents="box-none"
              style={[
                styles.ctaWrap,
                { opacity: tiles[0], transform: [{ scale: cta.scale }] },
              ]}>
              <LinearGradient
                colors={theme.gradients.primaryDeep as unknown as string[]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cta}>
                <View style={styles.ctaRow}>
                  <Gift size={24} color={theme.colors.onPrimary} strokeWidth={2.3} />
                  <Text style={styles.ctaLabel}>START PLANNING</Text>
                </View>
                <Text style={styles.ctaHint}>pick a person, add an idea</Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>

          <View style={styles.statColumn}>
            <BentoTile style={styles.statTile} anim={tiles[1]}>
              <BentoStat label="PEOPLE" value={people.length} color={theme.colors.primary} />
            </BentoTile>
            <BentoTile style={styles.statTile} anim={tiles[2]}>
              <BentoStat label="IDEAS" value={ideaTotal} color={theme.colors.accent} />
            </BentoTile>
          </View>
        </View>

        {nextUp ? (
          <BentoTile style={styles.nextTile} anim={tiles[3]}>
            <Pressable
              onPress={onOpenReceived}
              hitSlop={HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Open the received log"
              style={styles.nextPress}>
              <View style={styles.nextAvatar}>
                <Text style={styles.nextInitial}>{initial(nextUp.name)}</Text>
              </View>
              <View style={styles.nextBody}>
                <Text style={styles.nextLabel}>NEXT UP</Text>
                <Text style={styles.nextName} numberOfLines={1}>
                  {nextUp.name + ' · ' + shortDate(nextUp.month, nextUp.day)}
                </Text>
              </View>
              <View style={styles.nextPill}>
                <HandHeart size={13} color={theme.colors.accent} strokeWidth={2.4} />
                <Text style={styles.nextPillText}>
                  {countdownLabel(nextUp.month, nextUp.day)}
                </Text>
              </View>
            </Pressable>
          </BentoTile>
        ) : null}
      </View>

      <View style={styles.tabs}>
        <SegmentedTabs items={TABS} value={tab} onChange={setTab} />
      </View>

      <View style={styles.listArea}>
        {tab === 0 ? (
          <FlatList
            data={people}
            keyExtractor={personKey}
            renderItem={renderPerson}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyPeople}
            showsVerticalScrollIndicator={false}
            windowSize={7}
            initialNumToRender={6}
          />
        ) : (
          <FlatList
            data={inbox}
            keyExtractor={ideaKey}
            renderItem={renderIdea}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={EmptyIdeas}
            showsVerticalScrollIndicator={false}
            windowSize={7}
            initialNumToRender={7}
          />
        )}
      </View>
    </AppShell>
  );
}

const Separator = () => <View style={styles.sep} />;

const EmptyPeople = () => (
  <EmptyState
    Icon={Users}
    title="No one here yet"
    hint="Tap START PLANNING to add the first person to your ledger."
  />
);

const EmptyIdeas = () => (
  <EmptyState
    Icon={Lightbulb}
    title="The idea inbox is empty"
    hint="Catch a thought here the moment it lands, then tie it to a person later."
  />
);

const styles = StyleSheet.create({
  decor: {
    ...StyleSheet.absoluteFillObject,
  },
  ribbon: {
    position: 'absolute',
    left: 0,
    top: 110,
  },
  gridDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
    opacity: 0.1,
  },
  hero: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
  },
  heroSub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  bento: {
    width: BENTO_W,
    alignSelf: 'center',
    marginTop: 14,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: BENTO_GAP,
  },
  ctaPress: {
    width: CTA_W,
    height: 148,
  },
  ctaWrap: {
    width: CTA_W,
    height: 148,
    borderRadius: 22,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  cta: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaLabel: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.onPrimary,
  },
  ctaHint: {
    marginTop: 10,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    color: 'rgba(255,245,247,0.75)',
  },
  statColumn: {
    width: STAT_W,
    height: 148,
    gap: BENTO_GAP,
  },
  statTile: {
    width: '100%',
    height: 68,
  },
  nextTile: {
    width: '100%',
    height: 84,
    marginTop: BENTO_GAP,
  },
  nextPress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  nextAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  nextBody: {
    flex: 1,
    paddingHorizontal: 12,
  },
  nextLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.textSoft,
  },
  nextName: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  nextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentBorder,
  },
  nextPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.accent,
  },
  tabs: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  listArea: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sep: {
    height: 10,
  },
});

export default MenuScreen;
