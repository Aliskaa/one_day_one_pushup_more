import { styled, YStack, XStack, Text } from 'tamagui';
import { forwardRef } from 'react';
import { Flame } from '@tamagui/lucide-icons';
import { StatCard } from './Card';

// ============================================================================
// STREAK DISPLAY - Affichage de la série avec flamme
// ============================================================================

export const StreakContainer = styled(StatCard, {
  name: 'StreakContainer',
  variant: 'streak',
  highlight: true,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: '$5',
});

export const StreakContent = styled(XStack, {
  name: 'StreakContent',
  alignItems: 'center',
  gap: '$3',
});

export const StreakNumber = styled(Text, {
  name: 'StreakNumber',
  fontSize: 48,
  fontWeight: '900',
  fontFamily: '$heading',
  color: '$streak',
  lineHeight: 48,
});

export const StreakLabel = styled(YStack, {
  name: 'StreakLabel',
  gap: '$1',
});

export const StreakText = styled(Text, {
  name: 'StreakText',
  fontSize: 16,
  fontWeight: '700',
  fontFamily: '$body',
  color: '$color',
});

export const StreakSubtext = styled(Text, {
  name: 'StreakSubtext',
  fontSize: 12,
  fontWeight: '600',
  fontFamily: '$body',
  color: '$colorMuted',
});

export const StreakIcon = styled(YStack, {
  name: 'StreakIcon',
  width: 64,
  height: 64,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$round',
  backgroundColor: '$streak',
  
  variants: {
    animated: {
      true: {
        animation: 'bouncy',
      },
    },
  } as const,
});

export interface StreakDisplayProps {
  streak: number;
  bestStreak?: number;
  animated?: boolean;
}

export const StreakDisplay = forwardRef<any, StreakDisplayProps>((props, ref) => {
  const { streak, bestStreak, animated = true } = props;
  
  const hasStreak = streak > 0;
  
  return (
    <StreakContainer ref={ref}>
      <StreakContent>
        <StreakIcon animated={animated && hasStreak}>
          <Flame size={36} color="white" />
        </StreakIcon>
        
        <StreakLabel>
          <XStack alignItems="baseline" gap="$2">
            <StreakNumber>{streak}</StreakNumber>
            <StreakText>jours</StreakText>
          </XStack>
          <StreakSubtext>
            {hasStreak ? 'Série en cours' : 'Aucune série'}
            {bestStreak && bestStreak > streak && ` • Record: ${bestStreak}`}
          </StreakSubtext>
        </StreakLabel>
      </StreakContent>
      
      {hasStreak && streak >= 3 && (
        <YStack alignItems="flex-end" gap="$1">
          <Text fontSize={24}>🔥</Text>
          <Text fontSize={10} color="$colorMuted" fontWeight="600">
            Continue !
          </Text>
        </YStack>
      )}
    </StreakContainer>
  );
});

StreakDisplay.displayName = 'StreakDisplay';
