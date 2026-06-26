import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Palette = {
  // Brand colors
  primary: '#6366F1',       // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Status/Functional colors
  success: '#10B981',       // Emerald (Income)
  successLight: '#34D399',
  danger: '#EF4444',        // Rose (Expenses)
  dangerLight: '#F87171',
  warning: '#F59E0B',       // Amber
  info: '#3B82F6',          // Blue

  // Neutrals (Dark Theme Focus)
  dark: {
    background: '#0B0F19',      // Dark deep slate blue
    card: '#161F30',            // Darker slate card
    border: '#1F293D',
    text: '#F3F4F6',            // Light gray text
    textMuted: '#9CA3AF',       // Muted gray text
    backgroundMuted: '#1E293B',
  },
  // Neutrals (Light Theme Focus)
  light: {
    background: '#F8FAFC',     // Light slate
    card: '#FFFFFF',           // Pure white card
    border: '#E2E8F0',
    text: '#0F172A',           // Dark slate text
    textMuted: '#64748B',      // Muted slate text
    backgroundMuted: '#F1F5F9',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 28,
    xxxl: 36,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    sm: 18,
    md: 22,
    lg: 26,
    xl: 30,
    xxl: 38,
  },
};

export const Layout = {
  window: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  isSmallDevice: SCREEN_WIDTH < 375,
  isTablet: SCREEN_WIDTH >= 768,
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
};

export const AppConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.finanzaspersonales.example.com',
  timeout: 10000,
};
