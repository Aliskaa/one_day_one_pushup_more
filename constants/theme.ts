/**
 * ============================================================================
 * DESIGN SYSTEM THEME CONSTANTS
 * ============================================================================
 * Couleurs et styles pour l'application "One Day One Pushup More"
 * Basé sur le système de tokens Tamagui défini dans tamagui.config.ts
 * 
 * Ces constantes sont utilisées pour les composants non-Tamagui
 * (ex: react-navigation, react-native natifs)
 */

import { Platform } from 'react-native';

// ============================================================================
// PALETTE DE COULEURS (synchro avec tamagui.config.ts)
// ============================================================================

const PALETTE = {
  // Primary (Bleu fitness - Pompes)
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  
  // Secondary (Orange dynamique - Crunchs)
  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange500: '#f97316',
  orange600: '#ea580c',
  orange700: '#c2410c',
  
  // Success (Vert)
  green50: '#f0fdf4',
  green500: '#22c55e',
  green600: '#16a34a',
  
  // Warning (Ambre - Streak)
  amber50: '#fffbeb',
  amber500: '#f59e0b',
  amber600: '#d97706',
  
  // Danger (Rouge)
  red50: '#fef2f2',
  red500: '#ef4444',
  red600: '#dc2626',
  
  // Achievement (Violet)
  purple50: '#faf5ff',
  purple500: '#a855f7',
  purple600: '#9333ea',
  
  // Neutral
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  white: '#ffffff',
  black: '#000000',
} as const;

// ============================================================================
// THÈME LIGHT
// ============================================================================

const lightTheme = {
  // Textes
  text: PALETTE.gray900,
  textMuted: PALETTE.gray500,
  textSubtle: PALETTE.gray400,
  
  // Backgrounds
  background: PALETTE.gray50,
  backgroundSecondary: PALETTE.white,
  backgroundSoft: PALETTE.gray100,
  
  // Surfaces (Cards)
  surface: PALETTE.white,
  surfaceHover: PALETTE.gray50,
  
  // Actions
  tint: PALETTE.blue600,
  primary: PALETTE.blue600,
  secondary: PALETTE.orange600,
  
  // Status
  success: PALETTE.green600,
  warning: PALETTE.amber600,
  danger: PALETTE.red600,
  
  // Fitness specific
  streak: PALETTE.amber500,
  achievement: PALETTE.purple600,
  pushup: PALETTE.blue600,
  crunch: PALETTE.orange600,
  
  // Icons
  icon: PALETTE.gray600,
  iconMuted: PALETTE.gray400,
  
  // Tabs
  tabIconDefault: PALETTE.gray500,
  tabIconSelected: PALETTE.blue600,
  tabBackground: PALETTE.white,
  tabBorder: PALETTE.gray200,
  
  // Borders
  border: PALETTE.gray200,
  borderHover: PALETTE.gray400,
  
  // Shadows
  shadow: 'rgba(0,0,0,0.08)',
} as const;

// ============================================================================
// THÈME DARK
// ============================================================================

const darkTheme = {
  // Textes
  text: PALETTE.gray50,
  textMuted: PALETTE.gray400,
  textSubtle: PALETTE.gray500,
  
  // Backgrounds
  background: PALETTE.gray900,
  backgroundSecondary: PALETTE.gray800,
  backgroundSoft: PALETTE.gray800,
  
  // Surfaces
  surface: PALETTE.gray800,
  surfaceHover: PALETTE.gray700,
  
  // Actions
  tint: PALETTE.blue500,
  primary: PALETTE.blue500,
  secondary: PALETTE.orange500,
  
  // Status
  success: PALETTE.green500,
  warning: PALETTE.amber500,
  danger: PALETTE.red500,
  
  // Fitness specific
  streak: PALETTE.amber500,
  achievement: PALETTE.purple500,
  pushup: PALETTE.blue500,
  crunch: PALETTE.orange500,
  
  // Icons
  icon: PALETTE.gray400,
  iconMuted: PALETTE.gray500,
  
  // Tabs
  tabIconDefault: PALETTE.gray500,
  tabIconSelected: PALETTE.blue500,
  tabBackground: PALETTE.gray800,
  tabBorder: PALETTE.gray700,
  
  // Borders
  border: PALETTE.gray700,
  borderHover: PALETTE.gray600,
  
  // Shadows
  shadow: 'rgba(0,0,0,0.4)',
} as const;

// ============================================================================
// EXPORT PRINCIPAL
// ============================================================================

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
  palette: PALETTE,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
