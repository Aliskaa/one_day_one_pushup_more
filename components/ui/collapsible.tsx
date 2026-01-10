import { ChevronRight } from '@tamagui/lucide-icons';
import { PropsWithChildren, useState } from 'react';
import { Pressable } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <YStack>
      <Pressable onPress={() => setIsOpen((value) => !value)}>
        <XStack alignItems="center" gap="$2" py="$2">
          <ChevronRight
            size={18}
            color="$color"
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />
          <Text fontWeight="600" color="$color">{title}</Text>
        </XStack>
      </Pressable>
      {isOpen && (
        <YStack ml="$6" mt="$1">
          {children}
        </YStack>
      )}
    </YStack>
  );
}
