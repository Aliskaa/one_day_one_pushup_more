import { APP_NAME } from '@/constants/constants';
import React from 'react';
import { Image, Text, YStack } from 'tamagui';

export default function Logo({ hasText = false }: { hasText?: boolean }) {
    return (
        <YStack gap="$3" alignItems="center">
            <YStack
                backgroundColor="$backgroundHover"
                padding="$4"
                borderRadius={24}
                alignItems="center"
                justifyContent="center"
            >
                <Image
                    source={require('../assets/images/logo_one_day_one_pushup_more.png')}
                    width={160}
                    height={240}
                    resizeMode="contain"
                />
            </YStack>
            {hasText && (
                <Text fontSize={20} fontWeight="700" color="$color" textAlign="center">
                    {APP_NAME}
                </Text>
            )}
        </YStack>
    );
}