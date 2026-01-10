import React from 'react';
import { ScrollView, YStack, XStack, Text, H1, H2, Card, Separator, Avatar, Switch, useTheme } from 'tamagui';
import { User, Bell, Moon, ChevronRight, HelpCircle, Shield } from '@tamagui/lucide-icons';
import { useUser } from '@clerk/clerk-expo';
import { SignOutButton } from '@/components/SignOutButton'; // Assure-toi du chemin
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { user } = useUser();
  const theme = useTheme();

  // Composant helper pour une ligne de menu
  const MenuItem = ({ icon: Icon, title, subtitle, hasSwitch = false }: any) => (
    <XStack 
      p="$4" 
      alignItems="center" 
      gap="$4" 
      pressStyle={{ bg: '$backgroundHover' }}
      animation="quick"
    >
      <YStack p="$2" bg="$backgroundHover" borderRadius={10}>
        <Icon size={20} color="$primary" />
      </YStack>
      <YStack flex={1}>
        <Text fontSize={16} fontWeight="600" color="$color">{title}</Text>
        {subtitle && <Text fontSize={12} color="$color" opacity={0.6}>{subtitle}</Text>}
      </YStack>
      {hasSwitch ? (
        <Switch size="$2" bg="$backgroundHover">
          <Switch.Thumb animation="bouncy" bg="$primary" />
        </Switch>
      ) : (
        <ChevronRight size={20} color="$borderColor" />
      )}
    </XStack>
  );

  return (
    <YStack flex={1} bg="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack p="$4" gap="$5" pb="$8">
            
            {/* Header */}
            <YStack mt="$2">
              <H1 fontFamily="$heading" size="$8" color="$color">Paramètres</H1>
            </YStack>

            {/* Profile Card */}
            <Card elevate bordered p="$4" borderRadius={24} bg="$background" animation="lazy">
              <XStack gap="$4" alignItems="center">
                <Avatar circular size="$6">
                  <Avatar.Image src={user?.imageUrl} />
                  <Avatar.Fallback bg="$primary" />
                </Avatar>
                <YStack>
                  <H2 fontFamily="$heading" size="$5" color="$color">
                    {user?.fullName || 'Utilisateur'}
                  </H2>
                  <Text fontSize={14} color="$color" opacity={0.6}>
                    {user?.primaryEmailAddress?.emailAddress}
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* General Section */}
            <YStack gap="$2">
              <Text ml="$2" fontSize={13} fontWeight="700" color="$color" opacity={0.5} textTransform="uppercase">
                Général
              </Text>
              <Card elevate bordered overflow="hidden" borderRadius={20} bg="$background">
                <MenuItem icon={Bell} title="Notifications" subtitle="Rappels quotidiens" hasSwitch />
                <Separator borderColor="$borderColor" />
                <MenuItem icon={Moon} title="Mode Sombre" subtitle="Apparence de l'application" hasSwitch />
              </Card>
            </YStack>

            {/* Logout Zone */}
            <YStack mt="$4">
              <SignOutButton />
              <Text textAlign="center" mt="$4" fontSize={12} color="$color" opacity={0.4}>
                Version 1.0.0 • Journal.ai
              </Text>
            </YStack>

          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}