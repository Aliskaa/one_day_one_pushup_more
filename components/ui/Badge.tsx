import { styled, View, Text, ViewProps } from 'tamagui';
import { forwardRef } from 'react';

// ============================================================================
// BASE BADGE COMPONENT
// ============================================================================

export const BaseBadge = styled(View, {
  name: 'BaseBadge',
  
  // Defaults
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$round',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  gap: '$1',
  
  variants: {
    size: {
      sm: {
        height: 20,
        paddingHorizontal: '$1',
      },
      md: {
        height: 24,
        paddingHorizontal: '$2',
      },
      lg: {
        height: 32,
        paddingHorizontal: '$3',
      },
    },
    
    variant: {
      default: {
        backgroundColor: '$backgroundPress',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      primary: {
        backgroundColor: '$primary',
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: '$secondary',
        borderWidth: 0,
      },
      success: {
        backgroundColor: '$success',
        borderWidth: 0,
      },
      warning: {
        backgroundColor: '$warning',
        borderWidth: 0,
      },
      danger: {
        backgroundColor: '$danger',
        borderWidth: 0,
      },
      muted: {
        backgroundColor: '$backgroundSoft',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

// ============================================================================
// BADGE TEXT
// ============================================================================

export const BadgeText = styled(Text, {
  name: 'BadgeText',
  fontSize: 12,
  fontWeight: '600',
  fontFamily: '$body',
  
  variants: {
    variant: {
      default: {
        color: '$color',
      },
      primary: {
        color: 'white',
      },
      secondary: {
        color: 'white',
      },
      success: {
        color: 'white',
      },
      warning: {
        color: 'white',
      },
      danger: {
        color: 'white',
      },
      muted: {
        color: '$colorMuted',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'default',
  },
});

// ============================================================================
// STATUS BADGE (Statuts de progression)
// ============================================================================

export const StatusBadge = styled(BaseBadge, {
  name: 'StatusBadge',
  
  variants: {
    status: {
      completed: {
        backgroundColor: '$success',
      },
      missed: {
        backgroundColor: '$danger',
      },
      pending: {
        backgroundColor: '$backgroundPress',
        borderWidth: 1,
        borderColor: '$borderColor',
      },
      future: {
        backgroundColor: '$backgroundSoft',
        borderWidth: 1,
        borderColor: '$borderColor',
        opacity: 0.6,
      },
    },
  } as const,
});

// ============================================================================
// STREAK BADGE (Badge de série)
// ============================================================================

export const StreakBadge = styled(BaseBadge, {
  name: 'StreakBadge',
  backgroundColor: '$streakBackground',
  borderWidth: 2,
  borderColor: '$streak',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  gap: '$2',
  
  variants: {
    highlight: {
      true: {
        backgroundColor: '$streak',
        shadowColor: '$streak',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    size: {
      sm: {
        height: 28,
      },
      md: {
        height: 36,
      },
      lg: {
        height: 44,
      },
    },
  } as const,
});

// ============================================================================
// ACHIEVEMENT BADGE (Badge d'accomplissement)
// ============================================================================

export const AchievementBadge = styled(BaseBadge, {
  name: 'AchievementBadge',
  backgroundColor: '$achievementBackground',
  borderWidth: 2,
  borderColor: '$achievement',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  
  variants: {
    unlocked: {
      true: {
        backgroundColor: '$achievement',
        shadowColor: '$achievement',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
      false: {
        opacity: 0.5,
        backgroundColor: '$backgroundSoft',
        borderColor: '$borderColor',
      },
    },
    rarity: {
      common: {
        borderColor: '$gray400',
        backgroundColor: '$gray100',
      },
      rare: {
        borderColor: '$blue500',
        backgroundColor: '$blue50',
      },
      epic: {
        borderColor: '$purple500',
        backgroundColor: '$purple50',
      },
      legendary: {
        borderColor: '$amber500',
        backgroundColor: '$amber50',
      },
    },
  } as const,
});

// ============================================================================
// LEVEL BADGE (Badge de niveau)
// ============================================================================

export const LevelBadge = styled(BaseBadge, {
  name: 'LevelBadge',
  width: 48,
  height: 48,
  borderRadius: '$round',
  backgroundColor: '$primary',
  borderWidth: 3,
  borderColor: 'white',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 8,
  
  variants: {
    size: {
      sm: {
        width: 32,
        height: 32,
        borderWidth: 2,
      },
      md: {
        width: 48,
        height: 48,
        borderWidth: 3,
      },
      lg: {
        width: 64,
        height: 64,
        borderWidth: 4,
      },
    },
  } as const,
});

// ============================================================================
// DOT BADGE (Notification dot)
// ============================================================================

export const DotBadge = styled(View, {
  name: 'DotBadge',
  width: 8,
  height: 8,
  borderRadius: '$round',
  backgroundColor: '$danger',
  
  variants: {
    size: {
      sm: {
        width: 6,
        height: 6,
      },
      md: {
        width: 8,
        height: 8,
      },
      lg: {
        width: 12,
        height: 12,
      },
    },
    variant: {
      primary: {
        backgroundColor: '$primary',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      danger: {
        backgroundColor: '$danger',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    variant: 'danger',
  },
});

// ============================================================================
// COUNT BADGE (Badge avec compteur)
// ============================================================================

export const CountBadge = styled(BaseBadge, {
  name: 'CountBadge',
  minWidth: 20,
  height: 20,
  borderRadius: '$round',
  backgroundColor: '$danger',
  paddingHorizontal: '$1',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      danger: {
        backgroundColor: '$danger',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'danger',
  },
});

// ============================================================================
// SMART BADGE COMPONENT
// ============================================================================

export interface CustomBadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';
  size?: 'sm' | 'md' | 'lg';
}

export type BadgeProps = Omit<ViewProps, 'outline'> & CustomBadgeProps;

export const Badge = forwardRef<any, BadgeProps>((props, ref) => {
  const { children, variant = 'default', size = 'md', ...rest } = props;
  
  return (
    <BaseBadge ref={ref} variant={variant} size={size} {...rest}>
      {typeof children === 'string' ? (
        <BadgeText variant={variant}>
          {children}
        </BadgeText>
      ) : (
        children
      )}
    </BaseBadge>
  );
});

Badge.displayName = 'Badge';

// ============================================================================
// EXPORTS
// ============================================================================

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'muted';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeStatus = 'completed' | 'missed' | 'pending' | 'future';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
