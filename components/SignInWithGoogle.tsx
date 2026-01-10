import { useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const theme = useTheme();

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({}),
      });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Géré par protected route
              return;
            }
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router, startSSOFlow]);

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