import React from 'react';
import { Button, XStack, Switch, Label } from 'tamagui';
import { Moon, Sun } from '@tamagui/lucide-icons';
import { useAppTheme } from '@/contexts/ThemeContext';

// Version 1 : Un bouton icône (parfait pour le Header ou Dashboard)
export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      size="$4"
      circular
      chromeless // Enlève le fond par défaut pour un look épuré
      onPress={toggleTheme}
      animation="bouncy"
      pressStyle={{ scale: 0.9, rotate: '15deg' }}
      icon={
        isDark 
          ? <Moon color="$blue9Dark" size={24} /> 
          : <Sun color="$orange9Light" size={24} />
      }
    />
  );
};

// Version 2 : Un Switch avec Label (parfait pour ta page Settings)
export const ThemeToggleSwitch = () => {
  const { theme, toggleTheme } = useAppTheme();
  const isDark = theme === 'dark';

  return (
    <XStack alignItems="center" gap="$4">
      <Label htmlFor="theme-switch" col="$color" fontSize={16} fontWeight="600">
        Mode {isDark ? 'Sombre' : 'Clair'}
      </Label>
      <Switch
        id="theme-switch"
        size="$4"
        checked={isDark}
        onCheckedChange={toggleTheme}
      >
        <Switch.Thumb animation="bouncy" bg={isDark ? '$purple9Dark' : '$yellow9Light'} />
      </Switch>
    </XStack>
  );
};