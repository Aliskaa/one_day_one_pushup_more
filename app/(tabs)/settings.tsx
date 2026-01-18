import { SignOutButton } from '@/components/SignOutButton';
import { NotificationSettings } from '@/components/NotificationSettings';
import { APP_NAME } from '@/constants/constants';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useTraining } from '@/contexts/TrainingContext';
import { useUser } from '@clerk/clerk-expo';
import { ChevronRight, Moon, Sun, Shield, HelpCircle, Bell, Dumbbell } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, H1, H2, ScrollView, Separator, Switch, Text, XStack, YStack, Sheet, Button } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { TRAINING_LOGOS } from '@/constants/assets';

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
    p="$4"
    alignItems="center"
    gap="$4"
    bg="$background" // Fond neutre
    pressStyle={{ bg: '$backgroundHover' }}
    animation="quick"
    onPress={isSwitch ? undefined : onPress}
  >
    <YStack p="$2" bg={iconBg} borderRadius={10}>
      <Icon size={20} color={iconColor} />
    </YStack>

    <YStack flex={1}>
      <Text fontSize={16} fontWeight="600" color="$color">{title}</Text>
      {subtitle && <Text fontSize={12} color="$color" opacity={0.6}>{subtitle}</Text>}
    </YStack>

    {isSwitch ? (
      <Switch
        size="$4"
        checked={switchValue}
        onCheckedChange={onSwitchChange}
        bg={switchValue ? (iconColor.startsWith('$') ? '$primary' : iconColor) : '#d1d5db'}
      >
        <Switch.Thumb animation="bouncy" bg="white" />
      </Switch>
    ) : (
      <ChevronRight size={20} color="$borderColor" />
    )}
  </XStack>
);

const SettingsGroup = ({ children }: { children: React.ReactNode }) => (
  <YStack overflow="hidden" borderRadius={20} bg="$background" borderWidth={1} borderColor="$borderColor">
    {children}
  </YStack>
);

