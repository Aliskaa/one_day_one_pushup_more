import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeName = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeName;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = '@app_theme_preference';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [overrideTheme, setOverrideTheme] = useState<ThemeName | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeTheme = overrideTheme || (systemScheme === 'dark' ? 'dark' : 'light');

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setOverrideTheme(savedTheme);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (theme: ThemeName | null) => {
    try {
      if (theme === null) {
        await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  };

  const toggleTheme = () => {
    setOverrideTheme((prev) => {
      const newTheme = prev === null 
        ? (activeTheme === 'light' ? 'dark' : 'light')
        : (prev === 'light' ? 'dark' : 'light');
      
      saveTheme(newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: activeTheme, 
      toggleTheme,
      isSystemTheme: overrideTheme === null,
      isLoading
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};