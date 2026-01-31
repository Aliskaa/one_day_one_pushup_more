import { Card } from '@/components/ui';
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';
import { Button, Text, XStack } from 'tamagui';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

interface MonthNavigationProps {
  selectedMonth: number;
  selectedYear: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function MonthNavigation({ selectedMonth, selectedYear, onPrevious, onNext }: MonthNavigationProps) {
  return (
    <Card elevated paddingVertical="$3" paddingHorizontal="$4">
      <XStack alignItems="center" justifyContent="space-between">
        <Button
          size="$4"
          chromeless
          icon={ChevronLeft}
          onPress={onPrevious}
          disabled={selectedMonth === 0}
          opacity={selectedMonth === 0 ? 0.3 : 1}
        />
        <Text fontSize={20} fontWeight="700" color="$color" fontFamily="$heading">
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
        <Button
          size="$4"
          chromeless
          icon={ChevronRight}
          onPress={onNext}
          disabled={selectedMonth === 11}
          opacity={selectedMonth === 11 ? 0.3 : 1}
        />
      </XStack>
    </Card>
  );
}
