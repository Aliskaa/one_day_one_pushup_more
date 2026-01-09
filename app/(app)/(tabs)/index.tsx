import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { 
  YStack, 
  XStack, 
  Text, 
  H1, 
  Card, 
  ScrollView, 
  Button, 
  Spinner 
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
  const { days, todayIndex, updateDay, stats, isLoading, error } = useProgressData();
  const [localInputValue, setLocalInputValue] = useState('');

  // Synchroniser l'input local avec les stats
  useEffect(() => {
    setLocalInputValue(stats.todayDone?.toString() || '');
  }, [stats.todayDone]);

  const handleQuickAdd = (amount: number) => {
    const current = parseInt(localInputValue || '0', 10);
    const newVal = Math.max(0, current + amount);
    setLocalInputValue(newVal.toString());
    if (todayIndex !== -1) {
      updateDay(todayIndex, newVal.toString());
    }
  };

  const handleChangeText = (text: string) => {
    setLocalInputValue(text);
    if (todayIndex !== -1) {
      updateDay(todayIndex, text);
    }
  };

  // Calculs
  const totalDone = days.reduce((sum, d) => sum + (d.done || 0), 0);
  const progressPercent = Math.min(100, Math.max(0, (totalDone / TOTAL_TARGET_YEAR) * 100));
  const isAhead = stats.ecart >= 0;
  const dayProgress = stats.todayTarget > 0 
    ? Math.min(100, ((stats.todayDone || 0) / stats.todayTarget) * 100) 
    : 0;

  if (isLoading) {
    return (
      <YStack flex={1} items="center" justify="center" background="$purple2">
        <Spinner size="large" color="$blue9" />
        <Text mt="$4" color="$purple11" fontWeight="600">
          Chargement de tes données...
        </Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} items="center" justify="center" background="$purple2" p="$4">
        <Text color="$red10" fontSize={18} fontWeight="700" verticalAlign="center">
          ❌ {error}
        </Text>
        <Text color="$purple11" mt="$2" verticalAlign="center">
          Vérifie ta connexion internet
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView background="$purple2" showsVerticalScrollIndicator={false}>
      <YStack p="$4" gap="$4" pb="$8">
        
        {/* 1. HEADER */}
        <YStack gap="$1">
          <Text fontSize={16} color="$purple10" fontWeight="600" textTransform="capitalize">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <H1 fontSize={28} fontWeight="900" color="$purple12">
            Défi PushUp 2026 💪
          </H1>
        </YStack>

        {/* 2. HERO CARD - OBJECTIF DU JOUR */}
        <Card elevate size="$4" p="$0" overflow="hidden" borderRadius={25}>
          <LinearGradient
            colors={['#1e3c72', '#2a5298']}
            style={{ padding: 24 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <YStack gap="$3">
              <XStack justify="space-between" items="center">
                <Text color="rgba(255,255,255,0.7)" fontSize={12} fontWeight="700" letterSpacing={1}>
                  OBJECTIF DU JOUR
                </Text>
                <Activity size={24} color="#fff" />
              </XStack>
              
              <YStack items="center" py="$2">
                <Text fontSize={72} fontWeight="900" color="#fff">
                  {stats.todayTarget}
                </Text>
                <Text color="rgba(255,255,255,0.8)" fontSize={16} fontWeight="700" letterSpacing={2}>
                  POMPES
                </Text>
              </YStack>

              {/* Barre de progression du jour */}
              <YStack gap="$2">
                <Text color="rgba(255,255,255,0.9)" fontSize={13} fontWeight="700">
                  Fait : {stats.todayDone || 0} / {stats.todayTarget}
                </Text>
                <YStack height={10} background="rgba(0,0,0,0.3)" rounded={5} overflow="hidden">
                  <YStack
                    height="100%"
                    width={`${dayProgress}%`}
                    background={dayProgress >= 100 ? '#4CAF50' : '#FFC107'}
                    rounded={5}
                  />
                </YStack>
              </YStack>
            </YStack>
          </LinearGradient>
        </Card>

        {/* 3. INPUT ZONE - SAISIE RAPIDE */}
        <Card elevate p="$4" borderRadius={20}>
          <YStack gap="$4">
            <Text fontSize={16} fontWeight="800" color="$purple12">
              ✍️ Saisir ma performance
            </Text>
            
            <XStack gap="$3" items="center">
              <TextInput
                style={{
                  flex: 1,
                  height: 60,
                  backgroundColor: '#fff',
                  borderRadius: 15,
                  fontSize: 28,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#333',
                  borderWidth: 2,
                  borderColor: '#2196F3',
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#ccc"
                value={localInputValue}
                onChangeText={handleChangeText}
              />
              
              <XStack gap="$2">
                {[1, 5, 10].map((amount) => (
                  <Button
                    key={amount}
                    size="$4"
                    background="$purple3"
                    borderWidth={1}
                    borderColor="$purple6"
                    rounded={12}
                    onPress={() => handleQuickAdd(amount)}
                    pressStyle={{ scale: 0.95, background: '$purple4' }}
                  >
                    <Text fontWeight="800" color="$purple11">+{amount}</Text>
                  </Button>
                ))}
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* 4. STATS CARDS GRID */}
        <XStack gap="$3">
          {/* CARTE DETTE / BANQUE */}
          <Card 
            elevate 
            flex={1} 
            p="$4" 
            borderRadius={20}
            borderLeftWidth={4}
            borderLeftColor={isAhead ? '$green9' : '$red9'}
          >
            <YStack gap="$2">
              <XStack items="center" gap="$2">
                {isAhead ? (
                  <TrendingUp size={22} color="#4CAF50" />
                ) : (
                  <TrendingDown size={22} color="#FF5252" />
                )}
                <Text fontSize={11} fontWeight="800" color={isAhead ? '$green10' : '$red10'}>
                  {isAhead ? 'EN BANQUE' : 'DETTE'}
                </Text>
              </XStack>
              <Text fontSize={28} fontWeight="900" color="$purple12">
                {stats.ecart > 0 ? '+' : ''}{stats.ecart}
              </Text>
              <Text fontSize={11} color="$purple10">
                pompes {isAhead ? "d'avance" : "de retard"}
              </Text>
            </YStack>
          </Card>

          {/* CARTE TOTAL */}
          <Card 
            elevate 
            flex={1} 
            p="$4" 
            borderRadius={20}
            borderLeftWidth={4}
            borderLeftColor="$blue9"
          >
            <YStack gap="$2">
              <XStack items="center" gap="$2">
                <BarChart3 size={22} color="#2196F3" />
                <Text fontSize={11} fontWeight="800" color="$blue10">
                  TOTAL 2026
                </Text>
              </XStack>
              <Text fontSize={28} fontWeight="900" color="$purple12">
                {totalDone}
              </Text>
              <Text fontSize={11} color="$purple10">
                sur {TOTAL_TARGET_YEAR.toLocaleString()} prévues
              </Text>
            </YStack>
          </Card>
        </XStack>

        {/* STATS SEMAINE ET SÉRIE */}
        <XStack gap="$3">
          {/* STATS SEMAINE */}
          <Card 
            elevate 
            flex={1} 
            p="$4" 
            borderRadius={20}
            borderLeftWidth={4}
            borderStartColor="$orange9"
          >
            <YStack gap="$2">
              <XStack items="center" gap="$2">
                <Calendar size={18} color="#FF9800" />
                <Text fontSize={11} fontWeight="700" color="$purple11">
                  Cette Semaine
                </Text>
              </XStack>
              <Text fontSize={18} fontWeight="900" color="$purple12">
                {stats.daysCompleted} jours
              </Text>
              <YStack height={6} background="$purple4" rounded={3} overflow="hidden">
                <YStack 
                  height="100%" 
                  width={`${Math.min(100, (stats.daysCompleted / 7) * 100)}%`}
                  background="$orange9"
                  rounded={3}
                />
              </YStack>
            </YStack>
          </Card>

          {/* SÉRIE EN COURS */}
          <Card 
            elevate 
            flex={1} 
            p="$4" 
            rounded={20}
            borderStartWidth={4}
            borderStartColor="$pink9"
          >
            <YStack gap="$2">
              <XStack items="center" gap="$2">
                <Flame size={18} color="#E91E63" />
                <Text fontSize={11} fontWeight="700" color="$purple11">
                  Jours validés
                </Text>
              </XStack>
              <Text fontSize={18} fontWeight="900" color="$purple12">
                {stats.daysCompleted} / {todayIndex + 1}
              </Text>
              <YStack height={6} background="$purple4" rounded={3} overflow="hidden">
                <YStack 
                  height="100%" 
                  width={`${Math.min(100, (stats.daysCompleted / (todayIndex + 1)) * 100)}%`}
                  background="$pink9"
                  rounded={3}
                />
              </YStack>
            </YStack>
          </Card>
        </XStack>

        {/* 5. JAUGE ANNUELLE */}
        <Card elevate p="$5" borderRadius={20}>
          <YStack gap="$3">
            <XStack justify="space-between" items="center">
              <Text fontSize={16} fontWeight="800" color="$purple12">
                📊 Progression Annuelle
              </Text>
              <Target size={22} color="#2196F3" />
            </XStack>
            
            <Text fontSize={36} fontWeight="900" color="$purple12">
              {stats.percent}%
            </Text>
            
            <YStack height={14} background="$purple4" rounded={7} overflow="hidden">
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={{ 
                  height: '100%', 
                  width: `${progressPercent}%`,
                  borderRadius: 7,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </YStack>
            
            <XStack justify="space-between">
              <Text fontSize={12} color="$purple10" fontWeight="600">
                {totalDone.toLocaleString()} faites
              </Text>
              <Text fontSize={12} color="$purple10" fontWeight="600">
                {(TOTAL_TARGET_YEAR - totalDone).toLocaleString()} restantes
              </Text>
            </XStack>
          </YStack>
        </Card>

      </YStack>
    </ScrollView>
  );
}