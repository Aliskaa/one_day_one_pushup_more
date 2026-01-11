import { Calendar } from '@tamagui/lucide-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { H2, Spinner, Text, YStack } from 'tamagui';

import { DayRow } from '@/components/DayRow';
import { TodayButton } from '@/components/TodayButton';
import { UI_CONSTANTS } from '@/constants/constants';
import { useProgressData } from '@/hooks/useProgressData';
import { DayDataType } from '@/types/day';

export default function DaysListScreen() {
  const { days, todayIndex, updateDay, isLoading, error } = useProgressData();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (todayIndex !== -1 && days.length > 0) {
      const timer = setTimeout(() => scrollToToday(), 500);
      return () => clearTimeout(timer);
    }
  }, [todayIndex, days.length]);

  const scrollToToday = useCallback(() => {
    if (todayIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: todayIndex,
        animated: true,
        viewPosition: 0.2,
      });
    }
  }, [todayIndex]);

  const ListHeader = () => (
    <YStack px="$4" pt="$6" pb="$4" gap="$2">
      <YStack flexDirection="row" alignItems="center" gap="$3">
        <YStack bg="$brandSoft" p="$2" borderRadius="$4">
             <Calendar size={24} color="$primary" />
        </YStack>
        <H2 fontFamily="$heading" size="$6" color="$color">
          Mon Calendrier
        </H2>
      </YStack>
      <Text fontSize={15} color="$color" opacity={0.6} ml="$1">
        365 jours de discipline, une pompe à la fois.
      </Text>
    </YStack>
  );

  const renderItem = useCallback(
    ({ item, index }: { item: DayDataType; index: number }) => (
      <DayRow
        item={item}
        index={index}
        onUpdate={updateDay}
        isToday={index === todayIndex}
        isLocked={index < todayIndex && index !== todayIndex}
      />
    ),
    [updateDay, todayIndex]
  );

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="$backgroundHover">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="$backgroundHover" p="$4">
        <Text color="$danger" fontSize={18} fontWeight="700">❌ {error}</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$backgroundHover">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={days}
          renderItem={renderItem}
          keyExtractor={(item) => item.dateStr}
          getItemLayout={(data, index) => ({
            length: UI_CONSTANTS.DAY_ROW_HEIGHT,
            offset: UI_CONSTANTS.DAY_ROW_HEIGHT * index,
            index,
          })}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ 
            paddingBottom: UI_CONSTANTS.LIST_BOTTOM_PADDING,
          }}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      {/* Assure-toi que TodayButton utilise les props Tamagui ou passe lui des styles */}
      <TodayButton onPress={scrollToToday} />
    </YStack>
  );
}