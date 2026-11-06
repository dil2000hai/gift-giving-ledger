import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { LOADER_DURATION_MS, LOADER_FADE_MS, SCREEN_W } from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';

const BAR_W = 190;

const BLOBS = [
  { size: 220, left: -60, top: 80 },
  { size: 160, left: SCREEN_W - 60, top: -40 },
  { size: 120, left: 40, top: 520 },
];

const CONFETTI = [
  { left: 44, top: 132, color: '#F8D7E3' },
  { left: 96, top: 206, color: '#00897B' },
  { left: 168, top: 118, color: '#FFD9E4' },
  { left: 248, top: 182, color: '#F8D7E3' },
  { left: 310, top: 128, color: '#FFD9E4' },
  { left: 62, top: 486, color: '#00897B' },
  { left: 142, top: 548, color: '#F8D7E3' },
  { left: 228, top: 500, color: '#FFD9E4' },
  { left: 296, top: 560, color: '#F8D7E3' },
  { left: 32, top: 620, color: '#00897B' },
  { left: 196, top: 648, color: '#FFD9E4' },
  { left: 288, top: 672, color: '#F8D7E3' },
];

type Props = {
  onDone: () => void;
};

/**
 * The only dark screen in the app — deep raspberry over bg_game with a 0.9
 * overlay, so it can never pHash-match the blush Menu.
 */
export function LoaderScreen({ onDone }: Props) {
  const card = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const sub = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.sequence([
        Animated.delay(120),
        Animated.spring(card, {
          toValue: 1,
          tension: 48,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(420),
        Animated.timing(title, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(760),
        Animated.timing(sub, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
      // width cannot run on the native driver
      Animated.timing(bar, {
        toValue: 1,
        duration: LOADER_DURATION_MS,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]);
    entry.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => done.current());
    }, LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      entry.stop();
    };
  }, [bar, card, fade, sub, title]);

  const cardScale = card.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
  const titleRise = title.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });
  const barWidth = bar.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell variant="loader">
      <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: fade }]}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {BLOBS.map((b, i) => (
            <View
              key={'blob' + i}
              style={[
                styles.blob,
                { width: b.size, height: b.size, borderRadius: b.size / 2, left: b.left, top: b.top },
              ]}
            />
          ))}
          {CONFETTI.map((c, i) => (
            <View
              key={'dot' + i}
              style={[styles.confetti, { left: c.left, top: c.top, backgroundColor: c.color }]}
            />
          ))}
        </View>

        <View style={styles.center}>
          <Animated.View
            pointerEvents="none"
            style={[styles.brandCard, { opacity: card, transform: [{ scale: cardScale }] }]}>
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[styles.titleBlock, { opacity: title, transform: [{ translateY: titleRise }] }]}>
            <Text style={styles.titleTop}>GIFT GIVING</Text>
            <Text style={styles.titleBottom}>LEDGER</Text>
          </Animated.View>

          <Animated.Text style={[styles.subtitle, { opacity: sub }]}>
            NEVER GIVE THE SAME GIFT TWICE
          </Animated.Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.track}>
            <Animated.View pointerEvents="none" style={[styles.fillHost, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.bar as unknown as string[]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.fill}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    backgroundColor: 'rgba(255,245,247,0.10)',
  },
  confetti: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.35,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brandCard: {
    width: 176,
    height: 176,
    borderRadius: 36,
    backgroundColor: 'rgba(255,245,247,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,245,247,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 148,
    height: 148,
  },
  titleBlock: {
    marginTop: 34,
    alignItems: 'center',
  },
  titleTop: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#FFF5F7',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  titleBottom: {
    marginTop: 4,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 10,
    color: '#F8D7E3',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.4,
    textAlign: 'center',
    color: 'rgba(255,245,247,0.70)',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 64,
  },
  track: {
    width: BAR_W,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,245,247,0.18)',
    overflow: 'hidden',
  },
  fillHost: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
  loading: {
    marginTop: 14,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(255,245,247,0.55)',
  },
});

export default LoaderScreen;
