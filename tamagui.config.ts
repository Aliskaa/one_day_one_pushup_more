import { createTamagui, createTokens } from 'tamagui'
import { createInterFont } from '@tamagui/font-inter'
import { createAnimations } from '@tamagui/animations-react-native'
import { shorthands } from '@tamagui/shorthands'
import { tokens as defaultTokens } from '@tamagui/themes'

// ============================================================================
// 1. ANIMATIONS - Mouvements fluides et énergétiques
// ============================================================================
const animations = createAnimations({
  // Animation rapide pour les feedbacks immédiats (validation, boutons)
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  // Animation douce pour les transitions de contenu
  smooth: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 120,
  },
  // Animation rebondissante pour les célébrations
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  // Animation lente pour les chargements
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  // Animation énergique pour les achievements
  energetic: {
    type: 'spring',
    damping: 8,
    mass: 0.8,
    stiffness: 180,
  },
})

// ============================================================================
// 2. TYPOGRAPHIE - Hiérarchie claire et lisible
// ============================================================================
const headingFont = createInterFont({
  size: {
    1: 11,   // Micro (badges, labels)
    2: 13,   // Caption (metadata)
    3: 15,   // Body small
    4: 18,   // Body
    5: 22,   // Subtitle
    6: 28,   // Title
    7: 42,   // Hero (objectif du jour)
    8: 60,   // Display (célébrations)
    9: 80,   // Mega (stats principales)
  },
  transform: {
    6: 'none',
    7: 'none',
  },
  weight: {
    1: '300',  // Light
    2: '400',  // Regular
    3: '500',  // Medium
    4: '600',  // Semibold
    5: '700',  // Bold
    6: '800',  // Extrabold
  },
  letterSpacing: {
    1: 0.5,
    4: 0,
    7: -0.5,
    8: -1,
    9: -1.5,
  },
})

const bodyFont = createInterFont(
  {
    face: {
      300: { normal: 'InterLight' },
      400: { normal: 'InterRegular' },
      500: { normal: 'InterMedium' },
      600: { normal: 'InterSemiBold' },
      700: { normal: 'InterBold' },
      800: { normal: 'InterExtraBold' },
    },
  },
  {
    sizeSize: (size) => Math.round(size * 1.1),
    sizeLineHeight: (size) => Math.round(size * 1.4),
  }
)

