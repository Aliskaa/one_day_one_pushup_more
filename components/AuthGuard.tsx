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

    const isOnAuth = segments[0] === '(auth)';
    const isOnIndex = !segments[0] || segments.join('/') === '';

    // Pas connecté : rediriger vers sign-in sauf si déjà sur auth
    if (!isSignedIn && !isOnAuth && !isOnIndex) {
      router.replace('/(auth)/login');
      return;
    }

    // Connecté sur sign-in : rediriger vers index qui gère le reste
    if (isSignedIn && isOnAuth) {
      router.replace('/');
      return;
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