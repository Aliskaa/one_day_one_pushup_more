import '../tamagui-web.css';

import { ModalProvider } from '@/contexts/ModalContext';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Spinner, TamaguiProvider, YStack } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { tokenCache } from '../utils/cache';

function AuthGuard({ children }: { children: React.ReactNode }) {
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

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  const colorScheme = useColorScheme();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!publishableKey) {
    throw new Error('Missing Publishable Key');
  }

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
            <ModalProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <AuthGuard>
                  <Slot />
                </AuthGuard>
              </ThemeProvider>
            </ModalProvider>
          </TamaguiProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
