// Loom 3.0 Design System - Heritage Forest (Mature & Native)
// Inspired by: Nigerian Heritage, Kuda, Carbon, Cowrywise (Mature Fintech)

export const Colors = {
  // Brand Colors - Heritage Forest
  primary: "#064E3B",     // Deep Forest Green (Authority & Maturity)
  primaryDark: "#062016",
  primaryLight: "#ECFDF5",

  accent: "#B45309",      // Heritage Bronze (Craft & red earth)
  accentLight: "#FFFBEB",

  // Neutrals (Mature & Sharp)
  background: "#FAFAF9",  // Warm off-white
  surface: "#FFFFFF",
  cardBorder: "#E7E5E4",  // Stone 200
  muted: "#78716C",       // Stone 500
  text: "#1C1917",        // Stone 900
  textSecondary: "#44403C",

  // Semantic
  success: "#15803D",
  error: "#B91C1C",
  warning: "#D97706",
  info: "#0369A1",

  // UI Utilities
  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(28, 25, 23, 0.7)",
};

export const Typography = {
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: "System", // Mature choice
    fontWeight: "700" as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "System",
    fontWeight: "700" as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: "System",
    fontWeight: "600" as const,
    color: Colors.text,
  },
  bodyLarge: {
    fontSize: 17,
    lineHeight: 24,
    fontFamily: "System",
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "System",
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "System",
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: "System",
    fontWeight: "600" as const,
    color: Colors.muted,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "System",
    fontWeight: "600" as const,
  },
};

export const Spacing = {
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
  64: 64,
};

export const Radius = {
  xs: 2,
  sm: 4,
  md: 8,    // Mature, sharper corners
  lg: 12,   // Max for cards
  xl: 16,   // Used sparingly
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: "#1C1917",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
};
