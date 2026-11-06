import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type ShellVariant = 'loader' | 'menu' | 'page' | 'recap' | 'list';

type Props = {
  variant: ShellVariant;
  children: React.ReactNode;
};

const GRADIENTS: Record<ShellVariant, string[]> = {
  loader: theme.gradients.loader as unknown as string[],
  menu: theme.gradients.menu as unknown as string[],
  page: theme.gradients.page as unknown as string[],
  recap: theme.gradients.recap as unknown as string[],
  list: theme.gradients.calendar as unknown as string[],
};

const OPACITY: Record<ShellVariant, number> = {
  loader: 0.9,
  menu: 0.84,
  page: 0.88,
  recap: 0.82,
  list: 0.86,
};

/**
 * bg_game.png is the single shipped background. Screens are told apart by the
 * gradient laid over it — the Loader is the only dark one (rule #14).
 */
export function AppShell({ variant, children }: Props) {
  return (
    <ImageBackground source={assets.bgGame} style={styles.root} resizeMode="cover">
      <LinearGradient
        colors={GRADIENTS[variant]}
        locations={GRADIENTS[variant].length === 3 ? [0, 0.52, 1] : [0, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.wash, { opacity: OPACITY[variant] }]}
      />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  wash: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});

export default AppShell;
