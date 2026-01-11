import { APP_NAME } from '@/constants/constants';
import { Dumbbell } from '@tamagui/lucide-icons';
import React from 'react';

import { Avatar, Image, Text, XStack, YStack } from 'tamagui';

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
                <Image
                    source={require('../assets/images/logo_one_day_one_pushup_more.png')}
                    width={200}
                    height={300}
                />
            </XStack>
            {hasText && (
                <Text fontSize="$7" fontWeight="700" color="$color" textAlign='center'>
                    {APP_NAME}
                </Text>
            )}
        </YStack>
    );
}