// ============================================================================
// 3. DESIGN TOKENS - Palette complète fitness & motivation
// ============================================================================
const fitnessTokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    
    // === PALETTE PRINCIPALE (FITNESS ENERGY) ===
    // Bleu énergique (Pompes / Primary)
    blue50: '#eff6ff',
    blue100: '#dbeafe',
    blue200: '#bfdbfe',
    blue300: '#93c5fd',
    blue400: '#60a5fa',
    blue500: '#3b82f6',
    blue600: '#2563eb',
    blue700: '#1d4ed8',
    blue800: '#1e40af',
    blue900: '#1e3a8a',
    
    // Orange dynamique (Crunchs / Secondary)
    orange50: '#fff7ed',
    orange100: '#ffedd5',
    orange200: '#fed7aa',
    orange300: '#fdba74',
    orange400: '#fb923c',
    orange500: '#f97316',
    orange600: '#ea580c',
    orange700: '#c2410c',
    orange800: '#9a3412',
    orange900: '#7c2d12',
    
    // Vert succès (Objectif atteint)
    green50: '#f0fdf4',
    green100: '#dcfce7',
    green200: '#bbf7d0',
    green300: '#86efac',
    green400: '#4ade80',
    green500: '#22c55e',
    green600: '#16a34a',
    green700: '#15803d',
    green800: '#166534',
    green900: '#14532d',
    
    // Rouge alerte (Objectif manqué)
    red50: '#fef2f2',
    red100: '#fee2e2',
    red200: '#fecaca',
    red300: '#fca5a5',
    red400: '#f87171',
    red500: '#ef4444',
    red600: '#dc2626',
    red700: '#b91c1c',
    red800: '#991b1b',
    red900: '#7f1d1d',
    
    // Jaune/Ambre (Streak, flammes)
    amber50: '#fffbeb',
    amber100: '#fef3c7',
    amber200: '#fde68a',
    amber300: '#fcd34d',
    amber400: '#fbbf24',
    amber500: '#f59e0b',
    amber600: '#d97706',
    amber700: '#b45309',
    amber800: '#92400e',
    amber900: '#78350f',
    
    // Violet premium (Achievements rares)
    purple50: '#faf5ff',
    purple100: '#f3e8ff',
    purple200: '#e9d5ff',
    purple300: '#d8b4fe',
    purple400: '#c084fc',
    purple500: '#a855f7',
    purple600: '#9333ea',
    purple700: '#7e22ce',
    purple800: '#6b21a8',
    purple900: '#581c87',
    
    // === PALETTE NEUTRE (UI) ===
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    
    // === COULEURS SÉMANTIQUES MÉTIER ===
    // États de progression
    successBright: '#22c55e',
    successSoft: '#86efac',
    warningBright: '#f59e0b',
    warningSoft: '#fcd34d',
    dangerBright: '#ef4444',
    dangerSoft: '#fca5a5',
    
    // Fitness branding
    pushupPrimary: '#2563eb',
    pushupSecondary: '#60a5fa',
    crunchPrimary: '#ea580c',
    crunchSecondary: '#fb923c',
    
    // Gamification
    streakFlame: '#f59e0b',
    achievementGold: '#fbbf24',
    achievementSilver: '#9ca3af',
    achievementBronze: '#c2410c',
    milestoneRare: '#a855f7',
    
    // Graphiques & visualisations
    chartPositive: '#22c55e',
    chartNegative: '#ef4444',
    chartNeutral: '#60a5fa',
    chartBackground: '#f3f4f6',
  },
  
  // === ESPACEMENTS (Mobile-first) ===
  space: {
    ...defaultTokens.space,
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
    9: 48,
    10: 56,
    11: 64,
    12: 80,
    true: 16, // default
  },
  
  // === RADIUS (Modernité) ===
  radius: {
    ...defaultTokens.radius,
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    true: 12,
    round: 9999,
  },
  
  // === TAILLES ===
  size: {
    ...defaultTokens.size,
    0: 0,
    1: 20,
    2: 28,
    3: 36,
    4: 44,
    5: 52,
    6: 64,
    7: 74,
    8: 84,
    9: 94,
    10: 104,
    true: 44,
  },
  
  // === Z-INDEX ===
  zIndex: {
    ...defaultTokens.zIndex,
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
})

