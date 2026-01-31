import { NotificationSettings } from '@/components/NotificationSettings';
import { SignOutButton } from '@/components/SignOutButton';
import { Card } from '@/components/ui';
import { APP_NAME } from '@/constants/constants';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useTraining } from '@/contexts/TrainingContext';
import SvgCrunch from '@/icons/Crunch';
import SvgPushUp from '@/icons/Pushup';
import { useUser } from '@clerk/clerk-expo';
import { ChevronRight, Dumbbell, Moon, Sun, BookOpen, User } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, H2, ScrollView, Separator, Sheet, Switch, Text, XStack, YStack } from 'tamagui';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MenuItemProps {
  icon: any;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
}

const MenuItem = ({
  icon: Icon,
  iconColor = '$primary',
  iconBg = '$backgroundHover',
  title,
  subtitle,
  isSwitch = false,
  switchValue,
  onSwitchChange,
  onPress
}: MenuItemProps) => (
  <XStack
    p="$3.5"
    alignItems="center"
    gap="$3"
    bg="transparent"
    pressStyle={{ bg: '$backgroundHover', opacity: 0.8 }}
    animation="quick"
    onPress={isSwitch ? undefined : onPress}
    cursor={onPress ? 'pointer' : 'default'}
  >
    <YStack 
      width={40} 
      height={40} 
      bg={iconBg} 
      borderRadius={12}
      alignItems="center"
      justifyContent="center"
    >
      <Icon size={20} color={iconColor} />
    </YStack>

    <YStack flex={1}>
      <Text fontSize={15} fontWeight="600" color="$color">{title}</Text>
      {subtitle && <Text fontSize={12} color="$colorMuted" marginTop="$1">{subtitle}</Text>}
    </YStack>

    {isSwitch ? (
      <Switch
        size="$3"
        checked={switchValue}
        onCheckedChange={onSwitchChange}
        backgroundColor={switchValue ? '$primary' : '$backgroundHover'}
      >
        <Switch.Thumb animation="bouncy" backgroundColor="white" />
      </Switch>
    ) : (
      <ChevronRight size={18} color="$colorMuted" />
    )}
  </XStack>
);

const SettingsGroup = ({ children }: { children: React.ReactNode }) => (
  <Card 
    backgroundColor="$background" 
    padding="$0"
    borderRadius={16}
  >
    {children}
  </Card>
);

