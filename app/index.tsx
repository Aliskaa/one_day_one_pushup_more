import { CardButton } from '@/components/CardButton';
import { TrainingName, useTraining } from '@/contexts/TrainingContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  H2,
  Paragraph,
  ScrollView,
  YStack
} from "tamagui";
import { TRAINING_LOGOS } from '@/constants/assets';


export default function Index() {
  const router = useRouter();

  const { selectTraining } = useTraining();

  const handleSelectTraining = (trainingType: TrainingName) => {
    selectTraining(trainingType);
    router.push('/(tabs)');
  }

  return (
    <YStack flex={1} bg="$background">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <YStack
            p="$4"
            gap="$5"
            maxWidth={600}
            width="100%"
            alignSelf="center"
          >
            <YStack gap="$2" mb="$4" alignItems="center">
              <H2 textAlign="center" color="$color">Bienvenue !</H2>
              <Paragraph textAlign="center" color="$color" opacity={0.7}>
                Choisis ton défi
              </Paragraph>
            </YStack>

            <CardButton logo={TRAINING_LOGOS.pushup} title="Pompes" onClick={() => handleSelectTraining('pushup')} />
            <CardButton logo={TRAINING_LOGOS.crunch} title="Crunch" onClick={() => handleSelectTraining('crunch')} />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  )
}
