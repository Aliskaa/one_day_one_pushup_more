import React from 'react';
import { Button, XStack, Text } from 'tamagui';
import { Calendar } from '@tamagui/lucide-icons';
import { UI_CONSTANTS } from '@/constants/constants';

interface TodayButtonProps {
  onPress: () => void;
}

export const TodayButton: React.FC<TodayButtonProps> = ({ onPress }) => (
  <XStack
    position="absolute"
    right={20}
    bottom={UI_CONSTANTS.TODAY_BUTTON_BOTTOM_OFFSET}
    zIndex={100} // Augmenté pour être sûr d'être au dessus
  >
    <Button
      size="$5" // Un peu plus grand pour être facile à toucher
      bg="$primary"
      color="white"
      borderRadius={100} // Pill shape
      icon={<Calendar size={20} />}
      onPress={onPress}
      animation="bouncy"
      pressStyle={{ scale: 0.9, rotate: '-5deg' }} // Petite rotation sympa
      enterStyle={{ opacity: 0, scale: 0.5, y: 20 }}
      elevate
      shadowColor="$shadowColor"
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 5 }}
    >
      <Text fontFamily="$heading" color="white" fontWeight="700" fontSize={13}>
        Aujourd'hui
      </Text>
    </Button>
  </XStack>
);