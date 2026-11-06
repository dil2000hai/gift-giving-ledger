/**
 * Visual preset: CANDY_SWEET (design-system/preset.ts).
 * `name` stays exactly as the preset defines it; only accent hexes are
 * overridden to the brief palette (blush / raspberry / teal).
 */
export const theme = {
  name: 'candy-sweet',

  colors: {
    bg: '#FFF5F7',
    bgDeep: '#F8D7E3',
    surface: '#FFFFFF',
    surfaceAlt: '#FFFDF9',
    border: '#F6DCE5',
    primary: '#C2185B',
    primaryLight: '#D8336E',
    primaryDark: '#9E1049',
    accent: '#00897B',
    accentSoft: 'rgba(0,137,123,0.10)',
    accentBorder: 'rgba(0,137,123,0.30)',
    pink300: '#E7A0BC',
    pink100: '#F3DDE5',
    text: '#3A1426',
    textMid: '#8A5C72',
    textSoft: '#A3758A',
    textFaint: '#B98EA2',
    onPrimary: '#FFF5F7',
    scrim: 'rgba(58,20,38,0.35)',
  },

  gradients: {
    loader: ['#5E0B2C', '#8E1241', '#C2185B'],
    menu: ['#FFF5F7', '#FDEDF2', '#F8D7E3'],
    page: ['#FFF5F7', '#FFFFFF', '#FDE9EF'],
    recap: ['#FFE4EC', '#FFF5F7', '#FFFFFF'],
    calendar: ['#FFF5F7', '#F8D7E3'],
    list: ['#FFF5F7', '#FDEDF2'],
    primary: ['#D8336E', '#C2185B'],
    primaryDeep: ['#D8336E', '#C2185B', '#9E1049'],
    bar: ['#F8D7E3', '#FFFFFF', '#00897B'],
  },

  /** bg_game.png is the ONLY background; screens differ by these overlays (rule 14). */
  overlays: {
    loader: 'rgba(94,11,44,0.88)',
    menu: 'rgba(255,245,247,0.82)',
    page: 'rgba(255,255,255,0.86)',
    recap: 'rgba(255,228,236,0.80)',
    list: 'rgba(255,245,247,0.86)',
  },

  radius: { sm: 12, md: 16, lg: 20, xl: 26, pill: 100 },

  spacing: { xs: 4, sm: 8, md: 16, lg: 20, xl: 28 },

  typography: {
    hero: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 4 },
    title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: 0.5 },
    cardTitle: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 0 },
    body: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.1 },
    caption: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.2 },
    stat: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 0 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1 },
  },

  shadows: {
    card: {
      shadowColor: '#C2185B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    tile: {
      shadowColor: '#C2185B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 5,
    },
    button: {
      shadowColor: '#C2185B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.28,
      shadowRadius: 16,
      elevation: 8,
    },
    bar: {
      shadowColor: '#C2185B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 18,
      elevation: 10,
    },
  },
} as const;

export type Theme = typeof theme;
export default theme;
