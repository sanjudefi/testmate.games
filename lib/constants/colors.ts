/**
 * TestMate Brand Colors - Extracted from UI Screenshot
 * Use these exact colors throughout the Brain Test feature
 */
export const TESTMATE_COLORS = {
  primaryBlue: "#4F7BFE",
  accentPurple: "#A855F7",
  backgroundDark: "#0F172A",
  cardDark: "#1E293B",
  borderGrey: "#334155",
  textWhite: "#FFFFFF",
  textLightGrey: "#CBD5E1",
} as const;

export type TestMateColor = typeof TESTMATE_COLORS[keyof typeof TESTMATE_COLORS];
