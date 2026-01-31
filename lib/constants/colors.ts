/**
 * TutorTom Brand Colors - Extracted from UI Screenshot
 * Use these exact colors throughout the Brain Test feature
 */
export const TUTORTOM_COLORS = {
  primaryBlue: "#4F7BFE",
  accentPurple: "#A855F7",
  backgroundDark: "#0F172A",
  cardDark: "#1E293B",
  borderGrey: "#334155",
  textWhite: "#FFFFFF",
  textLightGrey: "#CBD5E1",
} as const;

export type TutorTomColor = typeof TUTORTOM_COLORS[keyof typeof TUTORTOM_COLORS];
