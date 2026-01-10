// Fallback for using Lucide icons on Android and web.

import { Home, Send, Code, ChevronRight, Calendar, Settings } from '@tamagui/lucide-icons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type ViewStyle } from 'react-native';

// Map SF Symbol names to Lucide icon components
const MAPPING = {
  'house.fill': Home,
  'paperplane.fill': Send,
  'chevron.left.forwardslash.chevron.right': Code,
  'chevron.right': ChevronRight,
  'calendar.circle.fill': Calendar,
  'gearshape.fill': Settings,
} as const;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Lucide icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Lucide icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const LucideIcon = MAPPING[name];
  return <LucideIcon color={color as string} size={size} style={style} />;
}
