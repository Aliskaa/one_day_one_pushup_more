import React from 'react';
import { TextInput } from 'react-native';
import { XStack, YStack, Text, Card } from 'tamagui';
import { Check, Clock, Circle } from '@tamagui/lucide-icons';
import { DayDataType } from '@/types/Day';

interface DayRowProps {
  item: DayDataType;
  index: number;
  onUpdate: (index: number, value: string) => void;
  isToday?: boolean;
}

// Fonction helper pour afficher la date joliment
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEP', 'OCT', 'NOV', 'DÉC'];
  const month = months[date.getMonth()];
  return { day, month };
};

export const DayRow: React.FC<DayRowProps> = React.memo(({ item, index, onUpdate, isToday = false }) => {
  const isValidated = item.done !== null && item.done >= item.target;
  const isStarted = item.done !== null && item.done > 0;
  
  // Couleur et icône dynamiques
  let statusColor = '$purple8';
  let StatusIcon = Circle;
  
  if (isValidated) {
    statusColor = '$green9';
    StatusIcon = Check;
  } else if (isStarted) {
    statusColor = '$orange9';
    StatusIcon = Clock;
  }

  const { day, month } = formatDate(item.dateStr);

  return (
    <Card
      elevate={isToday}
      mb="$3"
      mx="$4"
      p="$3"
      borderRadius={16}
      bg={isToday ? '$blue2' : '$background'}
      borderLeftWidth={5}
      borderStartColor={isToday ? '$blue9' : isValidated ? '$green9' : isStarted ? '$orange9' : '$purple6'}
      borderWidth={isToday ? 1 : 0}
      borderColor="$blue9"
      scale={isToday ? 1.02 : 1}
      animation="quick"
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
    >
      <XStack verticalAlign="center" gap="$3">
        {/* 1. Bloc Date à gauche */}
        <YStack verticalAlign="center" justify="center" minW={45}>
          <Text fontSize={22} fontWeight="900" color="$purple12">
            {day}
          </Text>
          <Text fontSize={10} fontWeight="700" color="$purple10" textTransform="uppercase">
            {month}
          </Text>
          {isToday && (
            <YStack mt="$1" bg="$blue9" px="$2" py="$0.5" rounded={4}>
              <Text fontSize={8} fontWeight="800" color="#fff">
                AUJOURD'HUI
              </Text>
            </YStack>
          )}
        </YStack>

        {/* 2. Infos Centrales */}
        <YStack flex={1} gap="$1">
          <XStack verticalAlign="baseline" gap="$1">
            <Text fontSize={12} color="$purple10" fontWeight="600">
              Objectif
            </Text>
            <Text fontSize={20} fontWeight="800" color="$purple11">
              {item.target}
            </Text>
          </XStack>
          
          {/* Barre de progression mini */}
          {item.done !== null && (
            <YStack height={4} background="$purple4" rounded={2} overflow="hidden">
              <YStack 
                height="100%" 
                width={`${Math.min(100, (item.done / item.target) * 100)}%`}
                background={isValidated ? '$green9' : '$orange9'}
                rounded={2}
              />
            </YStack>
          )}
        </YStack>
        
        {/* 3. Input et Statut à droite */}
        <XStack verticalAlign="center" gap="$2">
          <TextInput 
            style={{
              width: 70,
              height: 45,
              borderWidth: isValidated ? 2 : 1,
              borderColor: isValidated ? '#4CAF50' : isToday ? '#2196F3' : '#E0E0E0',
              backgroundColor: isValidated ? '#F1F8E9' : '#fff',
              borderRadius: 12,
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 'bold',
              color: isValidated ? '#2E7D32' : '#333',
            }}
            keyboardType="numeric"
            placeholder="-"
            placeholderTextColor="#ccc"
            value={item.done?.toString() || ''}
            onChangeText={(text) => onUpdate(index, text)}
            maxLength={4}
            selectTextOnFocus
          />
          
          <YStack 
            width={32} 
            height={32} 
            rounded={16} 
            background={isValidated ? '$green9' : isStarted ? '$orange9' : '$purple4'}
            verticalAlign="center" 
            justify="center"
          >
            <StatusIcon size={18} color={isValidated || isStarted ? '#fff' : '$purple8'} />
          </YStack>
        </XStack>
      </XStack>
    </Card>
  );
});