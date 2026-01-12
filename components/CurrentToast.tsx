import { Toast, useToastController, useToastState } from '@tamagui/toast'
import { Button, H4, XStack, YStack, isWeb, useTheme } from 'tamagui'
import { AlertCircle } from '@tamagui/lucide-icons'

export function CurrentToast() {
  const currentToast = useToastState()
  const theme = useTheme()

  if (!currentToast) return null

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={isWeb ? '$12' : 0}
      mx="$4"
      elevation={5}
      bg="$background"
      borderWidth={2}
      borderColor="$warning"
      borderRadius="$4"
      animation="quick"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.3}
      shadowRadius={8}
    >
      <XStack gap="$3" p="$3" alignItems="center">
        <YStack
          width={40}
          height={40}
          borderRadius={20}
          bg="$warning"
          alignItems="center"
          justifyContent="center"
        >
          <AlertCircle size={24} color="white" />
        </YStack>
        <YStack flex={1} gap="$1">
          <Toast.Title fontSize={16} fontWeight="bold" color="$color">
            {currentToast.title}
          </Toast.Title>
          {!!currentToast.message && (
            <Toast.Description fontSize={14} color="$color" opacity={0.8}>
              {currentToast.message}
            </Toast.Description>
          )}
        </YStack>
      </XStack>
    </Toast>
  )
}

export function ToastControl() {
  const toast = useToastController()

  return (
    <YStack gap="$2" alignItems="center">
      <H4>Toast demo</H4>
      <XStack gap="$2" justifyContent="center">
        <Button
          onPress={() => {
            toast.show('Successfully saved!', {
              message: "Don't worry, we've got your data.",
            })
          }}
        >
          Show
        </Button>
        <Button
          onPress={() => {
            toast.hide()
          }}
        >
          Hide
        </Button>
      </XStack>
    </YStack>
  )
}
