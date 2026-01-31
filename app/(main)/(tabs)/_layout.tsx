import { Home, Calendar, Settings, Award, Palette } from '@tamagui/lucide-icons';
import { Colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useAppTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#ffffff' }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[theme].tint,
          tabBarStyle: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderTopColor: isDark ? '#374151' : '#e5e7eb',
          },
          tabBarInactiveTintColor: isDark ? '#9BA1A6' : '#687076',
          headerShown: false,
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="days"
          options={{
            title: 'Calendrier',
            tabBarIcon: ({ color }) => <Calendar size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: 'Réussites',
            tabBarIcon: ({ color }) => <Award size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="design-system"
          options={{
            title: 'Design',
            tabBarIcon: ({ color }) => <Palette size={28} color={color} />,
            href: null, // Masqué en production (commentez pour afficher)
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Paramètres',
            tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}