export default function SettingsScreen() {
  const { user } = useUser();
  const { theme, toggleTheme, isSystemTheme } = useAppTheme();
  const { trainingType, selectTraining } = useTraining();
  const router = useRouter();
  const [showTrainingSheet, setShowTrainingSheet] = useState(false);

  const isDark = theme === 'dark';

  return (
    <YStack flex={1} bg="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack p="$4" gap="$5" pb="$8">

            {/* Header */}
            <YStack mt="$2" gap="$4">
              <H1 fontFamily="$heading" size="$8" color="$color">Paramètres</H1>
              
              {/* Profile Card avec Gradient */}
              <YStack 
                borderRadius={24} 
                overflow="hidden" 
                elevation="$4"
                shadowColor="$shadowColor"
                shadowRadius={10}
              >
                <LinearGradient
                  colors={['#4f46e5', '#818cf8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 20 }}
                >
                  <XStack gap="$4" alignItems="center">
                    <Avatar circular size="$8" borderWidth={2} borderColor="white">
                      <Avatar.Image src={user?.imageUrl} />
                      <Avatar.Fallback bg="$blue8" />
                    </Avatar>
                    <YStack flex={1}>
                      <H2 fontFamily="$heading" size="$6" color="white">
                        {user?.fullName || 'Utilisateur'}
                      </H2>
                      <Text fontSize={14} color="rgba(255,255,255,0.8)" numberOfLines={1}>
                        {user?.primaryEmailAddress?.emailAddress}
                      </Text>
                    </YStack>
                  </XStack>
                </LinearGradient>
              </YStack>
            </YStack>


            {/* Training Section */}
            <YStack gap="$2">
              <Text ml="$2" fontSize={13} fontWeight="700" color="$color" opacity={0.5} textTransform="uppercase">Entraînement</Text>
              
              <SettingsGroup>
                <MenuItem
                  icon={Dumbbell}
                  iconColor="$orange10"
                  iconBg="$orange4"
                  title="Défi actuel"
                  subtitle={trainingType === 'pushup' ? 'Pompes' : trainingType === 'crunch' ? 'Crunch' : 'Non sélectionné'}
                  onPress={() => setShowTrainingSheet(true)}
                />
              </SettingsGroup>
            </YStack>

            {/* General Section */}
            <YStack gap="$2">
              <Text ml="$2" fontSize={13} fontWeight="700" color="$color" opacity={0.5} textTransform="uppercase">Apparence</Text>
              
              <SettingsGroup>
                <MenuItem
                  icon={isDark ? Moon : Sun}
                  iconColor={isDark ? '$purple10' : '$yellow10'}
                  iconBg={isDark ? '$purple4' : '$yellow4'}
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

            {/* Support Section (Ajouté pour compléter la page) */}
            <YStack gap="$2">
              <Text ml="$2" fontSize={13} fontWeight="700" color="$color" opacity={0.5} textTransform="uppercase">
                Support
              </Text>
              <SettingsGroup>
                <MenuItem 
                  icon={HelpCircle} 
                  iconColor="$green10"
                  iconBg="$green4"
                  title="Aide & FAQ" 
                />
                <Separator borderColor="$borderColor" />
                <MenuItem 
                  icon={Shield} 
                  iconColor="$blue10"
                  iconBg="$blue4"
                  title="Confidentialité" 
                />
              </SettingsGroup>
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

        {/* Sheet pour changer de défi */}
        <Sheet
          modal
          open={showTrainingSheet}
          onOpenChange={setShowTrainingSheet}
          snapPoints={[40]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          <Sheet.Frame bg="$background" padding="$4" borderTopLeftRadius={20} borderTopRightRadius={20}>
            <YStack gap="$4" pb="$4">
              <YStack alignItems="center" gap="$2">
                <YStack width={40} height={4} bg="$borderColor" borderRadius={10} />
                <H2 size="$6" color="$color" mt="$2">Changer de défi</H2>
                <Text fontSize={14} color="$color" opacity={0.6} textAlign="center">
                  Sélectionnez un nouveau défi. Vos progrès seront sauvegardés séparément.
                </Text>
              </YStack>

              <YStack gap="$3">
                <Button
                  size="$5"
                  bg={trainingType === 'pushup' ? '$primary' : '$backgroundHover'}
                  borderWidth={trainingType === 'pushup' ? 0 : 1}
                  borderColor="$borderColor"
                  pressStyle={{ opacity: 0.8 }}
                  onPress={() => {
                    selectTraining('pushup');
                    setShowTrainingSheet(false);
                    router.replace('/(tabs)');
                  }}
                >
                  <XStack gap="$3" alignItems="center">
                    <Image 
                      source={TRAINING_LOGOS.pushup}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                    <Text fontSize={16} fontWeight="600" color={trainingType === 'pushup' ? 'white' : '$color'}>
                      Pompes
                    </Text>
                  </XStack>
                </Button>

                <Button
                  size="$5"
                  bg={trainingType === 'crunch' ? '$primary' : '$backgroundHover'}
                  borderWidth={trainingType === 'crunch' ? 0 : 1}
                  borderColor="$borderColor"
                  pressStyle={{ opacity: 0.8 }}
                  onPress={() => {
                    selectTraining('crunch');
                    setShowTrainingSheet(false);
                    router.replace('/(tabs)');
                  }}
                >
                  <XStack gap="$3" alignItems="center">
                    <Image 
                      source={TRAINING_LOGOS.crunch}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                    <Text fontSize={16} fontWeight="600" color={trainingType === 'crunch' ? 'white' : '$color'}>
                      Crunch
                    </Text>
                  </XStack>
                </Button>
              </YStack>

              <Button
                size="$4"
                variant="outlined"
                borderColor="$borderColor"
                color="$color"
                onPress={() => setShowTrainingSheet(false)}
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