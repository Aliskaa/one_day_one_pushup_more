import { useSSO } from '@clerk/clerk-expo'
import { Chrome } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback, useEffect } from 'react'
import { Platform } from 'react-native'
import { Button, Text } from "tamagui"
import * as Linking from "expo-linking";
import log from '@/services/logger'

// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== 'android') return
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function Page() {
  useWarmUpBrowser()

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO()

  const onPress = useCallback(async () => {
    try {
      const linkedUrl = Linking.createURL("/(auth)/login", { scheme: "onedayonepushupmore" }); 

      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                redirectUrl: linkedUrl,
            });

            if (createdSessionId) {
                log.debug("🟢 Google Login: Existing User, Session ID:", createdSessionId);
                await setActive!({ session: createdSessionId });
                router.replace('/(main)/(tabs)/home');
            } else if (signUp?.createdSessionId) {
                log.debug("🟢 Google Signup: New User, Session ID:", signUp.createdSessionId);
                await setActive!({ session: signUp.createdSessionId });
                router.replace('/(main)/(tabs)/home');
            } else {
                log.error("🔴 Google Auth: Pas de session créée.");
            }
        } catch (err) {
            log.error("🔴 Erreur Google SSO :", JSON.stringify(err, null, 2));
        }
    }, [startSSOFlow, router]);

  return (
    <Button
      size="$5"
      backgroundColor="$background"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius={16}
      paddingVertical="$4"
      onPress={onPress}
      icon={<Chrome size={22} color="#EA4335" />}
      animation="quick"
      pressStyle={{ backgroundColor: '$backgroundHover', scale: 0.98 }}
      hoverStyle={{ backgroundColor: '$backgroundHover' }}
    >
      <Text fontSize={16} fontWeight="600" color="$color">
        Continuer avec Google
      </Text>
    </Button>
  );
}