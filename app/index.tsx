import { useEffect, useState } from 'react';
import { View, Spinner } from 'tamagui';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useTraining } from '@/contexts/TrainingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { trainingType } = useTraining();
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        router.replace('/(auth)/login');
        return;
      }

      // Vérifier si l'onboarding est complété
      const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
      
      if (!onboardingCompleted) {
        router.replace('/(main)/onboarding');
        return;
      }

      // Si pas de training sélectionné, aller à la sélection
      if (!trainingType) {
        router.replace('/(main)/select-defi');
        return;
      }

      // Tout est bon, aller à l'app
      router.replace('/(main)/(tabs)/home');
    };

    checkAndRedirect();
  }, [isSignedIn, isLoaded, trainingType]);

  return (
    <View flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
      <Spinner size="large" color="$color" />
    </View>
  );
}