import { Dumbbell } from '@tamagui/lucide-icons';
import React from 'react';

import { Text, XStack, YStack } from 'tamagui';

export default function Logo({ hasText = false }: { hasText?: boolean }) {
    return (
        <YStack gap="$3" style={{ alignItems: 'center' }} mb="$4">
            <XStack
                bg="$orange9"
                p="$3"
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 16,
                }}
            >
                <Dumbbell size={32} color="white" />
            </XStack>
            {hasText && (
                <Text fontSize="$7" fontWeight="700" color="$color">
                    1 Day 1 Pushup+
                </Text>
            )}
        </YStack>
    );
}