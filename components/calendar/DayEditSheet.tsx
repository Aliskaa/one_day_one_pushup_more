import { Card, GhostButton, PrimaryButton } from '@/components/ui';
import { TrainingName } from '@/contexts/TrainingContext';
import { DayDataType } from '@/types/day';
import { Check } from '@tamagui/lucide-icons';
import { H3, Input, Sheet, Text, XStack, YStack } from 'tamagui';

interface DayEditSheetProps {
  isOpen: boolean;
  dayData: DayDataType | undefined;
  dateStr: string;
  isEditable: boolean;
  editValue: string;
  trainingType: TrainingName | null;
  onEditChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function DayEditSheet({
  isOpen,
  dayData,
  dateStr,
  isEditable,
  editValue,
  trainingType,
  onEditChange,
  onSave,
  onClose
}: DayEditSheetProps) {
  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => !open && onClose()}
      snapPoints={[45]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <Sheet.Frame backgroundColor="$background" padding="$4" borderTopLeftRadius={20} borderTopRightRadius={20}>
        <YStack gap="$4" paddingBottom="$4">
          {/* Handle */}
          <YStack alignItems="center">
            <YStack width={40} height={4} backgroundColor="$borderColor" borderRadius={10} />
          </YStack>

          {/* Header */}
          <YStack alignItems="center" gap="$2">
            <H3 fontSize={20} fontWeight="700" color="$color">
              Modifier
            </H3>
            <Text fontSize={14} color="$colorMuted" fontFamily="$body">
              {new Date(dateStr).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>
          </YStack>

          {/* Infos */}
          {dayData && (
            <Card backgroundColor="$backgroundHover" padding="$3">
              <XStack justifyContent="space-between">
                <Text fontSize={13} color="$colorMuted" fontFamily="$heading">Objectif</Text>
                <Text fontSize={13} fontWeight="700" color="$color" fontFamily="$body">
                  {dayData.target} {trainingType === 'pushup' ? 'pompes' : 'crunchs'}
                </Text>
              </XStack>
            </Card>
          )}

          {isEditable ? (
            <>
              <YStack gap="$2">
                <Text fontSize={13} fontWeight="600" color="$color" fontFamily="$heading">
                  Nombre réalisé
                </Text>
                <Input
                  size="$5"
                  value={editValue}
                  onChangeText={onEditChange}
                  keyboardType="numeric"
                  placeholder="0"
                  fontSize={18}
                  textAlign="center"
                  backgroundColor="$backgroundHover"
                  borderColor="$borderColor"
                  focusStyle={{ borderColor: '$primary' }}
                />
              </YStack>

              {/* Boutons */}
              <XStack gap="$3">
                <GhostButton flex={1} onPress={onClose}>
                  Annuler
                </GhostButton>
                <PrimaryButton flex={1} onPress={onSave} icon={Check}>
                  Valider
                </PrimaryButton>
              </XStack>
            </>
          ) : (
            <>
              {dayData && (
                <YStack gap="$2">
                  <Text fontSize={13} fontWeight="600" color="$color" fontFamily="$heading">
                    Nombre réalisé
                  </Text>
                  <Card backgroundColor="$backgroundHover" padding="$3" alignItems="center">
                    <Text fontSize={18} color="$color" fontFamily="$body">
                      {dayData.done} {trainingType === 'pushup' ? 'pompes' : 'crunchs'}
                    </Text>
                  </Card>
                </YStack>
              )}
              <YStack padding="$4" alignItems="center" gap="$2">
                <Text color="$colorMuted" textAlign="center">
                  Ce jour est trop ancien pour être modifié.
                </Text>
                <PrimaryButton onPress={onClose}>Fermer</PrimaryButton>
              </YStack>
            </>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
