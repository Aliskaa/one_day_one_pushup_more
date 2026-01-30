import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { YStack, XStack, H1, H2, Text, Button } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton, SecondaryButton } from '@/components/ui/Button';
import { Target, TrendingUp, Trophy, Flame, ArrowRight, Check } from '@tamagui/lucide-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    title: 'Un Jour, Une Pompe de Plus',
    subtitle: 'Progressez chaque jour avec une méthode simple et efficace',
    icon: <Target size={80} color="#3b82f6" />,
    gradient: ['#3b82f6', '#2563eb'] as const,
  },
  {
    title: 'Progression Progressive',
    subtitle: 'Chaque jour, ajoutez simplement une répétition de plus qu\'hier',
    icon: <TrendingUp size={80} color="#10b981" />,
    gradient: ['#10b981', '#059669'] as const,
  },
  {
    title: 'Gamification & Motivation',
    subtitle: 'Débloquez des achievements, maintenez votre streak et célébrez vos victoires',
    icon: <Trophy size={80} color="#f59e0b" />,
    gradient: ['#f59e0b', '#d97706'] as const,
  },
  {
    title: 'Suivi Complet',
    subtitle: 'Visualisez votre progression, analysez vos stats et gardez le cap sur votre objectif annuel',
    icon: <Flame size={80} color="#ef4444" />,
    gradient: ['#ef4444', '#dc2626'] as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
  const step = ONBOARDING_STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = async () => {
    await handleFinish();
  };

  const handleFinish = async () => {
    // Marquer l'onboarding comme complété
    await AsyncStorage.setItem('onboarding_completed', 'true');
    // Rediriger vers la sélection du type d'entraînement
    router.replace('/');
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <YStack flex={1} padding="$6" justifyContent="space-between">
          
          {/* HEADER - Skip Button */}
          <XStack justifyContent="flex-end" paddingBottom="$4">
            {!isLastStep && (
              <Button
                unstyled
                onPress={handleSkip}
                paddingHorizontal="$4"
                paddingVertical="$2"
              >
                <Text fontSize={16} color="$colorMuted" fontWeight="600">
                  Passer
                </Text>
              </Button>
            )}
          </XStack>

          {/* CONTENT */}
          <YStack flex={1} justifyContent="center" alignItems="center" gap="$6">
            {/* Icon with gradient background */}
            <YStack
              width={160}
              height={160}
              borderRadius={80}
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <LinearGradient
                colors={step.gradient}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {step.icon}
              </LinearGradient>
            </YStack>

            {/* Title & Subtitle */}
            <YStack gap="$3" alignItems="center" paddingHorizontal="$4" maxWidth={600}>
              <H1
                textAlign="center"
                fontSize={32}
                fontWeight="800"
                color="$color"
                lineHeight={40}
              >
                {step.title}
              </H1>
              <Text
                textAlign="center"
                fontSize={18}
                color="$colorMuted"
                lineHeight={28}
                paddingHorizontal="$2"
              >
                {step.subtitle}
              </Text>
            </YStack>
          </YStack>

          {/* FOOTER */}
          <YStack gap="$4" paddingTop="$4">
            {/* Progress Indicators */}
            <XStack justifyContent="center" gap="$2" paddingVertical="$4">
              {ONBOARDING_STEPS.map((_, index) => (
                <YStack
                  key={index}
                  width={currentStep === index ? 40 : 10}
                  height={10}
                  borderRadius={5}
                  backgroundColor={currentStep === index ? '$primary' : '$borderColor'}
                  animation="quick"
                />
              ))}
            </XStack>

            {/* Navigation Buttons */}
            <XStack gap="$3" justifyContent="space-between">
              {/* Back Button - Only show if not on first step */}
              <YStack flex={1}>
                {currentStep > 0 ? (
                  <SecondaryButton onPress={handleBack} fullWidth>
                    Retour
                  </SecondaryButton>
                ) : (
                  <YStack flex={1} /> // Spacer
                )}
              </YStack>

              {/* Next/Finish Button */}
              <YStack flex={1}>
                <PrimaryButton onPress={handleNext} fullWidth>
                  <XStack alignItems="center" gap="$2">
                    <Text color="white" fontSize={16} fontWeight="700">
                      {isLastStep ? 'Commencer' : 'Suivant'}
                    </Text>
                    {isLastStep ? <Check size={20} color="white" /> : <ArrowRight size={20} color="white" />}
                  </XStack>
                </PrimaryButton>
              </YStack>
            </XStack>
          </YStack>

        </YStack>
      </SafeAreaView>
    </YStack>
  );
}
