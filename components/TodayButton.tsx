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
    zIndex={10}
  >
    <Button
      size="$4"
      bg="$blue9"
      color="#fff"
      rounded={25}
      icon={Calendar}
      onPress={onPress}
      pressStyle={{ scale: 0.95, opacity: 0.9 }}
      animation="quick"
      elevate
      shadowColor="$blue9"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.4}
      shadowRadius={10}
    >
      <Text color="#fff" fontWeight="700" fontSize={13}>
        Aujourd'hui
      </Text>
    </Button>
  </XStack>
);