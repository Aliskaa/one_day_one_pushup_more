import { CurrentToast } from '@/components/CurrentToast';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { tokenCache } from '@/services/cache';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ModalProvider } from '@/contexts/ModalContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TrainingProvider } from '@/contexts/TrainingContext';
import { AuthGuard } from '@/components/AuthGuard';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <TamaguiProvider config={tamaguiConfig}>
          <ToastProvider swipeDirection="horizontal" duration={6000} native>
            <SafeAreaProvider>
              <ModalProvider>
                <ThemeProvider>
                  <TrainingProvider>
                    <AuthGuard>
                      {children}
                    </AuthGuard>
                  </TrainingProvider>
                </ThemeProvider>
              </ModalProvider>
            </SafeAreaProvider>
          </ToastProvider>
        </TamaguiProvider>
      </ClerkLoaded>
    </ClerkProvider >
  )
}
