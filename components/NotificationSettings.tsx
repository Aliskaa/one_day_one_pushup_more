import React, { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { YStack, XStack, Text, Switch, Separator, Button, Input, AnimatePresence } from 'tamagui';
import { Bell, Clock, Flame, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const [hours, minutes] = value.split(':');
  const [localHours, setLocalHours] = useState(hours);
  const [localMinutes, setLocalMinutes] = useState(minutes);

  const getFormattedTime = (h: string, m: string) => {
    const hNum = parseInt(h || '0', 10);
    const mNum = parseInt(m || '0', 10);
    return `${hNum.toString().padStart(2, '0')}:${mNum.toString().padStart(2, '0')}`;
  };

  const handleHoursChange = (text: string) => {
    if (text === '') {
      setLocalHours('');
      return;
    }
    if (!/^\d+$/.test(text)) return;
    const num = parseInt(text, 10);
    if (num > 23) return;

    setLocalHours(text);
    onChange(getFormattedTime(text, localMinutes));
  };

  const handleMinutesChange = (text: string) => {
    if (text === '') {
      setLocalMinutes('');
      return;
    }
    if (!/^\d+$/.test(text)) return;
    const num = parseInt(text, 10);
    if (num > 59) return;

    setLocalMinutes(text);
    onChange(getFormattedTime(localHours, text));
  };

  const handleBlur = () => {
    const formatted = getFormattedTime(localHours, localMinutes);
    const [h, m] = formatted.split(':');
    setLocalHours(h);
    setLocalMinutes(m);
    onChange(formatted);
  };

  return (
    <XStack gap="$2" alignItems="center">
      <Input
        size="$5"
        width={70}
        height={60}
        textAlign="center"
        keyboardType="numeric"
        value={localHours}
        onChangeText={handleHoursChange}
        onBlur={handleBlur}
        maxLength={2}
        fontSize={24}
        fontWeight="bold"
        bg="$backgroundHover"
        borderRadius={12}
        borderWidth={0}
      />
      <Text fontSize={24} fontWeight="bold" color="$color" opacity={0.5}>:</Text>
      <Input
        size="$5"
        width={70}
        height={60}
        textAlign="center"
        keyboardType="numeric"
        value={localMinutes}
        onChangeText={handleMinutesChange}
        onBlur={handleBlur}
        maxLength={2}
        fontSize={24}
        fontWeight="bold"
        bg="$backgroundHover"
        borderRadius={12}
        borderWidth={0}
      />
    </XStack>
  );
};

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = usePushNotifications();
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <YStack gap="$3">
      <Text ml="$2" fontSize={13} fontWeight="700" color="$color" opacity={0.5} textTransform="uppercase">
        Notifications
      </Text>
      
      <YStack overflow="hidden" borderRadius={20} bg="$background" borderWidth={1} borderColor="$borderColor">
        {/* Activer/Désactiver */}
        <XStack p="$4" alignItems="center" gap="$4" pressStyle={{ bg: '$backgroundHover' }}>
          <YStack p="$2" bg={settings.enabled ? '#dbeafe' : '$backgroundHover'} borderRadius={10}>
            <Bell size={20} color={settings.enabled ? '#3b82f6' : '#9ca3af'} />
          </YStack>
          
          <YStack flex={1}>
            <Text fontSize={16} fontWeight="600" color="$color">Notifications Push</Text>
            <Text fontSize={12} color="$color" opacity={0.6}>Rappels et encouragements</Text>
          </YStack>

          <Switch
            size="$4"
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
            bg={settings.enabled ? '#3b82f6' : '#d1d5db'}
          >
            <Switch.Thumb animation="bouncy" bg="white" />
          </Switch>
        </XStack>

        {/* Paramètres détaillés */}
        {settings.enabled && (
          <YStack animation="medium" enterStyle={{ opacity: 0, y: -10 }} exitStyle={{ opacity: 0, y: -10 }}>
            <Separator borderColor="$borderColor" />
            
            {/* Heure du rappel quotidien */}
            <YStack>
              <XStack 
                p="$4" 
                alignItems="center" 
                gap="$4" 
                onPress={() => setShowTimePicker(!showTimePicker)}
                pressStyle={{ bg: '$backgroundHover' }}
              >
                <YStack p="$2" bg="#fed7aa" borderRadius={10}>
                  <Clock size={20} color="#ea580c" />
                </YStack>
                
                <YStack flex={1}>
                  <Text fontSize={16} fontWeight="600" color="$color">Heure du rappel</Text>
                  <Text fontSize={12} color="$color" opacity={0.6}>Quotidien à {settings.dailyReminderTime}</Text>
                </YStack>

                <XStack bg="$backgroundHover" px="$2" py="$1" borderRadius={8} alignItems="center" gap="$1">
                  <Text fontSize={14} fontWeight="700" color="$color">{settings.dailyReminderTime}</Text>
                  {showTimePicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </XStack>
              </XStack>

              {/* Zone Time Picker Expandable */}
              {showTimePicker && (
                <YStack 
                  bg="$backgroundHover" 
                  p="$4" 
                  alignItems="center" 
                  gap="$3"
                  animation="quick"
                  enterStyle={{ opacity: 0, scale: 0.95 }}
                >
                  <Text fontSize={14} fontWeight="600" color="$color" opacity={0.7}>
                    Définir l'heure
                  </Text>
                  <TimePicker
                    value={settings.dailyReminderTime}
                    onChange={(time) => updateSettings({ dailyReminderTime: time })}
                  />
                  <Button
                    size="$3"
                    mt="$2"
                    onPress={() => setShowTimePicker(false)}
                    bg="$primary"
                    color="white"
                    width={120}
                  >
                    Valider
                  </Button>
                </YStack>
              )}
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* Rappel de streak */}
            <XStack p="$4" alignItems="center" gap="$4" pressStyle={{ bg: '$backgroundHover' }}>
              <YStack p="$2" bg="#fecaca" borderRadius={10}>
                <Flame size={20} color="#dc2626" />
              </YStack>
              
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="600" color="$color">Alerte Série</Text>
                <Text fontSize={12} color="$color" opacity={0.6}>Notification si risque de perte</Text>
              </YStack>

              <Switch
                size="$4"
                checked={settings.streakReminder}
                onCheckedChange={(streakReminder) => updateSettings({ streakReminder })}
                bg={settings.streakReminder ? '#dc2626' : '#d1d5db'}
              >
                <Switch.Thumb animation="bouncy" bg="white" />
              </Switch>
            </XStack>
          </YStack>
        )}
      </YStack>
    </YStack>
  );
};
