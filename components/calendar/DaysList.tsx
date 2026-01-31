import { DayDataType } from '@/types/day';
import { Edit3 } from '@tamagui/lucide-icons';
import { ScrollView, Text, YStack } from 'tamagui';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface DaysListProps {
  calendarDays: Array<{ day: number; dayData: DayDataType | undefined; dateStr: string } | null>;
  selectedDate: string | null;
  onDayClick: (dayData: DayDataType | undefined, dateStr: string) => void;
}

export function DaysList({ calendarDays, selectedDate, onDayClick }: DaysListProps) {
  const checkIsEditable = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return clickedDate.getTime() === today.getTime() || clickedDate.getTime() === yesterday.getTime();
  };

  return (
    <YStack gap="$2">
      <Text fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase" marginLeft="$2" fontFamily="$heading">
        Détails par jour
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 12 }}
      >
        {calendarDays.filter(item => item !== null).map((item) => {
          const { day, dayData, dateStr } = item!;
          const isSelected = selectedDate === dateStr;
          const isEditable = checkIsEditable(dateStr);

          return (
            <YStack
              key={dateStr}
              onPress={() => onDayClick(dayData, dateStr)}
              alignItems="center"
              gap="$1"
              padding="$2"
              borderRadius="$4"
              backgroundColor={isSelected ? '$primary' : '$backgroundStrong'}
              borderWidth={1}
              borderColor={isSelected ? '$primary' : '$borderColor'}
              width={65}
            >
              <Text fontSize={10} color={isSelected ? 'white' : '$colorMuted'} fontWeight="700">
                {WEEKDAYS[(new Date(dateStr).getUTCDay() + 6) % 7]}
              </Text>
              <Text fontSize={18} fontWeight="800" color={isSelected ? 'white' : '$color'}>
                {day}
              </Text>
              <YStack height={4} width={20} borderRadius={2} backgroundColor={dayData?.done ? '$green10Dark' : '$borderColor'} />
              <Text fontSize={12} fontWeight="700" color={isSelected ? 'white' : '$colorMuted'}>
                {dayData?.done || 0} / {dayData?.target || 0}
              </Text>
              {isEditable && (
                <YStack position="absolute" top={6} right={6}>
                  <Edit3 size={8} color={isSelected ? 'white' : '$colorMuted'} opacity={0.6} />
                </YStack>
              )}
            </YStack>
          );
        })}
      </ScrollView>
    </YStack>
  );
}
