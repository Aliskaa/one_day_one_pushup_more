import '../tamagui-web.css';

import { AuthGuard } from '@/components/AuthGuard';
import { ModalProvider } from '@/contexts/ModalContext';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, YStack } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { tokenCache } from '../utils/cache';

function AppContent() {
  const { theme, isLoading } = useAppTheme();

  // Attendre le chargement du thème sauvegardé avant d'afficher l'app
  if (isLoading) {
    return null;
  }

  return (
    // On force le thème Tamagui ici avec animation fluide
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <YStack flex={1} animation="medium">
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </YStack>
    </TamaguiProvider>
  );
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
          <ModalProvider>
            <ThemeProvider>
              <AuthGuard>
                <AppContent />
              </AuthGuard>
            </ThemeProvider>
          </ModalProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
