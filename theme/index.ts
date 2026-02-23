// Operis Theme System
export const Colors = {
  softSage: '#ACC8A2',
  deepOlive: '#1A2517',
  background: '#F7F8F4',
  accent: '#C49A3A',
  error: '#D64545',
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
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',
  softSageLight: '#D4E4CE',
  softSageDark: '#8AB57E',
  accentLight: '#D4B05C',
  accentDark: '#A07E28',
  overlayDark: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.1)',
  cardBorder: '#E8EBE4',
};

export const Typography = {
  heading1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: Colors.deepOlive,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: Colors.deepOlive,
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: Colors.deepOlive,
  },
  heading4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: Colors.deepOlive,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: Colors.gray700,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.gray600,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: Colors.gray500,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    color: Colors.gray700,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  section: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  button: {
    shadowColor: Colors.deepOlive,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const HitSlop = { top: 12, bottom: 12, left: 12, right: 12 };
