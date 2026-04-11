/**
 * Choutuppal 2.0 — Color Design System
 * Premium, modern color palette with dark mode support.
 */

export const palette = {
  // Primary brand — vivid teal-cyan gradient
  primary: '#06B6D4',
  primaryDark: '#0891B2',
  primaryLight: '#67E8F9',

  // Accent — warm amber for CTAs
  accent: '#F59E0B',
  accentDark: '#D97706',
  accentLight: '#FCD34D',

  // Success / Error / Warning
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  gray950: '#0A0F1A',

  // Glassmorphism
  glassBg: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.18)',
  glassBgDark: 'rgba(0,0,0,0.35)',
  glassBorderDark: 'rgba(255,255,255,0.08)',
};

export const lightTheme = {
  background: palette.gray50,
  surface: palette.white,
  surfaceElevated: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray500,
  textTertiary: palette.gray400,
  border: palette.gray200,
  primary: palette.primary,
  primaryText: palette.white,
  accent: palette.accent,
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  tabBarActive: palette.primary,
  tabBarInactive: palette.gray400,
  card: palette.white,
  cardBorder: palette.gray100,
  statusBar: 'dark' as const,
};

export const darkTheme = {
  background: palette.gray950,
  surface: palette.gray900,
  surfaceElevated: palette.gray800,
  text: palette.gray50,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  border: palette.gray800,
  primary: palette.primaryLight,
  primaryText: palette.gray950,
  accent: palette.accentLight,
  tabBar: palette.gray900,
  tabBarBorder: palette.gray800,
  tabBarActive: palette.primaryLight,
  tabBarInactive: palette.gray500,
  card: palette.gray900,
  cardBorder: palette.gray800,
  statusBar: 'light' as const,
};

export type AppTheme = typeof lightTheme;
