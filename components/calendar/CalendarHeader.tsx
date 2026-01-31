import { Calendar } from '@tamagui/lucide-icons';
import { H2, Text, YStack } from 'tamagui';

export function CalendarHeader() {
  return (
    <YStack gap="$2" alignItems="center" paddingTop="$2">
      <Calendar size={48} color="$primary" />
      <H2 fontSize={28} fontWeight="800" color="$color" fontFamily="$heading">
        Calendrier
      </H2>
      <Text fontSize={14} color="$colorMuted" textAlign="center" fontFamily="$body">
        Suivez votre progression jour par jour
      </Text>
    </YStack>
  );
}
