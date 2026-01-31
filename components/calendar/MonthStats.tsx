import { AnimatedCounter, StatCard } from '@/components/ui';
import { TrainingName } from '@/contexts/TrainingContext';
import { Text, XStack, YStack } from 'tamagui';

interface MonthStatsProps {
  completed: number;
  missed: number;
  total: number;
  trainingType: TrainingName | null;
}

export function MonthStats({ completed, missed, total, trainingType }: MonthStatsProps) {
  return (
    <YStack gap="$3">
      <Text fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase" marginLeft="$2" fontFamily="$heading">
        Ce mois
      </Text>
      <XStack gap="$3">
        <StatCard flex={1} variant="success">
          <Text fontSize={11} color="$colorMuted" fontWeight="600" fontFamily="$heading">Validés</Text>
          <AnimatedCounter value={completed} fontSize={28} fontWeight="800" color="$success" />
          <Text fontSize={10} color="$colorMuted" fontFamily="$body">jours</Text>
        </StatCard>

        <StatCard flex={1} variant="primary">
          <Text fontSize={11} color="$colorMuted" fontWeight="600" fontFamily="$heading">Ratés</Text>
          <AnimatedCounter value={missed} fontSize={28} fontWeight="800" color="$danger" />
          <Text fontSize={10} color="$colorMuted" fontFamily="$body">jours</Text>
        </StatCard>

        <StatCard flex={1}>
          <Text fontSize={11} color="$colorMuted" fontWeight="600" fontFamily="$heading">Total</Text>
          <AnimatedCounter value={total} fontSize={24} fontWeight="800" color="$color" />
          <Text fontSize={10} color="$colorMuted" fontFamily="$body">{trainingType === 'pushup' ? 'pompes' : 'crunchs'}</Text>
        </StatCard>
      </XStack>
    </YStack>
  );
}
