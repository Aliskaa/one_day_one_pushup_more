import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Spinner, YStack } from 'tamagui';
import { useTraining } from '@/contexts/TrainingContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { trainingType } = useTraining();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const isOnSignIn = segments[0] === '(auth)';
    const isOnIndex = !segments[0] || segments.join('/') === '';
    const isOnTabs = segments[0] === '(main)' && segments[1] === '(tabs)';

    // Pas connecté : rediriger vers sign-in
    if (!isSignedIn && !isOnSignIn) {
      router.replace('/(auth)/login');
      return;
    }

    // Connecté sur sign-in : rediriger vers index
    if (isSignedIn && isOnSignIn) {
      router.replace('/');
      return;
    }

    // Connecté mais pas de training sélectionné : rester/aller sur index
    if (isSignedIn && !trainingType && isOnTabs) {
      router.replace('/');
      return;
    }

    // Connecté avec training sélectionné sur index : aller aux tabs
    if (isSignedIn && trainingType && isOnIndex) {
      router.replace('/(main)/(tabs)/home');
      return;
    }
  }, [isSignedIn, isLoaded, trainingType, segments, router]);

  if (!isLoaded) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="$background">
        <Spinner size="large" />
      </YStack>
    );
  }

  return <>{children}</>;
}