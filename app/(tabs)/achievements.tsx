import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Text, H2, ScrollView, Button } from 'tamagui';
import {
  Award,
  BadgeCheck,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  Crown,
  Dumbbell,
  Filter,
  Flame,
  Footprints,
  Gem,
  Globe,
  Medal,
  Milestone,
  Mountain,
  PartyPopper,
  Rocket,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from '@tamagui/lucide-icons';
import { StatCard, Card, AchievementCardComponent, AnimatedCounter } from '@/components/ui';
import { useProgressData } from '@/hooks/useProgressData';
import { useAchievements } from '@/hooks/useAchievements';
import { useTraining } from '@/contexts/TrainingContext';
import { AchievementCategory } from '@/types/achievement';
import log from '@/services/logger';

const CATEGORY_CONFIG = {
  all: { label: 'Tous', icon: Trophy, color: '$purple8' },
  streak: { label: 'Régularité', icon: Flame, color: '$red8' },
  volume: { label: 'Volume', icon: Target, color: '$blue8' },
  performance: { label: 'Performance', icon: Medal, color: '$orange8' },
  discipline: { label: 'Discipline', icon: Trophy, color: '$green8' },
  annual: { label: 'Annuels', icon: Target, color: '$purple8' },
  milestone: { label: 'Milestones', icon: Medal, color: '$amber8' },
  rare: { label: 'Rares', icon: Trophy, color: '$pink8' },
} as const;

type FilterType = AchievementCategory | 'all';

export default function AchievementsScreen() {
  const { days } = useProgressData();
  const { trainingType } = useTraining();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  // Créer le progressMap
  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    days.forEach(day => {
      if (day.done !== null) {
        map[day.dateStr] = day.done;
      }
    });
    return map;
  }, [days]);

  const { achievements, stats, unlockedCount, totalCount, isLoading } = useAchievements(days, progressMap);

  // Filtrer les achievements
  const filteredAchievements = useMemo(() => {
    if (selectedFilter === 'all') return achievements;
    return achievements.filter(a => a.category === selectedFilter);
  }, [achievements, selectedFilter]);

  // Grouper par statut
  const { unlocked, locked } = useMemo(() => {
    const unlocked = filteredAchievements.filter(a => a.unlocked);
    const locked = filteredAchievements.filter(a => !a.unlocked).sort((a, b) => b.progressPercent - a.progressPercent);
    return { unlocked, locked };
  }, [filteredAchievements]);

  log.debug(unlocked);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text>Chargement...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$backgroundHover">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$5" paddingBottom="$10">

            {/* HEADER */}
            <YStack gap="$2" alignItems="center" paddingTop="$2">
              <Trophy size={48} color="$achievement" />
              <H2 fontSize={28} fontWeight="800" color="$color">
                Accomplissements
              </H2>
              <Text fontSize={14} color="$colorMuted" textAlign="center">
                Débloquez tous les badges en progressant
              </Text>
            </YStack>

            {/* STATS GLOBALES */}
            <YStack gap="$3">
              <Text fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase" marginLeft="$2">
                Progression globale
              </Text>
              <XStack gap="$3">
                <StatCard flex={1} variant="achievement">
                  <XStack alignItems="center" gap="$2">
                    <Trophy size={20} color="$achievement" />
                    <Text fontSize={11} color="$colorMuted" fontWeight="600">Débloqués</Text>
                  </XStack>
                  <AnimatedCounter 
                    value={unlockedCount} 
                    fontSize={32} 
                    fontWeight="800" 
                    color="$achievement" 
                  />
                  <Text fontSize={11} color="$colorMuted">
                    / {totalCount} badges
                  </Text>
                </StatCard>

                <StatCard flex={1}>
                  <XStack alignItems="center" gap="$2">
                    <Target size={20} color="$color" />
                    <Text fontSize={11} color="$colorMuted" fontWeight="600">Taux</Text>
                  </XStack>
                  <AnimatedCounter 
                    value={totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}
                    fontSize={32} 
                    fontWeight="800" 
                    color="$color"
                    suffix="%"
                  />
                  <Text fontSize={11} color="$colorMuted">
                    complété
                  </Text>
                </StatCard>
              </XStack>

              {/* Stats Secondaires */}
              <XStack gap="$3">
                <StatCard flex={1} variant="streak">
                  <Text fontSize={11} color="$colorMuted" fontWeight="600">Streak</Text>
                  <AnimatedCounter 
                    value={stats.currentStreak} 
                    fontSize={28} 
                    fontWeight="800" 
                    color="$streak" 
                  />
                  <Text fontSize={10} color="$colorMuted">jours</Text>
                </StatCard>

                <StatCard flex={1} variant="primary">
                  <Text fontSize={11} color="$colorMuted" fontWeight="600">Total</Text>
                  <AnimatedCounter 
                    value={stats.totalPushups} 
                    fontSize={24} 
                    fontWeight="800" 
                    color="$primary" 
                  />
                  <Text fontSize={10} color="$colorMuted">{trainingType === 'pushup' ? 'pompes' : 'crunchs'}</Text>
                </StatCard>

                <StatCard flex={1}>
                  <Text fontSize={11} color="$colorMuted" fontWeight="600">Record</Text>
                  <AnimatedCounter 
                    value={stats.bestStreak} 
                    fontSize={28} 
                    fontWeight="800" 
                    color="$color" 
                  />
                  <Text fontSize={10} color="$colorMuted">jours</Text>
                </StatCard>
              </XStack>
            </YStack>

            {/* FILTRES */}
            <YStack gap="$3">
              <XStack alignItems="center" gap="$2">
                <Filter size={16} color="$colorMuted" />
                <Text fontSize={14} fontWeight="700" color="$colorMuted" textTransform="uppercase">
                  Catégories
                </Text>
              </XStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2" paddingRight="$4">
                  {(Object.keys(CATEGORY_CONFIG) as FilterType[]).map((filter) => {
                    const config = CATEGORY_CONFIG[filter];
                    const Icon = config.icon;
                    const isSelected = selectedFilter === filter;

                    return (
                      <Button
                        key={filter}
                        size="$3"
                        backgroundColor={isSelected ? '$primary' : '$background'}
                        borderColor={isSelected ? '$primary' : '$borderColor'}
                        borderWidth={1}
                        onPress={() => setSelectedFilter(filter)}
                        pressStyle={{ scale: 0.95 }}
                      >
                        <XStack gap="$2" alignItems="center">
                          <Icon size={16} color={isSelected ? 'white' : '$colorMuted'} />
                          <Text 
                            fontSize={13} 
                            fontWeight="600" 
                            color={isSelected ? 'white' : '$color'}
                          >
                            {config.label}
                          </Text>
                        </XStack>
                      </Button>
                    );
                  })}
                </XStack>
              </ScrollView>
            </YStack>

            {/* ACHIEVEMENTS DÉBLOQUÉS */}
            {unlocked.length > 0 && (
              <YStack gap="$3">
                <XStack alignItems="center" justifyContent="space-between">
                  <Text fontSize={16} fontWeight="700" color="$color">
                    ✓ Débloqués ({unlocked.length})
                  </Text>
                </XStack>

                <YStack gap="$3">
                  {unlocked.map((achievement) => (
                    <AchievementCardComponent
                      key={achievement.id}
                      title={achievement.title}
                      description={achievement.description}
                      rarity={achievement.category}
                      unlocked={true}
                      progress={100}
                      icon={achievement.icon}
                      color={achievement.color}
                    />
                  ))}
                </YStack>
              </YStack>
            )}

            {/* ACHIEVEMENTS VERROUILLÉS */}
            {locked.length > 0 && (
              <YStack gap="$3">
                <XStack alignItems="center" justifyContent="space-between">
                  <Text fontSize={16} fontWeight="700" color="$color">
                    🔒 À débloquer ({locked.length})
                  </Text>
                </XStack>

                <YStack gap="$3">
                  {locked.map((achievement) => (
                    <AchievementCardComponent
                      key={achievement.id}
                      title={achievement.title}
                      description={achievement.description}
                      rarity={achievement.category}
                      unlocked={false}
                      progress={achievement.progressPercent}
                      icon={achievement.icon}
                      color={achievement.color}
                    />
                  ))}
                </YStack>
              </YStack>
            )}

            {/* Message si aucun résultat */}
            {filteredAchievements.length === 0 && (
              <Card elevated padding="$6" alignItems="center">
                <Text fontSize={14} color="$colorMuted" textAlign="center">
                  Aucun achievement dans cette catégorie
                </Text>
              </Card>
            )}

          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
