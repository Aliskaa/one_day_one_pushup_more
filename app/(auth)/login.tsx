import Logo from "@/components/Logo";
import SignInWithGoogle from "@/components/auth/SignInWithGoogle";
import { Card } from "@/components/ui";
import { Flame, Target, Trophy } from "@tamagui/lucide-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  H2,
  Text,
  ScrollView,
  YStack,
  XStack
} from "tamagui";

export default function LoginScreen() {
  return (
    <YStack flex={1} backgroundColor="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <YStack
            padding="$4"
            gap="$5"
            maxWidth={600}
            width="100%"
            alignSelf="center"
          >
            {/* Logo et Header */}
            <YStack alignItems="center" gap="$3" marginTop="$4">
              <Logo hasText={false} />

              <YStack alignItems="center" gap="$2">
                <H2 fontSize={32} fontWeight="800" color="$color" textAlign="center">
                  Bienvenue
                </H2>
                <Text
                  color="$colorMuted"
                  textAlign="center"
                  fontSize={15}
                  lineHeight={22}
                >
                  Connecte-toi pour commencer ton défi
                </Text>
              </YStack>
            </YStack>

            {/* Carte de connexion */}
            <Card 
              backgroundColor="$background" 
              padding="$5"
              borderRadius={24}
              gap="$4"
            >
              <YStack gap="$3" alignItems="center">
                <Text fontSize={16} fontWeight="600" color="$color" textAlign="center">
                  Prêt à te surpasser ?
                </Text>
                <Text fontSize={13} color="$colorMuted" textAlign="center" lineHeight={20}>
                  Rejoins des milliers d'athlètes qui progressent chaque jour
                </Text>
              </YStack>

              <SignInWithGoogle />
            </Card>

            {/* Features */}
            <YStack gap="$3" marginTop="$2">
              <Feature 
                icon={Target}
                color="$blue8"
                title="Objectifs progressifs"
                description="Un défi qui s'adapte à ton niveau"
              />
              <Feature 
                icon={Flame}
                color="$red8"
                title="Séries de motivation"
                description="Garde ta motivation au maximum"
              />
              <Feature 
                icon={Trophy}
                color="$amber8"
                title="Achievements"
                description="Débloque des badges uniques"
              />
            </YStack>

            <Text 
              fontSize={11} 
              color="$colorMuted" 
              textAlign="center" 
              marginTop="$2"
            >
              En continuant, tu acceptes nos conditions d'utilisation
            </Text>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}

interface FeatureProps {
  icon: any;
  color: string;
  title: string;
  description: string;
}

function Feature({ icon: Icon, color, title, description }: FeatureProps) {
  return (
    <XStack gap="$3" alignItems="center">
      <YStack
        width={44}
        height={44}
        backgroundColor="$backgroundHover"
        borderRadius={12}
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={22} color={color} />
      </YStack>
      <YStack flex={1}>
        <Text fontSize={15} fontWeight="600" color="$color">
          {title}
        </Text>
        <Text fontSize={13} color="$colorMuted" lineHeight={18}>
          {description}
        </Text>
      </YStack>
    </XStack>
  );
}
