// Loom 4.0 Design System - Modern Heritage (YC Standard)
// Inspired by: Nigerian Excellence, Modern Fintech (Carbon, Cowrywise, Kuda)

export const Colors = {
  // Brand Colors - Modern Heritage
  primary: "#064E3B",      // Obsidian Forest (Deep, Authoritative)
  primaryDark: "#022C22",
  primaryLight: "#ECFDF5", // Mint Mist (Clean, professional)

  secondary: "#059669",    // Loom Green (Action & Growth)

  accent: "#92400E",       // Burnt Bronze (Trust, Craft, Value)
  accentLight: "#FEF3C7",
  accentDark: "#78350F",

  // Neutrals (High Contrast, Technical)
  background: "#FBFBF9",   // Stone Linen (Warmth and premium feel)
  surface: "#FFFFFF",
  cardBorder: "#E7E5E4",   // Stone 200
  muted: "#57534E",        // Stone 600
  text: "#1C1917",         // Stone 900 (High contrast ink)
  textSecondary: "#44403C",// Stone 800

  gray100: "#F5F5F4",
  gray200: "#E7E5E4",
  gray300: "#D6D3D1",
  gray400: "#A8A29E",
  gray500: "#78716C",

  // Semantic
  success: "#059669",
  error: "#991B1B",
  warning: "#D97706",
  info: "#0369A1",

  // UI Utilities
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(28, 15, 10, 0.4)", // Warmer overlay
  transparent: "transparent",
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: "MontserratAlternates-Bold",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "MontserratAlternates-Bold",
    color: Colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "MontserratAlternates-SemiBold",
    color: Colors.text,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: "MontserratAlternates-Medium",
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "MontserratAlternates-Regular",
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "MontserratAlternates-Regular",
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "MontserratAlternates-SemiBold",
    color: Colors.muted,
    textTransform: "uppercase" as const,
    letterSpacing: 1.2,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "MontserratAlternates-SemiBold",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
};

export const Radius = {
  xs: 4,
  sm: 6,
  md: 10,    // Primary radius for cards
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};
