import { ProgressChart } from '@/components/ProgressChart';
import RefreshableScreen from '@/components/RefreshScreen';
import { DAYS_IN_YEAR, TOTAL_TARGET_YEAR } from '@/constants/constants';
import { useTraining } from '@/contexts/TrainingContext';
import { useProgressData } from '@/hooks/useProgressData';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { SvgTraining } from '@/icons/Training';
import {
  Activity,
  BarChart3,
  Calendar,
  Check,
  Flame,
  TrendingDown,
  TrendingUp
} from '@tamagui/lucide-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { TextInput } from 'react-native';
import {
  Button,
  Card,
  H1,
  H2,
  Progress,
  Spinner,
  Text,
  useTheme,
  XStack,
  YStack
} from 'tamagui';

export default function DashboardScreen() {
  const { days, todayIndex, updateDay, stats, isLoading, error, refreshData } = useProgressData();
  const { sendCelebration, sendStreakReminder } = usePushNotifications();
  const [localInputValue, setLocalInputValue] = useState('');
  const [previousDone, setPreviousDone] = useState(0);
  const theme = useTheme();
  const { trainingType } = useTraining();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await refreshData();
    setLoading(false);
  };

  useEffect(() => {
    setLocalInputValue(stats.todayDone?.toString() || '');
    setPreviousDone(stats.todayDone || 0);
  }, [stats.todayDone]);

  const handleQuickAdd = (amount: number) => {
    const current = parseInt(localInputValue || '0', 10);
    const newVal = Math.max(0, current + amount);
    setLocalInputValue(newVal.toString());
    if (todayIndex !== -1) updateDay(todayIndex, newVal.toString());
  };

  const handleChangeText = (text: string) => {
    setLocalInputValue(text);
    if (todayIndex !== -1) {
      updateDay(todayIndex, text);
      
      const newValue = parseInt(text) || 0;
      
      // Célébration si objectif atteint pour la première fois
      if (newValue >= stats.todayTarget && previousDone < stats.todayTarget) {
        sendCelebration(`🎉 Objectif du jour validé ! Vous avez fait ${newValue} pompes !`);
      }
      
      // Rappel de streak si série en cours
      if (stats.daysCompleted >= 3 && newValue === 0) {
        sendStreakReminder(stats.daysCompleted);
      }
      
      setPreviousDone(newValue);
    }
  };

  const weekProgress = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Dimanche
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const result = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + i);
      
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dayData = days.find(d => d.dateStr === dateStr);
      
      const isToday = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
      const isFuture = date > today && !isToday;
      const isDone = dayData?.done !== null && dayData?.done !== undefined && dayData.done >= (dayData.target || 1);
      const isMissed = dayData?.done !== null && dayData?.done !== undefined && dayData.done < (dayData.target || 1);
      
      result.push({
        day: weekDays[i],
        status: isFuture ? 'future' : (isDone ? 'success' : (isMissed ? 'failed' : 'pending')),
        isToday
      });
    }
    
    return result;
  }, [days]);

  // Utiliser stats.totalDone au lieu de recalculer
  const isAhead = stats.ecart >= 0;
  const dayProgress = stats.todayTarget > 0 
    ? Math.min(100, ((stats.todayDone || 0) / stats.todayTarget) * 100) 
    : 0;

  if (isLoading && !loading) {
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
      <RefreshableScreen
      isRefreshing={loading} 
      onRefresh={handleRefresh}
    >
      <YStack p="$4" gap="$4" pb="$8">
        
        {/* 1. HEADER */}
        <YStack gap="$3" mb="$2" alignItems="center">
          <SvgTraining size={70} color="$color" />
          <YStack alignItems="center" gap="$1">
            <Text fontSize={14} color="$color" opacity={0.6} fontWeight="600" textTransform="uppercase" letterSpacing={1}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
            <H1 fontFamily="$heading" size="$6" color="$color">
              Défi {trainingType === 'pushup' ? 'Pompes' : 'Crunch'} 2026
            </H1>
          </YStack>
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
                  {trainingType === 'pushup' ? 'POMPES' : 'CRUNCH'}
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
                {[1, 10, 25].map((amount) => (
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
                {isAhead ? 'En Avance' : 'En Retard'}
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
                Total - Restant
              </Text>
              <H2 fontFamily="$heading" size="$5">
                {stats.totalDone.toLocaleString()} - {(TOTAL_TARGET_YEAR - stats.totalDone).toLocaleString()}
              </H2>
            </YStack>
          </Card>
        </XStack>

        <Card elevate p="$4" borderRadius={24} bg="$background" animation="lazy" 
            borderTopWidth={4} borderTopColor="$warning">
          <YStack gap="$3">
            <XStack alignItems="center" gap="$2">
                <Calendar size={16} color="$warning" />
                <Text fontSize={12} fontWeight="600" color="$color" opacity={0.7}>Cette semaine</Text>
              </XStack>
            
            <XStack justifyContent="space-between" gap="$2">
              {weekProgress.map((day, idx) => (
                <YStack key={idx} alignItems="center" gap="$2" flex={1}>
                  <Text fontSize={10} fontWeight="700" color="$color" opacity={0.6}>
                    {day.day}
                  </Text>
                  <YStack
                    width={32}
                    height={32}
                    borderRadius={16}
                    bg={day.status === 'success' ? '$success' : day.status === 'failed' ? '$red4' : '$backgroundHover'}
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={day.isToday ? 2 : 0}
                    borderColor="$color"
                  >
                    {day.status === 'success' && <Check size={16} color="white" />}
                    {day.status === 'failed' && <Text fontSize={12}>❌</Text>}
                    {day.status === 'pending' && <Text fontSize={10} opacity={0.5}>-</Text>}
                    {day.status === 'future' && <Text fontSize={10} opacity={0.5}>-</Text>}
                  </YStack>
                </YStack>
              ))}
            </XStack>
          </YStack>
        </Card>

        <XStack gap="$3">
          <Card elevate flex={1} p="$4" borderRadius={20} bg="$background" borderTopWidth={4} borderTopColor="$primary" animation="bouncy" animationDelay={100}>
            <YStack gap="$2">
              <XStack alignItems="center" gap="$2">
                <Calendar size={16} color="$primary" />
                <Text fontSize={12} fontWeight="600" color="$color" opacity={0.7}>Jour de l'année</Text>
              </XStack>
              <Text fontFamily="$heading" fontSize={20}>
                {todayIndex + 1} <Text fontSize={14} fontWeight="400" color="$color" opacity={0.6}>/ {DAYS_IN_YEAR}</Text>
              </Text>
              <Progress value={((todayIndex + 1) / DAYS_IN_YEAR) * 100} size="$1" bg="$backgroundHover">
                <Progress.Indicator animation="bouncy" bg="$primary" />
              </Progress>
            </YStack>
          </Card>

          <Card elevate flex={1} p="$4" borderRadius={20} bg="$background" borderTopWidth={4} borderTopColor="$danger" animation="bouncy" animationDelay={200}>
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

        {/* 5. GRAPHIQUE DE PROGRESSION */}
        <ProgressChart days={days} todayIndex={todayIndex} />

      </YStack>
    </RefreshableScreen>
  );
}