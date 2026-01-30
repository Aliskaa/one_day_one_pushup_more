import { styled, Card as TamaguiCard, CardProps as TamaguiCardProps } from 'tamagui';
import { forwardRef } from 'react';

// ============================================================================
// BASE CARD COMPONENT
// ============================================================================

export const BaseCard = styled(TamaguiCard, {
  name: 'BaseCard',
  
  // Defaults
  backgroundColor: '$surface',
  borderRadius: '$4',
  padding: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  
  // Animation
  animation: 'smooth',
  
  variants: {
    // Variantes d'élévation
    elevated: {
      true: {
        shadowColor: '$shadowColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 0,
      },
      false: {
        shadowColor: 'transparent',
        elevation: 0,
      },
    },
    
    // Variantes de padding
    padded: {
      none: {
        padding: 0,
      },
      sm: {
        padding: '$2',
      },
      md: {
        padding: '$4',
      },
      lg: {
        padding: '$6',
      },
    },
    
    // Variantes d'interactivité
    pressable: {
      true: {
        cursor: 'pointer',
        hoverStyle: {
          backgroundColor: '$surfaceHover',
          borderColor: '$borderColorHover',
          shadowColor: '$shadowColorHover',
          shadowRadius: 12,
        },
        pressStyle: {
          backgroundColor: '$surfaceActive',
          scale: 0.99,
        },
      },
    },
    
    // Variantes de couleur
    variant: {
      default: {
        backgroundColor: '$surface',
      },
      muted: {
        backgroundColor: '$backgroundSoft',
      },
      primary: {
        backgroundColor: '$primarySubtle',
        borderColor: '$primaryMuted',
      },
      success: {
        backgroundColor: '$successSubtle',
        borderColor: '$successMuted',
      },
      warning: {
        backgroundColor: '$warningSubtle',
        borderColor: '$warningMuted',
      },
      danger: {
        backgroundColor: '$dangerSubtle',
        borderColor: '$dangerMuted',
      },
    },
  } as const,
  
  defaultVariants: {
    elevated: false,
    padded: 'md',
  },
});

// ============================================================================
// STAT CARD (Pour afficher statistiques)
// ============================================================================

export const StatCard = styled(BaseCard, {
  name: 'StatCard',
  elevated: true,
  padding: '$5',
  gap: '$2',
  alignItems: 'flex-start',
  
  variants: {
    highlight: {
      true: {
        borderLeftWidth: 4,
        borderLeftColor: '$primary',
      },
    },
    variant: {
      streak: {
        borderLeftColor: '$streak',
        backgroundColor: '$streakBackground',
      },
      achievement: {
        borderLeftColor: '$achievement',
        backgroundColor: '$achievementBackground',
      },
      primary: {
        borderLeftColor: '$primary',
        backgroundColor: '$primarySubtle',
      },
      success: {
        borderLeftColor: '$success',
        backgroundColor: '$successSubtle',
      },
      danger: {
        borderLeftColor: '$danger',
        backgroundColor: '$dangerSubtle',
      },
    },
  } as const,
});

// ============================================================================
// COMPACT CARD (Cards compactes pour listes)
// ============================================================================

export const CompactCard = styled(BaseCard, {
  name: 'CompactCard',
  padding: '$3',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$3',
  
  variants: {
    active: {
      true: {
        borderColor: '$primary',
        borderWidth: 2,
        backgroundColor: '$primarySubtle',
      },
    },
  } as const,
});

// ============================================================================
// HERO CARD (Grande card pour objectif principal)
// ============================================================================

export const HeroCard = styled(BaseCard, {
  name: 'HeroCard',
  elevated: true,
  padding: '$6',
  alignItems: 'center',
  gap: '$4',
  
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 16,
  elevation: 6,
  
  variants: {
    gradient: {
      true: {
        // Sera utilisé avec LinearGradient
      },
    },
  } as const,
});

// ============================================================================
// ACHIEVEMENT CARD (Cards pour achievements)
// ============================================================================

export const AchievementCard = styled(BaseCard, {
  name: 'AchievementCard',
  elevated: true,
  padding: '$4',
  gap: '$3',
  
  variants: {
    unlocked: {
      true: {
        backgroundColor: '$achievementBackground',
        borderColor: '$achievement',
        borderWidth: 2,
      },
      false: {
        opacity: 0.6,
        backgroundColor: '$backgroundSoft',
      },
    },
    rarity: {
      common: {
        borderLeftWidth: 3,
        borderLeftColor: '$gray400',
      },
      rare: {
        borderLeftWidth: 3,
        borderLeftColor: '$blue500',
      },
      epic: {
        borderLeftWidth: 3,
        borderLeftColor: '$purple500',
      },
      legendary: {
        borderLeftWidth: 3,
        borderLeftColor: '$amber500',
      },
    },
  } as const,
});

// ============================================================================
// WORKOUT CARD (Card pour session d'entraînement)
// ============================================================================

export const WorkoutCard = styled(BaseCard, {
  name: 'WorkoutCard',
  elevated: true,
  padding: '$5',
  gap: '$4',
  
  variants: {
    training: {
      pushup: {
        borderTopWidth: 4,
        borderTopColor: '$pushup',
        backgroundColor: '$pushupBackground',
      },
      crunch: {
        borderTopWidth: 4,
        borderTopColor: '$crunch',
        backgroundColor: '$crunchBackground',
      },
    },
    status: {
      completed: {
        borderColor: '$completed',
        backgroundColor: '$successSubtle',
      },
      missed: {
        borderColor: '$missed',
        backgroundColor: '$dangerSubtle',
      },
      pending: {
        borderColor: '$pending',
      },
    },
  } as const,
});

// ============================================================================
// EXPORTS
// ============================================================================

export interface CustomCardProps {
  elevated?: boolean;
  padded?: 'none' | 'sm' | 'md' | 'lg';
  pressable?: boolean;
  variant?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
}

export type CardProps = Omit<TamaguiCardProps, 'padded' | 'elevated'> & CustomCardProps;

export const Card = forwardRef<any, CardProps>((props, ref) => {
  return <BaseCard ref={ref} {...props} />;
});

Card.displayName = 'Card';
