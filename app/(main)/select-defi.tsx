import { CardButton } from '@/components/CardButton';
import { TrainingName, useTraining } from '@/contexts/TrainingContext';
import SvgCrunch from '@/icons/Crunch';
import SvgPushUp from '@/icons/Pushup';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  H2,
  Paragraph,
  ScrollView,
  YStack,
  Spinner
} from "tamagui";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Index() {
  const router = useRouter();
  const { selectTraining } = useTraining();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      
      if (!onboardingCompleted) {
        // Première ouverture - afficher l'onboarding
        router.replace('/onboarding');
      } else {
        // Onboarding déjà vu - rester sur cette page
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsChecking(false);
    }
  };

  const handleSelectTraining = (trainingType: TrainingName) => {
    selectTraining(trainingType);
    router.push('/(main)/(tabs)/home');
  }

  // Afficher un spinner pendant la vérification
  if (isChecking) {
    return (
      <YStack flex={1} backgroundColor="$background" alignItems="center" justifyContent="center">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="$background">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <YStack
            p="$4"
            gap="$5"
            maxWidth={600}
            width="100%"
            alignSelf="center"
          >
            <YStack gap="$2" mb="$4" alignItems="center">
              <H2 textAlign="center" color="$color">Bienvenue !</H2>
              <Paragraph textAlign="center" color="$color" opacity={0.7}>
                Choisis ton défi
              </Paragraph>
            </YStack>

            <CardButton logo={<SvgPushUp size={75} color='$color'/>} title="Pompes" onClick={() => handleSelectTraining('pushup')} />
            <CardButton logo={<SvgCrunch size={75} color='$color'/>} title="Crunch" onClick={() => handleSelectTraining('crunch')} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  )
}