// ============================================================================
// 4. THÈMES - Light & Dark optimisés fitness
// ============================================================================
const lightTheme = {
  // Backgrounds
  background: fitnessTokens.color.gray50,
  backgroundHover: fitnessTokens.color.gray100,
  backgroundPress: fitnessTokens.color.gray200,
  backgroundFocus: fitnessTokens.color.gray100,
  backgroundStrong: '#ffffff',
  backgroundSoft: fitnessTokens.color.gray100,
  backgroundTransparent: 'rgba(255,255,255,0.8)',
  
  // Surfaces (Cards, modales)
  surface: '#ffffff',
  surfaceHover: fitnessTokens.color.gray50,
  surfaceActive: fitnessTokens.color.gray100,
  
  // Textes
  color: fitnessTokens.color.gray900,
  colorHover: fitnessTokens.color.gray800,
  colorPress: fitnessTokens.color.gray700,
  colorFocus: fitnessTokens.color.gray900,
  colorMuted: fitnessTokens.color.gray500,
  colorSubtle: fitnessTokens.color.gray400,
  
  // Bordures
  borderColor: fitnessTokens.color.gray200,
  borderColorHover: fitnessTokens.color.gray300,
  borderColorPress: fitnessTokens.color.gray400,
  borderColorFocus: fitnessTokens.color.blue500,
  
  // Shadows
  shadowColor: 'rgba(0,0,0,0.08)',
  shadowColorHover: 'rgba(0,0,0,0.12)',
  shadowColorPress: 'rgba(0,0,0,0.16)',
  
  // === COULEURS MÉTIER ===
  // Primary (actions principales)
  primary: fitnessTokens.color.blue600,
  primaryHover: fitnessTokens.color.blue700,
  primaryPress: fitnessTokens.color.blue800,
  primaryMuted: fitnessTokens.color.blue100,
  primarySubtle: fitnessTokens.color.blue50,
  
  // Secondary (actions secondaires)
  secondary: fitnessTokens.color.orange600,
  secondaryHover: fitnessTokens.color.orange700,
  secondaryPress: fitnessTokens.color.orange800,
  secondaryMuted: fitnessTokens.color.orange100,
  secondarySubtle: fitnessTokens.color.orange50,
  
  // Success (objectif validé)
  success: fitnessTokens.color.green600,
  successHover: fitnessTokens.color.green700,
  successPress: fitnessTokens.color.green800,
  successMuted: fitnessTokens.color.green100,
  successSubtle: fitnessTokens.color.green50,
  
  // Warning (attention)
  warning: fitnessTokens.color.amber600,
  warningHover: fitnessTokens.color.amber700,
  warningPress: fitnessTokens.color.amber800,
  warningMuted: fitnessTokens.color.amber100,
  warningSubtle: fitnessTokens.color.amber50,
  
  // Danger (échec)
  danger: fitnessTokens.color.red600,
  dangerHover: fitnessTokens.color.red700,
  dangerPress: fitnessTokens.color.red800,
  dangerMuted: fitnessTokens.color.red100,
  dangerSubtle: fitnessTokens.color.red50,
  
  // Fitness spécifique
  streak: fitnessTokens.color.amber500,
  streakBackground: fitnessTokens.color.amber50,
  achievement: fitnessTokens.color.purple600,
  achievementBackground: fitnessTokens.color.purple50,
  milestone: fitnessTokens.color.purple700,
  target: fitnessTokens.color.blue600,
  completed: fitnessTokens.color.green600,
  missed: fitnessTokens.color.red500,
  pending: fitnessTokens.color.gray400,
  
  // Training types
  pushup: fitnessTokens.color.blue600,
  pushupBackground: fitnessTokens.color.blue50,
  crunch: fitnessTokens.color.orange600,
  crunchBackground: fitnessTokens.color.orange50,
}

