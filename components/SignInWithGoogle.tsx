import { useClerk, useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { Button, Text, useTheme } from "tamagui";
// Tu peux importer une icône Google si tu en as une, sinon on reste texte ou icône générique
import { Chrome } from '@tamagui/lucide-icons'; 

export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogle() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const { setActive } = useClerk();
  const theme = useTheme();

  const onPress = useCallback(async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'https',
        path: 'welcomed-spaniel-61.clerk.accounts.dev/v1/oauth_callback',
      });
      
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("Erreur de connexion Google:", err);
    }
  }, [startSSOFlow, setActive]);

  return (
    <Button
      size="$4"
      bg="white"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius={14}
      onPress={onPress}
      icon={<Chrome size={20} color="#EA4335" />} // Couleur rouge Google classique
      animation="bouncy"
      pressStyle={{ bg: '$backgroundHover', scale: 0.98 }}
    >
      <Text fontFamily="$body" fontWeight="600" color="$color">
        Continuer avec Google
      </Text>
    </Button>
  );
}