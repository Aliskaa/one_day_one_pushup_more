import { ProgressChart } from '@/components/ProgressChart';
import { TrendChart } from '@/components/TrendChart';
import RefreshableScreen from '@/components/RefreshScreen';
import {
  Card,
  CelebrationModal,
  QuickActions,
  StatCard,
  StreakDisplay,
  TodayObjective,
  AnimatedCounter,
} from '@/components/ui';
import WorkoutScreen from '@/components/WorkoutScreen';
import { useTraining } from '@/contexts/TrainingContext';
import { getCurrentWeekDays, isDayCompleted, isDayMissed } from '@/helpers/dateUtils';
import { useProgressData } from '@/hooks/useProgressData';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { SvgTraining } from '@/icons/Training';
import {
  Calendar,
  Check,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy
} from '@tamagui/lucide-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H2, Separator, Spinner, Text, XStack, YStack } from 'tamagui';

export default function DashboardScreen() {
  const { days, todayIndex, updateDay, stats, isLoading, error, refreshData } = useProgressData();
  const { trainingType } = useTraining();
  const { sendCelebration } = usePushNotifications();
  
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousDone, setPreviousDone] = useState(0);

  const handleRefresh = async () => {
    setLoading(true);
    await refreshData();
    setLoading(false);
  };

  useEffect(() => {
    setPreviousDone(stats.todayDone || 0);
  }, [stats.todayDone]);

  const handleIncrement = (amount: number) => {
    if (todayIndex === -1) return;
    
    const newValue = (stats.todayDone || 0) + amount;
    updateDay(todayIndex, newValue.toString());
    
    // Célébration si objectif atteint pour la première fois
    if (newValue >= stats.todayTarget && previousDone < stats.todayTarget) {
      setShowCelebration(true);
      sendCelebration(`🎉 Objectif du jour validé ! ${newValue} ${trainingType === 'pushup' ? 'pompes' : 'crunchs'} !`);
    }
    
    setPreviousDone(newValue);
  };

  const handleComplete = () => {
    if (todayIndex === -1) return;
    
    const targetValue = stats.todayTarget;
    updateDay(todayIndex, targetValue.toString());
    
    if (previousDone < stats.todayTarget) {
      setShowCelebration(true);
      sendCelebration(`🎉 Objectif du jour validé ! ${targetValue} ${trainingType === 'pushup' ? 'pompes' : 'crunchs'} !`);
    }
    
    setPreviousDone(targetValue);
  };

  const isAhead = stats.ecart >= 0;
  const progressPercentage = stats.todayTarget > 0
    ? Math.min(100, ((stats.todayDone || 0) / stats.todayTarget) * 100)
    : 0;

  const weekProgress = useMemo(() => {
    const weekDays = getCurrentWeekDays(days);
    
    return weekDays.map(({ day, isToday, isFuture, dayData }) => {
      const isDone = isDayCompleted(dayData?.done, dayData?.target || 1);
      const isMissed = isDayMissed(dayData?.done, dayData?.target || 1);
      
      return {
        day,
        status: isFuture ? 'future' : (isDone ? 'success' : (isMissed ? 'failed' : 'pending')),
        isToday
      };
    });
  }, [days]);

  if (isLoading && !loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text color="$danger" fontSize={18} fontWeight="700">❌ {error}</Text>
      </YStack>
    );
  }

  return (
    <>
      <RefreshableScreen isRefreshing={loading} onRefresh={handleRefresh}>
        <YStack flex={1} backgroundColor="$background">
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <YStack padding="$4" gap="$5" paddingBottom="$10">
              
              {/* HEADER */}
              <YStack gap="$2" alignItems="center" paddingTop="$2">
                <SvgTraining size={60} color="$primary" />
                <Text 
                  fontSize={12} 
                  color="$colorMuted" 
                  fontWeight="700" 
                  textTransform="uppercase" 
                  letterSpacing={2}
                >
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </YStack>

              {/* HERO - OBJECTIF DU JOUR */}
              <TodayObjective
                current={stats.todayDone || 0}
                target={stats.todayTarget}
                trainingType={trainingType || 'pushup'}
              />

              {/* QUICK ACTIONS */}
              <QuickActions
                onIncrement={handleIncrement}
                onComplete={handleComplete}
                currentValue={stats.todayDone || 0}
                targetValue={stats.todayTarget}
                disabled={todayIndex === -1}
              />

              <Separator borderColor="$borderColor" marginVertical="$2" />

              {/* STATS GRID */}
              <YStack gap="$4">
                <H2 fontSize={20} fontWeight="700" color="$color">
                  Statistiques
                </H2>

                {/* STREAK */}
                <StreakDisplay
                  streak={stats.streak}
                />

                {/* STATS ROW */}
                <XStack gap="$3">
                  {/* Total de l'année */}
                  <StatCard flex={1} variant="primary">
                    <XStack alignItems="center" gap="$2">
                      <Trophy size={20} color="$primary" />
                      <Text fontSize={12} color="$colorMuted" fontWeight="600">Total</Text>
                    </XStack>
                    <AnimatedCounter
                      value={stats.totalDone}
                      fontSize={32}
                      fontWeight="800"
                      color="$primary"
                      duration={800}
                    />
                    <Text fontSize={12} color="$colorMuted">
                      {trainingType === 'pushup' ? 'pompes' : 'crunchs'}
                    </Text>
                  </StatCard>

                  {/* Écart avec objectif */}
                  <StatCard flex={1} variant={isAhead ? 'success' : 'primary'}>
                    <XStack alignItems="center" gap="$2">
                      {isAhead ? (
                        <TrendingUp size={20} color="$success" />
                      ) : (
                        <TrendingDown size={20} color="$primary" />
                      )}
                      <Text fontSize={12} color="$colorMuted" fontWeight="600">Écart</Text>
                    </XStack>
                    <AnimatedCounter
                      value={stats.ecart}
                      fontSize={32}
                      fontWeight="800"
                      color={isAhead ? '$success' : '$primary'}
                      prefix={isAhead ? '+' : ''}
                      duration={800}
                    />
                    <Text fontSize={12} color="$colorMuted">
                      {isAhead ? 'en avance' : 'en retard'}
                    </Text>
                  </StatCard>
                </XStack>

                {/* PROGRESS ROW */}
                <XStack gap="$3">
                  {/* Jours complétés */}
                  <StatCard flex={1}>
                    <XStack alignItems="center" gap="$2">
                      <Calendar size={20} color="$color" />
                      <Text fontSize={12} color="$colorMuted" fontWeight="600">Jours</Text>
                    </XStack>
                    <AnimatedCounter
                      value={days.filter(d => (d.done || 0) >= (d.target || 1)).length}
                      fontSize={28}
                      fontWeight="800"
                      color="$color"
                      duration={800}
                    />
                    <Text fontSize={12} color="$colorMuted">
                      / {days.length} complétés
                    </Text>
                  </StatCard>

                  {/* Taux de complétion */}
                  <StatCard flex={1}>
                    <XStack alignItems="center" gap="$2">
                      <Target size={20} color="$color" />
                      <Text fontSize={12} color="$colorMuted" fontWeight="600">Taux</Text>
                    </XStack>
                    <AnimatedCounter
                      value={days.length > 0 ? Math.round((days.filter(d => (d.done || 0) >= (d.target || 1)).length / days.length) * 100) : 0}
                      fontSize={28}
                      fontWeight="800"
                      color="$color"
                      suffix="%"
                      duration={800}
                    />
                    <Text fontSize={12} color="$colorMuted">
                      de réussite
                    </Text>
                  </StatCard>
                </XStack>
              </YStack>

              <Separator borderColor="$borderColor" marginVertical="$2" />

              {/* AVANCÉE DE LA SEMAINE */}
              <Card elevated paddingVertical="$4" paddingHorizontal="$5" borderTopWidth={4} borderTopColor="$orange6">
                <YStack gap="$3">
                  <XStack alignItems="center" gap="$2">
                    <Calendar size={18} color="$orange8" />
                    <Text fontSize={14} fontWeight="700" color="$color" opacity={0.8}>
                      Cette semaine
                    </Text>
                  </XStack>

                  <XStack justifyContent="space-between" gap="$2">
                    {weekProgress.map((day, idx) => (
                      <YStack key={idx} alignItems="center" gap="$2" flex={1}>
                        <Text fontSize={11} fontWeight="700" color="$colorMuted" textTransform="uppercase">
                          {day.day}
                        </Text>
                        <YStack
                          width={36}
                          height={36}
                          borderRadius={18}
                          backgroundColor={
                            day.status === 'success' 
                              ? '$green8' 
                              : day.status === 'failed' 
                              ? '$red6' 
                              : '$backgroundHover'
                          }
                          alignItems="center"
                          justifyContent="center"
                          borderWidth={day.isToday ? 3 : 0}
                          borderColor="$primary"
                        >
                          {day.status === 'success' && <Check size={18} color="white" />}
                          {day.status === 'failed' && <Text fontSize={14}>❌</Text>}
                          {day.status === 'pending' && <Text fontSize={11} opacity={0.5}>-</Text>}
                          {day.status === 'future' && <Text fontSize={11} opacity={0.3}>•</Text>}
                        </YStack>
                      </YStack>
                    ))}
                  </XStack>
                </YStack>
              </Card>

              <Separator borderColor="$borderColor" marginVertical="$2" />

              {/* COACH IA */}
              <WorkoutScreen />

              {/* GRAPHIQUES */}
              <YStack gap="$3">
                <H2 fontSize={20} fontWeight="700" color="$color">
                  Analyses
                </H2>
                
                {/* Graphique de progression */}
                <ProgressChart days={days} todayIndex={todayIndex} />
                
                {/* Graphique de tendance */}
                <TrendChart days={days} todayIndex={todayIndex} />
              </YStack>

            </YStack>
          </SafeAreaView>
        </YStack>
      </RefreshableScreen>

      {/* MODAL DE CÉLÉBRATION */}
      <CelebrationModal
        visible={showCelebration}
        onClose={() => setShowCelebration(false)}
        icon={<Trophy size={80} color="$achievement" />}
        message="🎉 Bravo !"
        submessage={`Objectif du jour validé : ${stats.todayTarget} ${trainingType === 'pushup' ? 'pompes' : 'crunchs'}`}
      />
    </>
  );
}