const darkTheme = {
  // Backgrounds
  background: fitnessTokens.color.gray900,
  backgroundHover: fitnessTokens.color.gray800,
  backgroundPress: fitnessTokens.color.gray700,
  backgroundFocus: fitnessTokens.color.gray800,
  backgroundStrong: fitnessTokens.color.gray800,
  backgroundSoft: fitnessTokens.color.gray800,
  backgroundTransparent: 'rgba(17,24,39,0.8)',
  
  // Surfaces
  surface: fitnessTokens.color.gray800,
  surfaceHover: fitnessTokens.color.gray700,
  surfaceActive: fitnessTokens.color.gray600,
  
  // Textes
  color: fitnessTokens.color.gray50,
  colorHover: fitnessTokens.color.gray100,
  colorPress: fitnessTokens.color.gray200,
  colorFocus: fitnessTokens.color.gray50,
  colorMuted: fitnessTokens.color.gray400,
  colorSubtle: fitnessTokens.color.gray500,
  
  // Bordures
  borderColor: fitnessTokens.color.gray700,
  borderColorHover: fitnessTokens.color.gray600,
  borderColorPress: fitnessTokens.color.gray500,
  borderColorFocus: fitnessTokens.color.blue400,
  
  // Shadows
  shadowColor: 'rgba(0,0,0,0.4)',
  shadowColorHover: 'rgba(0,0,0,0.5)',
  shadowColorPress: 'rgba(0,0,0,0.6)',
  
  // === COULEURS MÉTIER (versions dark) ===
  primary: fitnessTokens.color.blue500,
  primaryHover: fitnessTokens.color.blue400,
  primaryPress: fitnessTokens.color.blue300,
  primaryMuted: fitnessTokens.color.blue900,
  primarySubtle: fitnessTokens.color.blue900,
  
  secondary: fitnessTokens.color.orange500,
  secondaryHover: fitnessTokens.color.orange400,
  secondaryPress: fitnessTokens.color.orange300,
  secondaryMuted: fitnessTokens.color.orange900,
  secondarySubtle: fitnessTokens.color.orange900,
  
  success: fitnessTokens.color.green500,
  successHover: fitnessTokens.color.green400,
  successPress: fitnessTokens.color.green300,
  successMuted: fitnessTokens.color.green900,
  successSubtle: fitnessTokens.color.green900,
  
  warning: fitnessTokens.color.amber500,
  warningHover: fitnessTokens.color.amber400,
  warningPress: fitnessTokens.color.amber300,
  warningMuted: fitnessTokens.color.amber900,
  warningSubtle: fitnessTokens.color.amber900,
  
  danger: fitnessTokens.color.red500,
  dangerHover: fitnessTokens.color.red400,
  dangerPress: fitnessTokens.color.red300,
  dangerMuted: fitnessTokens.color.red900,
  dangerSubtle: fitnessTokens.color.red900,
  
  // Fitness spécifique
  streak: fitnessTokens.color.amber400,
  streakBackground: fitnessTokens.color.amber900,
  achievement: fitnessTokens.color.purple500,
  achievementBackground: fitnessTokens.color.purple900,
  milestone: fitnessTokens.color.purple400,
  target: fitnessTokens.color.blue500,
  completed: fitnessTokens.color.green500,
  missed: fitnessTokens.color.red400,
  pending: fitnessTokens.color.gray600,
  
  // Training types
  pushup: fitnessTokens.color.blue500,
  pushupBackground: fitnessTokens.color.blue900,
  crunch: fitnessTokens.color.orange500,
  crunchBackground: fitnessTokens.color.orange900,
}

// ============================================================================
// 5. CONFIGURATION FINALE
// ============================================================================
export const tamaguiConfig = createTamagui({
  animations,
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  
  tokens: fitnessTokens,
  
  // Breakpoints responsive
  media: {
    xs: { maxWidth: 660 },
    sm: { minWidth: 661, maxWidth: 800 },
    md: { minWidth: 801, maxWidth: 1020 },
    lg: { minWidth: 1021, maxWidth: 1280 },
    xl: { minWidth: 1281, maxWidth: 1420 },
    xxl: { minWidth: 1421 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 801 },
    gtMd: { minWidth: 1021 },
    gtLg: { minWidth: 1281 },
  },
})

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

// ============================================================================
// EXPORTS UTILITAIRES
// ============================================================================

// Type-safe theme helpers
export type ThemeTokens = typeof lightTheme
export type ColorTokens = typeof fitnessTokens.color

// Constants pour usage direct
export const TRAINING_COLORS = {
  pushup: {
    primary: fitnessTokens.color.pushupPrimary,
    secondary: fitnessTokens.color.pushupSecondary,
    background: fitnessTokens.color.blue50,
  },
  crunch: {
    primary: fitnessTokens.color.crunchPrimary,
    secondary: fitnessTokens.color.crunchSecondary,
    background: fitnessTokens.color.orange50,
  },
} as const

export const STATUS_COLORS = {
  success: fitnessTokens.color.green600,
  warning: fitnessTokens.color.amber600,
  danger: fitnessTokens.color.red600,
  info: fitnessTokens.color.blue600,
} as const

export const GAMIFICATION_COLORS = {
  streak: fitnessTokens.color.amber500,
  achievement: fitnessTokens.color.purple600,
  milestone: fitnessTokens.color.purple700,
  gold: fitnessTokens.color.amber500,
  silver: fitnessTokens.color.gray400,
  bronze: fitnessTokens.color.orange700,
} as const