import React, { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { YStack, XStack, Text, Switch, Card, Separator, Button, Input } from 'tamagui';
import { Bell, Clock, Flame } from '@tamagui/lucide-icons';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [hours, minutes] = value.split(':');
  const [localHours, setLocalHours] = useState(hours);
  const [localMinutes, setLocalMinutes] = useState(minutes);

  const handleHoursChange = (text: string) => {
    const num = parseInt(text) || 0;
    const clamped = Math.min(23, Math.max(0, num));
    const formatted = clamped.toString().padStart(2, '0');
    setLocalHours(formatted);
    onChange(`${formatted}:${localMinutes}`);
  };

  const handleMinutesChange = (text: string) => {
    const num = parseInt(text) || 0;
    const clamped = Math.min(59, Math.max(0, num));
    const formatted = clamped.toString().padStart(2, '0');
    setLocalMinutes(formatted);
    onChange(`${localHours}:${formatted}`);
  };

  return (
    <XStack gap="$2" alignItems="center">
      <Input
        size="$4"
        width={60}
        textAlign="center"
        keyboardType="numeric"
        value={localHours}
        onChangeText={handleHoursChange}
        maxLength={2}
      />
      <Text fontSize={20} fontWeight="bold">:</Text>
      <Input
        size="$4"
        width={60}
        textAlign="center"
        keyboardType="numeric"
        value={localMinutes}
        onChangeText={handleMinutesChange}
        maxLength={2}
      />
    </XStack>
  );
};

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = usePushNotifications();
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <YStack gap="$3">
      {/* Activer/Désactiver les notifications */}
      <Card p="$4" bg="$background" borderRadius={16}>
        <XStack alignItems="center" gap="$3">
          <YStack p="$2" bg="$backgroundHover" borderRadius={10}>
            <Bell size={20} color={settings.enabled ? '$primary' : '$borderColor'} />
          </YStack>
          
          <YStack flex={1}>
            <Text fontSize={16} fontWeight="600" color="$color">
              Notifications push
            </Text>
            <Text fontSize={12} color="$color" opacity={0.6}>
              Recevez des rappels quotidiens
            </Text>
          </YStack>

          <Switch
            size="$3"
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          >
            <Switch.Thumb animation="bouncy" bg={settings.enabled ? '$primary' : '$borderColor'} />
          </Switch>
        </XStack>
      </Card>

      {/* Paramètres détaillés (visibles uniquement si activé) */}
      {settings.enabled && (
        <Card p="$4" bg="$background" borderRadius={16}>
          <YStack gap="$4">
            {/* Heure du rappel quotidien */}
            <XStack alignItems="center" gap="$3">
              <YStack p="$2" bg="$backgroundHover" borderRadius={10}>
                <Clock size={20} color="$primary" />
              </YStack>
              
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color="$color">
                  Rappel quotidien
                </Text>
                <Text fontSize={12} color="$color" opacity={0.6}>
                  {settings.dailyReminderTime}
                </Text>
              </YStack>

              <Button
                size="$3"
                chromeless
                onPress={() => setShowTimePicker(!showTimePicker)}
              >
                Modifier
              </Button>
            </XStack>

            {/* Time Picker */}
            {showTimePicker && (
              <YStack gap="$2" p="$3" bg="$backgroundHover" borderRadius={12}>
                <Text fontSize={14} fontWeight="600" color="$color">
                  Choisir l'heure
                </Text>
                <TimePicker
                  value={settings.dailyReminderTime}
                  onChange={(time) => {
                    updateSettings({ dailyReminderTime: time });
                  }}
                />
                <Button
                  size="$3"
                  mt="$2"
                  onPress={() => setShowTimePicker(false)}
                  bg="$primary"
                >
                  Valider
                </Button>
              </YStack>
            )}

            <Separator borderColor="$borderColor" />

            {/* Rappel de streak */}
            <XStack alignItems="center" gap="$3">
              <YStack p="$2" bg="$backgroundHover" borderRadius={10}>
                <Flame size={20} color="$warning" />
              </YStack>
              
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color="$color">
                  Rappel de série
                </Text>
                <Text fontSize={12} color="$color" opacity={0.6}>
                  Alerte si risque de perdre votre streak
                </Text>
              </YStack>

              <Switch
                size="$3"
                checked={settings.streakReminder}
                onCheckedChange={(streakReminder) => updateSettings({ streakReminder })}
              >
                <Switch.Thumb animation="bouncy" bg={settings.streakReminder ? '$primary' : '$borderColor'} />
              </Switch>
            </XStack>
          </YStack>
        </Card>
      )}
    </YStack>
  );
};