export default function SettingsScreen() {
  const { user } = useUser();
  const { theme, toggleTheme, isSystemTheme } = useAppTheme();
  const { trainingType, selectTraining } = useTraining();
  const router = useRouter();
  const [showTrainingSheet, setShowTrainingSheet] = useState(false);

  const isDark = theme === 'dark';

  const handleReviewOnboarding = async () => {
    // Réinitialiser le flag d'onboarding
    await AsyncStorage.removeItem('onboarding_completed');
    // Rediriger vers l'onboarding
    router.push('/onboarding');
  };

  return (
    <YStack flex={1} backgroundColor="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$4" paddingBottom="$10">

            {/* Header */}
            <YStack gap="$3" paddingTop="$2">
              <H2 fontSize={28} fontWeight="800" color="$color">
                Paramètres
              </H2>

              {/* Profile Card */}
              <Card 
                backgroundColor="$background" 
                padding="$4"
                borderRadius={16}
              >
                <XStack gap="$3" alignItems="center">
                  <Avatar circular size="$6" borderWidth={2} borderColor="$primary">
                    <Avatar.Image src={user?.imageUrl} />
                    <Avatar.Fallback backgroundColor="$primary">
                      <User size={24} color="white" />
                    </Avatar.Fallback>
                  </Avatar>
                  <YStack flex={1} gap="$1">
                    <Text fontSize={17} fontWeight="700" color="$color">
                      {user?.fullName || 'Utilisateur'}
                    </Text>
                    <Text fontSize={13} color="$colorMuted" numberOfLines={1}>
                      {user?.primaryEmailAddress?.emailAddress}
                    </Text>
                  </YStack>
                </XStack>
              </Card>
            </YStack>


            {/* Training Section */}
            <YStack gap="$3">
              <Text marginLeft="$2" fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase">
                Entraînement
              </Text>

              <SettingsGroup>
                <MenuItem
                  icon={Dumbbell}
                  iconColor="$primary"
                  iconBg="$backgroundHover"
                  title="Défi actuel"
                  subtitle={trainingType === 'pushup' ? 'Pompes' : trainingType === 'crunch' ? 'Crunch' : 'Non sélectionné'}
                  onPress={() => setShowTrainingSheet(true)}
                />
              </SettingsGroup>
            </YStack>

            {/* Appearance Section */}
            <YStack gap="$3">
              <Text marginLeft="$2" fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase">
                Apparence
              </Text>

              <SettingsGroup>
                <MenuItem
                  icon={isDark ? Moon : Sun}
                  iconColor={isDark ? '$purple8' : '$amber8'}
                  iconBg={isDark ? '$backgroundHover' : '$backgroundHover'}
                  title="Mode Sombre"
                  subtitle={isSystemTheme ? 'Automatique (Système)' : (isDark ? 'Activé' : 'Désactivé')}
                  isSwitch
                  switchValue={isDark}
                  onSwitchChange={toggleTheme}
                />
              </SettingsGroup>

              {/* Notifications Settings Component */}
              <NotificationSettings />
            </YStack>

            {/* Support */}
            <YStack gap="$3">
              <Text marginLeft="$2" fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase">
                Support
              </Text>

              <SettingsGroup>
                <MenuItem
                  icon={BookOpen}
                  iconColor="$blue8"
                  iconBg="$backgroundHover"
                  title="Revoir l'introduction"
                  subtitle="Découvrez à nouveau l'application"
                  onPress={handleReviewOnboarding}
                />
              </SettingsGroup>
            </YStack>

            {/* Logout Zone */}
            <YStack marginTop="$2">
              <SignOutButton />
              <Text textAlign="center" marginTop="$4" fontSize={11} color="$colorMuted">
                Version 1.0.0 • {APP_NAME}
              </Text>
            </YStack>

          </YStack>
        </ScrollView>

        {/* Sheet pour changer de défi */}
        <Sheet
          modal
          open={showTrainingSheet}
          onOpenChange={setShowTrainingSheet}
          snapPoints={[45]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Frame backgroundColor="$background" padding="$4" borderTopLeftRadius={20} borderTopRightRadius={20}>
            <YStack gap="$4" paddingBottom="$4">
              {/* Handle */}
              <YStack alignItems="center">
                <YStack width={40} height={4} backgroundColor="$borderColor" borderRadius={10} />
              </YStack>

              <YStack alignItems="center" gap="$2">
                <H2 fontSize={20} fontWeight="700" color="$color">
                  Changer de défi
                </H2>
                <Text fontSize={14} color="$colorMuted" textAlign="center">
                  Vos progrès seront sauvegardés séparément.
                </Text>
              </YStack>

              <YStack gap="$3">
                <Button
                  size="$5"
                  backgroundColor={trainingType === 'pushup' ? '$primary' : '$backgroundHover'}
                  borderWidth={trainingType === 'pushup' ? 0 : 1}
                  borderColor="$borderColor"
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                  onPress={() => {
                    selectTraining('pushup');
                    setShowTrainingSheet(false);
                    router.replace('/(main)/(tabs)/home');
                  }}
                >
                  <XStack gap="$3" alignItems="center">
                    <SvgPushUp size={28} color={trainingType === 'pushup' ? 'white' : '$color'} />
                    <Text fontSize={16} fontWeight="600" color={trainingType === 'pushup' ? 'white' : '$color'}>
                      Pompes
                    </Text>
                  </XStack>
                </Button>

                <Button
                  size="$5"
                  backgroundColor={trainingType === 'crunch' ? '$primary' : '$backgroundHover'}
                  borderWidth={trainingType === 'crunch' ? 0 : 1}
                  borderColor="$borderColor"
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                  onPress={() => {
                    selectTraining('crunch');
                    setShowTrainingSheet(false);
                    router.replace('/(main)/(tabs)/home');
                  }}
                >
                  <XStack gap="$3" alignItems="center">
                    <SvgCrunch size={28} color={trainingType === 'crunch' ? 'white' : '$color'} />
                    <Text fontSize={16} fontWeight="600" color={trainingType === 'crunch' ? 'white' : '$color'}>
                      Crunch
                    </Text>
                  </XStack>
                </Button>
              </YStack>

              <Button
                size="$4"
                backgroundColor="$backgroundHover"
                borderColor="$borderColor"
                borderWidth={1}
                color="$color"
                onPress={() => setShowTrainingSheet(false)}
                pressStyle={{ opacity: 0.8 }}
              >
                Annuler
              </Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </SafeAreaView>
    </YStack>
  );
}