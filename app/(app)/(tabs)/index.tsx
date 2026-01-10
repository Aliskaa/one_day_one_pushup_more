import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { 
  YStack, 
  XStack, 
  Text, 
  H1, 
  H2,
  Card, 
  ScrollView, 
  Button, 
  Spinner,
  useTheme,
  Progress
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar, 
  Target,
  Flame
} from '@tamagui/lucide-icons';

import { useProgressData } from '@/hooks/useProgressData';
import { TOTAL_TARGET_YEAR } from '@/constants/constants';

export default function DashboardScreen() {
  const { todayIndex, updateDay, stats, isLoading, error } = useProgressData();
  const [localInputValue, setLocalInputValue] = useState('');
  const theme = useTheme(); // Pour accéder aux couleurs hexadécimales si besoin

  useEffect(() => {
    setLocalInputValue(stats.todayDone?.toString() || '');
  }, [stats.todayDone]);

  const handleQuickAdd = (amount: number) => {
    const current = parseInt(localInputValue || '0', 10);
    const newVal = Math.max(0, current + amount);
    setLocalInputValue(newVal.toString());
    if (todayIndex !== -1) updateDay(todayIndex, newVal.toString());
  };

  const handleChangeText = (text: string) => {
    setLocalInputValue(text);
    if (todayIndex !== -1) updateDay(todayIndex, text);
  };

  // Utiliser stats.totalDone au lieu de recalculer
  const progressPercent = Math.min(100, Math.max(0, (stats.totalDone / TOTAL_TARGET_YEAR) * 100));
  const isAhead = stats.ecart >= 0;
  const dayProgress = stats.todayTarget > 0 
    ? Math.min(100, ((stats.todayDone || 0) / stats.todayTarget) * 100) 
    : 0;

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="$background" p="$4">
        <Text color="$danger" fontSize={18} fontWeight="700">❌ {error}</Text>
      </YStack>
    );
  }

  return (
    <ScrollView bg="$backgroundHover" showsVerticalScrollIndicator={false}>
      <YStack p="$4" gap="$4" pb="$8">
        
        {/* 1. HEADER */}
        <YStack gap="$1" mb="$2">
          <Text fontSize={14} color="$color" opacity={0.6} fontWeight="600" textTransform="uppercase" letterSpacing={1}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <H1 fontFamily="$heading" size="$6" color="$color">
            Défi PushUp 2026 💪
          </H1>
        </YStack>

        {/* 2. HERO CARD */}
        <Card 
          elevate 
          size="$4" 
          p="$0" 
          overflow="hidden" 
          borderRadius={24}
          animation="bouncy"
          hoverStyle={{ scale: 0.98 }}
          pressStyle={{ scale: 0.97 }}
        >
          {/* Utilisation des couleurs de ton thème défini dans config */}
          <LinearGradient
            colors={['#4f46e5', '#6366f1']} // Correspond à brandDark -> brandLight
            style={{ padding: 24 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="rgba(255,255,255,0.8)" fontSize={12} fontWeight="700" letterSpacing={1.5}>
                  OBJECTIF DU JOUR
                </Text>
                <Activity size={24} color="#fff" />
              </XStack>
              
              <YStack alignItems="center" py="$2">
                <H1 fontFamily="$heading" fontSize={72} lineHeight={72} color="#fff">
                  {stats.todayTarget}
                </H1>
                <Text color="rgba(255,255,255,0.8)" fontSize={16} fontWeight="600" letterSpacing={2}>
                  POMPES
                </Text>
              </YStack>

              <YStack gap="$2">
                <Text color="rgba(255,255,255,0.9)" fontSize={13} fontWeight="700">
                  Fait : {stats.todayDone || 0} / {stats.todayTarget}
                </Text>
                <YStack height={8} bg="rgba(0,0,0,0.2)" borderRadius={10} overflow="hidden">
                  <YStack
                    height="100%"
                    width={`${dayProgress}%`}
                    bg={dayProgress >= 100 ? '$success' : '#fff'}
                    borderRadius={10}
                  />
                </YStack>
              </YStack>
            </YStack>
          </LinearGradient>
        </Card>

        {/* 3. INPUT ZONE */}
        <Card elevate p="$4" borderRadius={24} bg="$background" animation="lazy">
          <YStack gap="$4">
            <H2 fontFamily="$heading" size="$4" color="$color">
              ✍️ Saisir ma performance
            </H2>
            
            <XStack gap="$3" alignItems="center">
              <TextInput
                style={{
                  flex: 1,
                  height: 60,
                  backgroundColor: theme.backgroundHover.val, // Utilise la couleur du thème
                  borderRadius: 16,
                  fontSize: 28,
                  fontFamily: 'InterBold', // Utilise la police configurée
                  textAlign: 'center',
                  color: theme.color.val,
                  borderWidth: 1,
                  borderColor: theme.borderColor.val,
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.color.val + '50'}
                value={localInputValue}
                onChangeText={handleChangeText}
              />
              
              <XStack gap="$2">
                {[1, 5, 10].map((amount) => (
                  <Button
                    key={amount}
                    size="$4"
                    bg="$brandSoft"
                    color="$brandDark"
                    borderRadius={14}
                    onPress={() => handleQuickAdd(amount)}
                    animation="quick"
                    pressStyle={{ scale: 0.9, bg: '$brandLight'}}
                  >
                    <Text fontFamily="$heading" fontWeight="700">+{amount}</Text>
                  </Button>
                ))}
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* 4. STATS GRID */}
        <XStack gap="$3">
          <Card 
            elevate flex={1} p="$4" borderRadius={20} bg="$background"
            borderTopWidth={4} borderTopColor={isAhead ? '$success' : '$danger'}
            animation="bouncy"
          >
            <YStack gap="$2" alignItems="center">
               {isAhead ? <TrendingUp size={24} color="$success" /> : <TrendingDown size={24} color="$danger" />}
              <Text fontSize={11} fontWeight="800" color={isAhead ? '$success' : '$danger'} textTransform="uppercase">
                {isAhead ? 'En Banque' : 'Dette'}
              </Text>
              <H2 fontFamily="$heading" size="$5">
                {stats.ecart > 0 ? '+' : ''}{stats.ecart}
              </H2>
            </YStack>
          </Card>

          <Card 
            elevate flex={1} p="$4" borderRadius={20} bg="$background"
            borderTopWidth={4} borderTopColor="$primary"
            animation="bouncy"
          >
            <YStack gap="$2" alignItems="center">
              <BarChart3 size={24} color="$primary" />
              <Text fontSize={11} fontWeight="800" color="$primary" textTransform="uppercase">
                Total 2026
              </Text>
              <H2 fontFamily="$heading" size="$5">
                {stats.totalDone}
              </H2>
            </YStack>
          </Card>
        </XStack>

        <XStack gap="$3">
          <Card elevate flex={1} p="$4" borderRadius={20} bg="$background" animation="bouncy" animationDelay={100}>
            <YStack gap="$2">
              <XStack alignItems="center" gap="$2">
                <Calendar size={16} color="$warning" />
                <Text fontSize={12} fontWeight="600" color="$color" opacity={0.7}>Semaine</Text>
              </XStack>
              <Text fontFamily="$heading" fontSize={20}>
                {stats.daysCompleted} <Text fontSize={14} fontWeight="400" color="$color" opacity={0.6}>jours</Text>
              </Text>
              <Progress value={(stats.daysCompleted / 7) * 100} size="$1" bg="$backgroundHover">
                <Progress.Indicator animation="bouncy" bg="$warning" />
              </Progress>
            </YStack>
          </Card>

          <Card elevate flex={1} p="$4" borderRadius={20} bg="$background" animation="bouncy" animationDelay={200}>
             <YStack gap="$2">
              <XStack alignItems="center" gap="$2">
                <Flame size={16} color="$danger" />
                <Text fontSize={12} fontWeight="600" color="$color" opacity={0.7}>Série</Text>
              </XStack>
              <Text fontFamily="$heading" fontSize={20}>
                 {stats.daysCompleted} <Text fontSize={14} fontWeight="400" color="$color" opacity={0.6}>/ {todayIndex + 1}</Text>
              </Text>
              <Progress value={(stats.daysCompleted / (todayIndex + 1)) * 100} size="$1" bg="$backgroundHover">
                <Progress.Indicator animation="bouncy" bg="$danger" />
              </Progress>
            </YStack>
          </Card>
        </XStack>

        {/* 5. JAUGE ANNUELLE */}
        <Card elevate p="$5" borderRadius={24} bg="$background" animation="lazy">
          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <H2 fontFamily="$heading" size="$4">Progression Annuelle</H2>
              <Target size={22} color="$primary" />
            </XStack>
            
            <H1 fontFamily="$heading" size="$7" color="$primary">
              {stats.percent}%
            </H1>
            
            <YStack height={14} bg="$brandSoft" borderRadius={100} overflow="hidden">
              <YStack 
                height="100%" 
                width={`${progressPercent}%`}
                bg="$primary"
                borderRadius={100}
              />
            </YStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize={12} color="$color" opacity={0.6}>
                {stats.totalDone.toLocaleString()} faites
              </Text>
              <Text fontSize={12} color="$color" opacity={0.6}>
                {(TOTAL_TARGET_YEAR - stats.totalDone).toLocaleString()} restantes
              </Text>
            </XStack>
          </YStack>
        </Card>

      </YStack>
    </ScrollView>
  );
}