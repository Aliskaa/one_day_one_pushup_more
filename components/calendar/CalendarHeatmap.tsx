import { Card } from '@/components/ui';
import { isDayCompleted, isDayMissed } from '@/helpers/dateUtils';
import { DayDataType } from '@/types/day';
import { Edit3 } from '@tamagui/lucide-icons';
import { Text, XStack, YStack } from 'tamagui';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

interface CalendarHeatmapProps {
  calendarDays: Array<{ day: number; dayData: DayDataType | undefined; dateStr: string } | null>;
  onDayClick: (dayData: DayDataType | undefined, dateStr: string) => void;
}

export function CalendarHeatmap({ calendarDays, onDayClick }: CalendarHeatmapProps) {
  const checkIsEditable = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(dateStr);
    clickedDate.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return clickedDate.getTime() === today.getTime() || clickedDate.getTime() === yesterday.getTime();
  };

  const getDayColors = (dayData: DayDataType | undefined, dateStr: string) => {
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    const isCompleted = dayData && isDayCompleted(dayData.done, dayData.target);
    const isMissed = dayData && isDayMissed(dayData.done, dayData.target);
    const isPending = dayData && dayData.done !== null && !isCompleted;
    const isFuture = new Date(dateStr) > new Date();

    let bgColor = '$backgroundHover';
    let textColor = '$colorMuted';

    if (isCompleted) {
      bgColor = '$green10Dark';
      textColor = 'white';
    } else if (isPending) {
      bgColor = '$orange10Dark';
      textColor = 'white';
    } else if (isMissed) {
      bgColor = '$red10Dark';
      textColor = 'white';
    } else if (isToday) {
      bgColor = '$primary';
      textColor = 'white';
    } else if (isFuture) {
      textColor = '$colorMuted';
    }

    return { bgColor, textColor, isToday };
  };

  return (
    <Card elevated padding="$4">
      <YStack gap="$3">
        {/* Jours de la semaine */}
        <XStack justifyContent="space-around">
          {WEEKDAYS.map((day, i) => (
            <YStack key={i} width={40} alignItems="center">
              <Text fontSize={12} fontWeight="700" color="$colorMuted" fontFamily="$heading">
                {day}
              </Text>
            </YStack>
          ))}
        </XStack>

        {/* Grille calendrier */}
        <YStack gap="$2">
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => {
            const week = calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7);
            while (week.length < 7) {
              week.push(null);
            }

            return (
              <XStack key={weekIndex} justifyContent="space-around" gap="$2">
                {week.map((item, dayIndex) => {
                  if (!item) {
                    return <YStack key={dayIndex} width={40} height={40} />;
                  }

                  const { day, dayData, dateStr } = item;
                  const isEditable = checkIsEditable(dateStr);
                  const { bgColor, textColor, isToday } = getDayColors(dayData, dateStr);

                  return (
                    <YStack
                      key={dayIndex}
                      width={40}
                      height={40}
                      backgroundColor={bgColor}
                      borderRadius={8}
                      alignItems="center"
                      justifyContent="center"
                      borderWidth={isToday ? 2 : 0}
                      borderColor="$color"
                      onPress={isEditable ? () => onDayClick(dayData, dateStr) : undefined}
                      pressStyle={isEditable ? { opacity: 0.7, scale: 0.95 } : undefined}
                      cursor={isEditable ? 'pointer' : 'default'}
                    >
                      <Text fontSize={14} fontWeight={isToday ? '800' : '600'} color={textColor} fontFamily="$body">
                        {day}
                      </Text>
                      {isEditable && (
                        <YStack position="absolute" top={2} right={2}>
                          <Edit3 size={8} color={textColor} opacity={0.6} />
                        </YStack>
                      )}
                    </YStack>
                  );
                })}
              </XStack>
            );
          })}
        </YStack>

        {/* Légende */}
        <XStack gap="$3" marginTop="$3" justifyContent="center" flexWrap="wrap">
          <XStack gap="$2" alignItems="center">
            <YStack width={16} height={16} backgroundColor="$green10Dark" borderRadius={4} />
            <Text fontSize={11} color="$colorMuted" fontFamily="$heading">Validé</Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <YStack width={16} height={16} backgroundColor="$red10Dark" borderRadius={4} />
            <Text fontSize={11} color="$colorMuted" fontFamily="$heading">Raté</Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <YStack width={16} height={16} backgroundColor="$orange10Dark" borderRadius={4} />
            <Text fontSize={11} color="$colorMuted" fontFamily="$heading">En cours</Text>
          </XStack>
          <XStack gap="$2" alignItems="center">
            <YStack width={16} height={16} backgroundColor="$primary" borderRadius={4} />
            <Text fontSize={11} color="$colorMuted" fontFamily="$heading">Aujourd'hui</Text>
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}
