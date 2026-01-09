import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Spinner } from 'tamagui'

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  // Attendre que Clerk soit chargé
  if (!isLoaded) {
    return <Spinner />
  }

  return (
    <Stack>
        <Stack.Protected guard={isSignedIn}>
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
            <Stack.Screen name="sign-in" options={{headerShown: false}} />
        </Stack.Protected>
    </Stack>
  )
}
