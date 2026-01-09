import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, Text, H2, Spinner } from 'tamagui';
import { Calendar } from '@tamagui/lucide-icons';

import { UI_CONSTANTS } from '@/constants/constants';
import { DayDataType } from '@/types/Day';
import { DayRow } from '@/components/DayRow';
import { TodayButton } from '@/components/TodayButton';
import { useProgressData } from '@/hooks/useProgressData';

export default function DaysListScreen() {
  const { days, todayIndex, updateDay, isLoading, error } = useProgressData();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (todayIndex !== -1 && days.length > 0) {
      const timer = setTimeout(() => {
        scrollToToday();
      }, 500);
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

  // Header Component Tamagui
  const ListHeader = () => (
    <YStack px="$4" pt="$4" pb="$2" gap="$1">
      <YStack flexDirection="row" items="center" gap="$2">
        <Calendar size={24} color="$blue10" />
        <H2 fontSize={24} fontWeight="900" color="$purple12">
          Mon Calendrier
        </H2>
      </YStack>
      <Text fontSize={14} color="$purple10" fontWeight="600">
        365 jours de discipline 💪
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
      />
    ),
    [updateDay, todayIndex]
  );

  const getItemLayout = (data: any, index: number) => ({
    length: UI_CONSTANTS.DAY_ROW_HEIGHT,
    offset: UI_CONSTANTS.DAY_ROW_HEIGHT * index,
    index,
  });

  // États de chargement et erreur
  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" background="$purple2">
        <Spinner size="large" color="$blue9" />
        <Text mt="$4" color="$purple11" fontWeight="600">
          Chargement du calendrier...
        </Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} items="center" justify="center" background="$purple2" p="$4">
        <Text color="$red10" fontSize={18} fontWeight="700" verticalAlign="center">
          ❌ {error}
        </Text>
        <Text color="$purple11" mt="$2" verticalAlign="center">
          Vérifie ta connexion internet
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} background="$purple2">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatListRef}
          data={days}
          renderItem={renderItem}
          keyExtractor={(item) => item.dateStr}
          getItemLayout={getItemLayout}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={{ 
            paddingBottom: UI_CONSTANTS.LIST_BOTTOM_PADDING,
            paddingTop: 10,
          }}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      <TodayButton onPress={scrollToToday} />
    </YStack>
  );
}