export const CANDY_SWEET = {
  name: 'candy-sweet',

  colors: {
    bg: {
      primary: '#FFF0F5',       // lavender pink
      secondary: '#FFFFFF',
      tertiary: '#F8E8F0',
      accent: '#FFE0EB',
    },
    candy: {
      pink: '#FF69B4',
      purple: '#9B59B6',
      blue: '#5DADE2',
      green: '#2ECC71',
      orange: '#F39C12',
      red: '#FF4757',
      yellow: '#FFD93D',
    },
    text: {
      primary: '#2C1B47',       // deep purple, NOT black
      secondary: '#7B6B8A',
      accent: '#FF69B4',
      muted: '#B8A9C9',
    },
    ui: {
      border: '#E8D5F0',
      divider: '#F0E0F5',
      overlay: 'rgba(44, 27, 71, 0.5)',
      glass: 'rgba(255, 255, 255, 0.9)',
    },
  },

  gradients: {
    primary: ['#FF69B4', '#9B59B6'],
    surface: ['#FFF0F5', '#FFE0EB'],
    button: ['#FF69B4', '#FF8DC7'],
    reward: ['#FFD93D', '#F39C12'],
    header: ['#9B59B6', '#FF69B4'],
  },

  typography: {
    hero: { fontSize: 44, fontWeight: '900' as const, letterSpacing: -0.5 },
    title: { fontSize: 26, fontWeight: '800' as const, letterSpacing: 0 },
    subtitle: { fontSize: 17, fontWeight: '600' as const, letterSpacing: 0.2 },
    body: { fontSize: 15, fontWeight: '400' as const, letterSpacing: 0.1 },
    caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.3 },
    button: { fontSize: 16, fontWeight: '800' as const, letterSpacing: 1 },
    score: { fontSize: 40, fontWeight: '900' as const, letterSpacing: -1 },
  },

  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },

  radius: {
    sm: 12,        // candy = rounder
    md: 18,
    lg: 24,
    xl: 32,
    pill: 100,
  },

  shadows: {
    card: {
      shadowColor: '#9B59B6',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
    button: {
      shadowColor: '#FF69B4',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
  },

  animation: {
    spring: { tension: 100, friction: 7 },
    bounce: { tension: 200, friction: 10 },
    smooth: { duration: 250 },
    slow: { duration: 500 },
  },
};

// ============================================================
// CASINO GOLD — black/gold, luxury, premium
// ============================================================
