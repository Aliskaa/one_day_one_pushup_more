import '../tamagui-web.css';

import { AuthGuard } from '@/components/AuthGuard';
import { CurrentToast } from '@/components/CurrentToast';
import { ModalProvider } from '@/contexts/ModalContext';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider, YStack } from 'tamagui';
import { tamaguiConfig } from '../tamagui.config';
import { tokenCache } from '../services/cache';
import { TrainingProvider } from '@/contexts/TrainingContext';

function AppContent() {
  const { theme, isLoading } = useAppTheme();

  // Attendre le chargement du thème sauvegardé avant d'afficher l'app
  if (isLoading) {
    return null;
  }

  return (
    <YStack flex={1} animation="medium" theme={theme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </YStack>
  );
}

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
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
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <ToastProvider swipeDirection="horizontal" duration={3000} native>
        <SafeAreaProvider>
          <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ClerkLoaded>
              <ModalProvider>
                <ThemeProvider>
                  <TrainingProvider>
                  <AuthGuard>
                    <AppContent />
                  </AuthGuard>
                  </TrainingProvider>
                </ThemeProvider>
              </ModalProvider>
            </ClerkLoaded>
          </ClerkProvider>
        </SafeAreaProvider>
        <CurrentToast />
        <ToastViewport top="$8" left={0} right={0} />
      </ToastProvider>
    </TamaguiProvider>
  );
}
