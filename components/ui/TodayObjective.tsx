import { styled, YStack, XStack, H1, Text } from 'tamagui';
import { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { HeroCard } from './Card';

// ============================================================================
// TODAY OBJECTIVE - Hero section pour objectif du jour
// ============================================================================

export const ObjectiveContainer = styled(HeroCard, {
  name: 'ObjectiveContainer',
  alignItems: 'center',
  gap: '$4',
  paddingVertical: '$8',
});

export const ObjectiveLabel = styled(Text, {
  name: 'ObjectiveLabel',
  fontSize: 14,
  fontWeight: '700',
  fontFamily: '$heading',
  color: '$colorMuted',
  textTransform: 'uppercase',
  letterSpacing: 2,
});

export const ObjectiveNumber = styled(H1, {
  name: 'ObjectiveNumber',
  fontSize: 80,
  fontWeight: '900',
  fontFamily: '$heading',
  color: '$primary',
  lineHeight: 80,
  
  variants: {
    completed: {
      true: {
        color: '$success',
      },
    },
  } as const,
});

export const ObjectiveTarget = styled(Text, {
  name: 'ObjectiveTarget',
  fontSize: 18,
  fontWeight: '600',
  fontFamily: '$body',
  color: '$color',
});

export const ObjectiveProgress = styled(YStack, {
  name: 'ObjectiveProgress',
  width: '100%',
  gap: '$2',
  marginTop: '$3',
});

export const ProgressBarContainer = styled(YStack, {
  name: 'ProgressBarContainer',
  width: '100%',
  height: 8,
  backgroundColor: '$backgroundSoft',
  borderRadius: '$round',
  overflow: 'hidden',
});

export const ProgressBarFill = styled(YStack, {
  name: 'ProgressBarFill',
  height: '100%',
  borderRadius: '$round',
  
  variants: {
    status: {
      progress: {
        backgroundColor: '$primary',
      },
      completed: {
        backgroundColor: '$success',
      },
      exceeded: {
        backgroundColor: '$achievement',
      },
    },
  } as const,
  
  defaultVariants: {
    status: 'progress',
  },
});

export interface TodayObjectiveProps {
  current: number;
  target: number;
  trainingType: 'pushup' | 'crunch';
  onValueChange?: (value: number) => void;
  editable?: boolean;
}

export const TodayObjective = forwardRef<any, TodayObjectiveProps>((props, ref) => {
  const { current, target, trainingType, onValueChange, editable = true } = props;
  
  const percentage = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const isCompleted = current >= target;
  const isExceeded = current > target;
  const progressStatus = isExceeded ? 'exceeded' : isCompleted ? 'completed' : 'progress';
  
  const label = trainingType === 'pushup' ? 'pompes' : 'crunchs';
  
  return (
    <ObjectiveContainer ref={ref}>
      <ObjectiveLabel>Objectif du jour</ObjectiveLabel>
      
      <YStack alignItems="center" gap="$2">
        <ObjectiveNumber completed={isCompleted}>
          {current}
        </ObjectiveNumber>
        <ObjectiveTarget>
          / {target} {label}
        </ObjectiveTarget>
      </YStack>
      
      <ObjectiveProgress>
        <ProgressBarContainer>
          <ProgressBarFill 
            status={progressStatus}
            width={`${percentage}%`}
          />
        </ProgressBarContainer>
        <XStack justifyContent="space-between" paddingHorizontal="$2">
          <Text fontSize={12} color="$colorMuted" fontWeight="600">
            {percentage.toFixed(0)}%
          </Text>
          {isCompleted && (
            <Text fontSize={12} color="$success" fontWeight="700">
              ✓ Validé
            </Text>
          )}
        </XStack>
      </ObjectiveProgress>
    </ObjectiveContainer>
  );
});

TodayObjective.displayName = 'TodayObjective';
