import React from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, useTheme } from 'tamagui';

interface RefreshableScreenProps {
    children: React.ReactNode;
    onRefresh: () => void;
    isRefreshing: boolean;
    style?: object;
}

export default function RefreshableScreen({
    children,
    onRefresh,
    isRefreshing,
}: RefreshableScreenProps) {
    const theme = useTheme();

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            bg="$backgroundHover"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    tintColor={theme.primary.val} // Votre couleur Tamagui
                    colors={[theme.primary.val]}
                />
            }
        >
            {children}
        </ScrollView>
    );
}