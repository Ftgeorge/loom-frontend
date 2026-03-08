// ─── Light Theme ───────────────────────────────────────────────────────────────
export const LightColors = {
  // Core Canvas
  canvas: '#FDFDFD',
  background: '#F8F7F5',
  surface: '#FFFFFF',

  // Typography
  ink: '#0F0F0F',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  muted: '#9CA3AF',

  // Brand
  primary: '#0F3826',
  primaryDark: '#0A2419',
  primaryLight: '#E8F5EE',
  secondary: '#16A34A',

  // Electric Violet
  violet: '#7C3AED',
  violetLight: '#F3EEFF',
  violetDark: '#5B21B6',
  violetGlow: 'rgba(124, 58, 237, 0.15)',

  // Craft Accent
  accent: '#92400E',
  accentLight: '#FEF3C7',
  accentDark: '#78350F',

  // UI Neutrals
  cardBorder: 'rgba(0,0,0,0.06)',
  divider: 'rgba(0,0,0,0.04)',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',

  // Glass
  glass: 'rgba(255,255,255,0.72)',
  glassDark: 'rgba(15,56,38,0.80)',
  glassLight: 'rgba(253,253,253,0.85)',

  // Semantic
  success: '#16A34A',
  successLight: '#DCFCE7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  // Utilities
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.45)',
  transparent: 'transparent',
};

// ─── Dark Theme ────────────────────────────────────────────────────────────────
export const DarkColors = {
  // Core Canvas
  canvas: '#0F0F0F',
  background: '#141414',
  surface: '#1C1C1E',

  // Typography
  ink: '#F5F5F5',
  text: '#E5E5E5',
  textSecondary: '#A3A3A3',
  muted: '#737373',

  // Brand — lightened for dark bg legibility
  primary: '#4ADE80',
  primaryDark: '#86EFAC',
  primaryLight: '#14532D',
  secondary: '#4ADE80',

  // Electric Violet — lighter on dark
  violet: '#A78BFA',
  violetLight: '#2E1065',
  violetDark: '#C4B5FD',
  violetGlow: 'rgba(167, 139, 250, 0.18)',

  // Craft Accent
  accent: '#FCD34D',
  accentLight: '#451A03',
  accentDark: '#FDE68A',

  // UI Neutrals
  cardBorder: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.05)',
  gray100: '#262626',
  gray200: '#404040',
  gray300: '#525252',
  gray400: '#737373',
  gray500: '#A3A3A3',

  // Glass
  glass: 'rgba(28,28,30,0.85)',
  glassDark: 'rgba(0,0,0,0.60)',
  glassLight: 'rgba(40,40,42,0.90)',

  // Semantic — adjusted for dark backgrounds
  success: '#4ADE80',
  successLight: '#14532D',
  error: '#F87171',
  errorLight: '#450A0A',
  warning: '#FBBF24',
  warningLight: '#451A03',
  info: '#60A5FA',
  infoLight: '#1E3A5F',

  // Utilities
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.65)',
  transparent: 'transparent',
};

// ─── Convenience alias (keeps all existing imports working) ───────────────────
export const Colors = LightColors;

// ─── Color selector ───────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark';
export function getColors(mode: ThemeMode) {
  return mode === 'dark' ? DarkColors : LightColors;
}


export const Typography = {
  // Display — Plus Jakarta Sans for brand identity
  display: {
    fontSize: 40,
    lineHeight: 46,
    fontFamily: 'PlusJakartaSans-ExtraBold',
    color: Colors.ink,
    letterSpacing: -0.8,
  },
  h1: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.ink,
    letterSpacing: -0.6,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.ink,
    letterSpacing: -0.4,
  },
  h3: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.ink,
    letterSpacing: -0.2,
  },

  // Body — Inter for reading clarity
  bodyLarge: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },

  // Label — PlusJakartaSans for structure
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },
  labelSmall: {
    fontSize: 9,
    lineHeight: 12,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },

  // Button
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    letterSpacing: 0.1,
  },

  // Numeric / Data — Inter for fintech feel
  data: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Inter-Bold',
    color: Colors.ink,
    letterSpacing: -0.5,
  },
  dataSmall: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
    color: Colors.ink,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 36,
  full: 9999,
};

export const Shadows = {
  // Soft, premium shadows — no harsh borders
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 28,
    elevation: 10,
  },
  // Violet glow — for "magic" AI elements
  violet: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  // Brand glow
  brand: {
    shadowColor: '#0F3826',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};
