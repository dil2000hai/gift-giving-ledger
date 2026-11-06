import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RefreshCw, Trophy, Users } from 'lucide-react-native';
import { spriteFor } from '../assets';
import { BENTO_W, ENTER_SPRING, RECAP_YEAR } from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatRow } from '../components/StatRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { REACTIONS } from '../components/ReactionPicker';
import type { Recap } from '../game/types';

const COUNT_MS = 700;
const COUNT_STEPS = 14;

function useCountUp(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }
    let step = 0;
    setValue(0);
    const id = setInterval(() => {
      step += 1;
      if (step >= COUNT_STEPS) {
        setValue(target);
        clearInterval(id);
        return;
      }
      setValue(Math.round((target * step) / COUNT_STEPS));
    }, COUNT_MS / COUNT_STEPS);
    return () => clearInterval(id);
  }, [target]);

  return value;
}

type Props = {
  recap: Recap;
  onPlanAgain: () => void;
  onBackToPeople: () => void;
};

export function GameOverScreen({ recap, onPlanAgain, onBackToPeople }: Props) {
  const hero = useRef(new Animated.Value(0)).current;
  const body = useRef(new Animated.Value(0)).current;

  const given = useCountUp(recap.given);
  const receivedCount = useCountUp(recap.receivedCount);
  const ideaCount = useCountUp(recap.ideaCount);

  useEffect(() => {
    const seq = Animated.sequence([
      Animated.spring(hero, {
        toValue: 1,
        tension: ENTER_SPRING.tension,
        friction: ENTER_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.timing(body, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]);
    seq.start();
    return () => seq.stop();
  }, [body, hero]);

  const heroScale = hero.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
  const bodyRise = body.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  const bestMeta = recap.best
    ? REACTIONS.find(r => r.id === recap.best?.reaction)
    : undefined;
  const BestIcon = bestMeta ? bestMeta.Icon : null;

  const stats = [
    { key: 'given', value: recap.given > 0 ? given : 0, label: 'GIVEN', color: theme.colors.primary },
    {
      key: 'received',
      value: recap.receivedCount > 0 ? receivedCount : 0,
      label: 'RECEIVED',
      color: theme.colors.accent,
    },
    {
      key: 'ideas',
      value: recap.ideaCount > 0 ? ideaCount : 0,
      label: 'IDEAS',
      color: theme.colors.primaryLight,
    },
  ];

  return (
    <AppShell variant="recap">
      <ScreenHeader title="THE LEDGER" subtitle={String(RECAP_YEAR)} align="left" />

      <View style={styles.body}>
        {/* Decor sits behind the badge only — it never crosses the heading. */}
        <View pointerEvents="none" style={styles.decor}>
          <Svg width={150} height={150} viewBox="0 0 180 180">
            <Path
              d="M90 58 C62 24, 28 54, 62 84 C28 114, 62 144, 90 110 C118 144, 152 114, 118 84 C152 54, 118 24, 90 58 Z"
              fill={theme.colors.primary}
              opacity={0.12}
            />
          </Svg>
        </View>

        <Animated.View
          pointerEvents="none"
          style={[styles.heroBadge, { opacity: hero, transform: [{ scale: heroScale }] }]}>
          <Trophy size={36} color={theme.colors.primary} strokeWidth={2.2} />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.lower, { opacity: body, transform: [{ translateY: bodyRise }] }]}>
          <Text style={styles.heading}>YEAR RECAP</Text>
          <Text style={styles.subheading}>
            {RECAP_YEAR + ' · a good year for giving'}
          </Text>

          <View style={styles.statsHost}>
            <StatRow stats={stats} />
          </View>

          {recap.best ? (
            <View style={styles.bestCard}>
              <View style={styles.bestPhoto}>
                <Image
                  source={spriteFor(recap.best.photo ?? 0)}
                  style={styles.bestSprite}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.bestBody}>
                <Text style={styles.bestLabel}>BEST REMEMBERED</Text>
                <Text style={styles.bestTitle} numberOfLines={1}>
                  {recap.best.title}
                </Text>
                <Text style={styles.bestWho} numberOfLines={1}>
                  {'for ' + recap.bestPersonName}
                </Text>
              </View>
              {BestIcon ? (
                <View style={styles.bestChip}>
                  <BestIcon size={14} color={theme.colors.accent} strokeWidth={2.4} />
                  <Text style={styles.bestChipText}>{bestMeta ? bestMeta.label : ''}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </Animated.View>
      </View>

      {/* Hint above, CTA below — nothing is ever rendered under a button. */}
      <View style={styles.ctaBlock}>
        <Text style={styles.ctaHint}>ONE LEDGER · NO REPEATS · NO ACCOUNTS</Text>
        <PrimaryButton label="PLAN AGAIN" Icon={RefreshCw} onPress={onPlanAgain} height={60} />
        <View style={styles.secondary}>
          <SecondaryButton label="BACK TO PEOPLE" Icon={Users} onPress={onBackToPeople} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 22,
  },
  decor: {
    // Behind the badge only — it stays clear of the YEAR RECAP letters.
    position: 'absolute',
    top: -34,
    alignSelf: 'center',
  },
  heroBadge: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
  },
  lower: {
    width: BENTO_W,
    alignItems: 'center',
    marginTop: 22,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text,
  },
  subheading: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  statsHost: {
    width: '100%',
    marginTop: 22,
  },
  bestCard: {
    width: '100%',
    height: 110,
    marginTop: 16,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  bestPhoto: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: theme.colors.bg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSprite: {
    width: 54,
    height: 54,
  },
  bestBody: {
    flex: 1,
    paddingHorizontal: 12,
  },
  bestLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: theme.colors.textSoft,
  },
  bestTitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  bestWho: {
    marginTop: 3,
    fontSize: 11.5,
    fontWeight: '500',
    color: theme.colors.textMid,
  },
  bestChip: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentBorder,
  },
  bestChipText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.accent,
  },
  ctaBlock: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  ctaHint: {
    marginBottom: 10,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.textSoft,
  },
  secondary: {
    marginTop: 10,
  },
});

export default GameOverScreen;
