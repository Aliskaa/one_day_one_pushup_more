import { SignOutButton } from '@/components/SignOutButton';
import { NotificationSettings } from '@/components/NotificationSettings';
import { APP_NAME } from '@/constants/constants';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useUser } from '@clerk/clerk-expo';
import { ChevronRight, Moon, Sun, Shield, HelpCircle } from '@tamagui/lucide-icons';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Card, H1, H2, ScrollView, Separator, Switch, Text, XStack, YStack } from 'tamagui';

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
}

const MenuItem = ({
  icon: Icon,
  title,
  subtitle,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  onPress
}: MenuItemProps) => (
  <XStack
    p="$4"
    alignItems="center"
    gap="$4"
    bg="$background" // Fond neutre
    pressStyle={{ bg: '$backgroundHover' }}
    animation="quick"
    onPress={isSwitch ? undefined : onPress}
  >
    <YStack p="$2" bg="$backgroundHover" borderRadius={10}>
      <Icon size={20} color="$primary" />
    </YStack>

    <YStack flex={1}>
      <Text fontSize={16} fontWeight="600" color="$color">{title}</Text>
      {subtitle && <Text fontSize={12} color="$color" opacity={0.6}>{subtitle}</Text>}
    </YStack>

    {isSwitch ? (
      <Switch
        size="$2"
        checked={switchValue}
        onCheckedChange={onSwitchChange}
      >
        <Switch.Thumb animation="bouncy" bg={switchValue ? '$primary' : '$borderColor'} />
      </Switch>
    ) : (
      <ChevronRight size={20} color="$borderColor" />
    )}
  </XStack>
);

export default function SettingsScreen() {
  const { user } = useUser();
  const { theme, toggleTheme, isSystemTheme } = useAppTheme();

  const isDark = theme === 'dark';

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
            <Card elevate p="$4" borderRadius={24} bg="$background" animation="lazy" bordered borderColor="$borderColor">
              <XStack gap="$4" alignItems="center">
                <Avatar circular size="$6">
                  <Avatar.Image src={user?.imageUrl} />
                  <Avatar.Fallback bg="$primary" />
                </Avatar>
                <YStack flex={1}>
                  <H2 fontFamily="$heading" size="$5" color="$color">
                    {user?.fullName || 'Utilisateur'}
                  </H2>
                  <Text fontSize={14} color="$color" opacity={0.6} numberOfLines={1}>
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
              
              {/* Notifications Settings Component */}
              <NotificationSettings />

              {/* Theme Card */}
              <Card elevate overflow="hidden" borderRadius={20} bg="$background" bordered borderColor="$borderColor" mt="$2">
                <MenuItem
                  icon={isDark ? Moon : Sun}
                  title="Mode Sombre"
                  subtitle={isSystemTheme ? 'Automatique (Système)' : (isDark ? 'Activé' : 'Désactivé')}
                  isSwitch
                  switchValue={isDark}
                  onSwitchChange={toggleTheme}
                />
              </Card>
            </YStack>

            {/* Support Section (Ajouté pour compléter la page) */}
            <YStack gap="$2">
              <Text ml="$2" fontSize={13} fontWeight="700" color="$color" opacity={0.5} textTransform="uppercase">
                Support
              </Text>
              <Card elevate overflow="hidden" borderRadius={20} bg="$background" bordered borderColor="$borderColor">
                <MenuItem icon={HelpCircle} title="Aide & FAQ" />
                <Separator borderColor="$borderColor" />
                <MenuItem icon={Shield} title="Confidentialité" />
              </Card>
            </YStack>

            {/* Logout Zone */}
            <YStack mt="$4">
              <SignOutButton />
              <Text textAlign="center" mt="$4" fontSize={12} color="$color" opacity={0.4}>
                Version 1.0.0 • {APP_NAME}
              </Text>
            </YStack>

          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}