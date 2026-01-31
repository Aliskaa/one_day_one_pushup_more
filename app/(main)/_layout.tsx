import { Stack } from 'expo-router';

export default function MainLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 1. LA ZONE AVEC LA BARRE DE NAVIGATION */}
      <Stack.Screen name="(tabs)" />

      {/* 3. L'ÉCRAN DE JEU (Plein écran) */}
      <Stack.Screen name="select-defi" />
      <Stack.Screen name="onboarding" />
    
    </Stack>
  );
}