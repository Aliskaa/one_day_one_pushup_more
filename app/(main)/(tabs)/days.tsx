import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarHeatmap } from '@/components/calendar/CalendarHeatmap';
import { DayEditSheet } from '@/components/calendar/DayEditSheet';
import { DaysList } from '@/components/calendar/DaysList';
import { MonthNavigation } from '@/components/calendar/MonthNavigation';
import { MonthStats } from '@/components/calendar/MonthStats';
import { useTraining } from '@/contexts/TrainingContext';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useDayEdit } from '@/hooks/useDayEdit';
import { useProgressData } from '@/hooks/useProgressData';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Spinner, Text, YStack } from 'tamagui';

export default function DaysCalendarScreen() {
  const { days, updateDay, isLoading, error } = useProgressData();
  const { trainingType } = useTraining();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(2026);

  const { monthStats, calendarDays } = useCalendarData(days, selectedMonth, selectedYear);
  const {
    selectedDay,
    editValue,
    isEditable,
    setEditValue,
    handleDayClick,
    handleSaveEdit,
    handleCloseSheet
  } = useDayEdit(days, updateDay);

  const handlePreviousMonth = () => {
    if (selectedMonth > 0) setSelectedMonth(selectedMonth - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonth < 11) setSelectedMonth(selectedMonth + 1);
  };

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4" >
        <Text color="$danger" fontSize={18} fontWeight="700" fontFamily="$heading">❌ {error}</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$5" paddingBottom="$10">
            
            <CalendarHeader />

            <MonthNavigation
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onPrevious={handlePreviousMonth}
              onNext={handleNextMonth}
            />

            <MonthStats
              completed={monthStats.completed}
              missed={monthStats.missed}
              total={monthStats.total}
              trainingType={trainingType}
            />

            <DaysList
              calendarDays={calendarDays}
              selectedDate={selectedDay?.dateStr || null}
              onDayClick={handleDayClick}
            />

            <CalendarHeatmap
              calendarDays={calendarDays}
              onDayClick={handleDayClick}
            />

          </YStack>
        </ScrollView>
      </SafeAreaView>

      <DayEditSheet
        isOpen={selectedDay !== null}
        dayData={selectedDay?.dayData}
        dateStr={selectedDay?.dateStr || ''}
        isEditable={isEditable}
        editValue={editValue}
        trainingType={trainingType}
        onEditChange={setEditValue}
        onSave={handleSaveEdit}
        onClose={handleCloseSheet}
      />
    </YStack>
  );
}
