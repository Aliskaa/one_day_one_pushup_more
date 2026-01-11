import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Spinner, YStack } from 'tamagui';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const isOnSignIn = segments[0] === 'sign-in';

    if (!isSignedIn && !isOnSignIn) {
      router.replace('/sign-in');
    } else if (isSignedIn && isOnSignIn) {
      // Utilise un délai pour laisser les routes se monter
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    }
  }, [isSignedIn, isLoaded, segments, router]);

  if (!isLoaded) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="$background">
        <Spinner size="large" />
      </YStack>
    );
  }

  return <>{children}</>;
}