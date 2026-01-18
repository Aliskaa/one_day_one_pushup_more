import Logo from "@/components/Logo";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  H1,
  Paragraph,
  ScrollView,
  YStack
} from "tamagui";

export default function Page() {
  return (
    <YStack flex={1} bg="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <YStack
            p="$4"
            gap="$6"
            maxWidth={600}
            width="100%"
            alignSelf="center"
          >
            {/* 1. HEADER & LOGO */}
            <YStack alignItems="center" gap="$2" mt="$4">
              <Logo hasText={true} />

              <YStack alignItems="center" mt="$4">
                <H1 fontFamily="$heading" size="$8" color="$primary" textAlign="center">
                  Bienvenue
                </H1>
                <Paragraph
                  color="$color"
                  opacity={0.6}
                  textAlign="center"
                  fontSize={16}
                >
                  Connecte-toi pour continuer
                </Paragraph>
              </YStack>
            </YStack>

            {/* 2. MAIN LOGIN CARD */}
            <SignInWithGoogle />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
