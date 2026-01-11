import React from 'react';
import { TextInput } from 'react-native';
import { XStack, YStack, Text, Card, useTheme } from 'tamagui';
import { Check, Clock, Circle, Lock } from '@tamagui/lucide-icons';
import { DayDataType } from '@/types/day';

interface DayRowProps {
  item: DayDataType;
  index: number;
  onUpdate: (index: number, value: string) => void;
  isToday?: boolean;
  isLocked?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEP', 'OCT', 'NOV', 'DÉC'];
  const month = months[date.getMonth()];
  return { day, month };
};

export const DayRow: React.FC<DayRowProps> = React.memo(({ item, index, onUpdate, isToday = false, isLocked = false }) => {
  const theme = useTheme();
  
  // Vérifier si c'est un jour passé non rempli
  const itemDate = new Date(item.dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  itemDate.setHours(0, 0, 0, 0);
  
  const isPast = itemDate < today;
  const isMissed = isPast && item.done === null;
  const isLockedOrMissed = isLocked || isMissed;
  
  const isValidated = item.done !== null && item.done >= item.target;
  const isStarted = item.done !== null && item.done > 0;
  
  // Détermination des couleurs dynamiques basées sur le thème
  let statusColor = '$borderColor';
  let StatusIcon = Circle;
  let cardBorderColor = '$borderColor';

  if (isMissed) {
    statusColor = '$danger';
    cardBorderColor = '$danger';
    StatusIcon = Lock;
  } else if (isLocked) {
    statusColor = '$borderColor';
    cardBorderColor = '$borderColor';
    StatusIcon = Lock;
  } else if (isToday) {
    statusColor = '$primary';
    cardBorderColor = '$primary';
  } else if (isValidated) {
    statusColor = '$success';
    cardBorderColor = '$success';
    StatusIcon = Check;
  } else if (isStarted) {
    statusColor = '$warning';
    cardBorderColor = '$warning';
    StatusIcon = Clock;
  }

  const { day, month } = formatDate(item.dateStr);

  return (
    <Card
      elevate={isToday}
      mb="$3"
      mx="$4"
      p="$3"
      borderRadius={20}
      bg={isToday ? '$background' : '$background'} // On garde un fond neutre pour la lisibilité
      borderLeftWidth={5}
      borderLeftColor={cardBorderColor}
      // Petit hack visuel pour mettre en avant "Aujourd'hui"
      borderWidth={isToday ? 2 : 1}
      borderColor={isToday ? '$primary' : '$borderColor'}
      scale={isToday ? 1.02 : 1}
      animation="lazy"
      pressStyle={{ scale: 0.98 }}
    >
      <XStack alignItems="center" gap="$3">
        {/* 1. Date */}
        <YStack alignItems="center" justifyContent="center" minWidth={50}>
          <Text fontFamily="$heading" fontSize={24} color="$color">
            {day}
          </Text>
          <Text fontFamily="$body" fontSize={11} fontWeight="700" color="$color" opacity={0.6}>
            {month}
          </Text>
        </YStack>

        {/* 2. Infos Centrales */}
        <YStack flex={1} gap="$1" justifyContent="center">
          <XStack alignItems="baseline" gap="$2">
             <Text fontSize={12} color="$color" opacity={0.6}>Objectif</Text>
             <Text fontFamily="$heading" fontSize={16} color="$color">{item.target}</Text>
          </XStack>
          
          {/* Barre de progression */}
          <YStack height={6} bg="$backgroundHover" borderRadius={10} overflow="hidden">
            {item.done !== null && (
              <YStack 
                height="100%" 
                width={`${Math.min(100, (item.done / item.target) * 100)}%`}
                bg={isValidated ? '$success' : '$warning'}
                borderRadius={10}
              />
            )}
          </YStack>
        </YStack>
        
        {/* 3. Input Zone */}
        <XStack alignItems="center" gap="$2">
          <TextInput 
            style={{
              width: 70,
              height: 45,
              borderWidth: 1.5,
              borderColor: isMissed ? theme.danger.val : (isValidated ? theme.success.val : (isToday ? theme.primary.val : theme.borderColor.val)),
              backgroundColor: isMissed ? theme.danger.val + '20' : theme.backgroundHover.val,
              borderRadius: 14,
              textAlign: 'center',
              textAlignVertical: 'center',
              padding: 0,
              includeFontPadding: false,
              fontSize: 18,
              fontFamily: 'InterBold', // Utilise ta police custom
              color: isMissed ? theme.danger.val : theme.color.val,
              opacity: isMissed ? 0.7 : 1,
            }}
            keyboardType="numeric"
            placeholder="-"
            placeholderTextColor={isMissed ? theme.danger.val + '60' : theme.color.val + '40'} // Opacité sur le placeholder
            value={item.done?.toString() || ''}
            onChangeText={(text) => onUpdate(index, text)}
            maxLength={4}
            selectTextOnFocus
            editable={!isLockedOrMissed}
          />
          
          <YStack 
            width={32} height={32} borderRadius={16} 
            bg={isMissed ? '$danger' : (isValidated ? '$success' : (isStarted ? '$warning' : '$backgroundHover'))}
            alignItems="center" justifyContent="center"
          >
            <StatusIcon size={16} color={isMissed || isValidated || isStarted ? 'white' : '$color'} />
          </YStack>
        </XStack>
      </XStack>
    </Card>
  );
});