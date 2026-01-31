import { styled, Card as TamaguiCard, CardProps as TamaguiCardProps, YStack, XStack, Text, Progress } from 'tamagui';
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

// ============================================================================
// ACHIEVEMENT CARD COMPONENT (Composant fonctionnel pour achievements)
// ============================================================================

import { Lock, Trophy } from '@tamagui/lucide-icons';
import type { AchievementCategory } from '@/types/achievement';
import { ICON_MAP } from '@/constants/achievements';

interface AchievementCardComponentProps {
  title: string;
  description: string;
  rarity?: AchievementCategory;
  unlocked: boolean;
  progress: number;
  icon?: string;
  color?: string;
}

const RARITY_COLORS = {
  streak: '$red8',
  volume: '$blue8',
  performance: '$orange8',
  discipline: '$green8',
  annual: '$purple8',
  milestone: '$amber8',
  rare: '$pink8',
} as const;

export function AchievementCardComponent({
  title,
  description,
  rarity = 'milestone',
  unlocked,
  progress,
  icon = 'Trophy',
  color,
}: AchievementCardComponentProps) {
  const rarityColor = color || RARITY_COLORS[rarity] || '$purple8';
  const bgColor = unlocked ? rarityColor : '$backgroundHover';
  const textColor = unlocked ? 'white' : '$color';
  const descColor = unlocked ? 'rgba(255,255,255,0.8)' : '$colorMuted';

  const Icon = ICON_MAP[icon] || Trophy;

  return (
    <BaseCard
      backgroundColor={bgColor}
      padding="$4"
      borderWidth={unlocked ? 0 : 1}
      borderColor="$borderColor"
      opacity={unlocked ? 1 : 0.7}
      elevated
    >
      <XStack gap="$3" alignItems="center">
        {/* Icon */}
        <YStack
          width={50}
          height={50}
          backgroundColor={unlocked ? 'rgba(255,255,255,0.2)' : '$background'}
          borderRadius={25}
          alignItems="center"
          justifyContent="center"
        >
          {unlocked ? (
            <Icon size={28} color="white" />
          ) : (
            <Lock size={24} color="$colorMuted" />
          )}
        </YStack>

        {/* Content */}
        <YStack flex={1} gap="$1">
          <Text fontSize={15} fontWeight="700" color={textColor}>
            {title}
          </Text>
          <Text fontSize={13} color={descColor} lineHeight={18}>
            {description}
          </Text>

          {/* Progress bar for locked achievements */}
          {!unlocked && progress > 0 && (
            <YStack gap="$1" marginTop="$2">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={11} color="$colorMuted" fontWeight="600">
                  Progression
                </Text>
                <Text fontSize={11} color="$color" fontWeight="700">
                  {progress.toFixed(0)}%
                </Text>
              </XStack>
              <Progress value={progress} max={100} height={6}>
                <Progress.Indicator animation="bouncy" backgroundColor={rarityColor} />
              </Progress>
            </YStack>
          )}

          {/* Unlocked badge */}
          {unlocked && (
            <XStack gap="$1" alignItems="center" marginTop="$1">
              <Trophy size={12} color="white" />
              <Text fontSize={11} fontWeight="600" color="white">
                Débloqué
              </Text>
            </XStack>
          )}
        </YStack>
      </XStack>
    </BaseCard>
  );
}
