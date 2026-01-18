import { useAchievements } from '@/hooks/useAchievements';
import { useProgressData } from '@/hooks/useProgressData';
import { useTraining } from '@/contexts/TrainingContext';
import { AchievementCategory, AchievementWithStatus } from '@/types/achievement';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { ActivityIndicator, Image } from 'react-native';
import { Card, H2, Progress, ScrollView, Text, XStack, YStack } from 'tamagui';
import { TRAINING_LOGOS } from '@/constants/assets';

// Map des icônes par nom
const ICON_MAP: Record<string, any> = {
  Footprints,
  Calendar,
  CalendarCheck,
  Star,
  Crown,
  Dumbbell,
  Target,
  Milestone,
  Rocket,
  Trophy,
  Mountain,
  Flame,
  Globe,
  CheckCircle,
  TrendingUp,
  Zap,
  Sparkles,
  Shield,
  RotateCcw,
  Swords,
  Medal,
  Award,
  Gem,
  CalendarDays,
  CalendarRange,
  PartyPopper,
  BadgeCheck,
};

// Labels des catégories
const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  streak: '🔥 Régularité',
  volume: '💪 Volume',
  performance: '⚡ Performance',
  discipline: '🎯 Discipline',
  annual: '🏆 Objectifs Annuels',
  milestone: '📅 Milestones',
  rare: '🌟 Exploits Rares',
};

// Ordre des catégories pour l'affichage
const CATEGORY_ORDER: AchievementCategory[] = [
  'streak',
  'volume',
  'performance',
  'discipline',
  'annual',
  'milestone',
  'rare',
];

export default function AchievementsScreen() {
  // Récupérer les données de progression
  const { days, stats: progressStats } = useProgressData();
  const { trainingType } = useTraining();
  
  // Créer le progressMap à partir des days
  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    days.forEach(day => {
      if (day.done !== null) {
        map[day.dateStr] = day.done;
      }
    });
    return map;
  }, [days]);
  
  // Utiliser le hook achievements
  const { 
    achievements, 
    stats, 
    unlockedCount, 
    totalCount, 
    isLoading 
  } = useAchievements(days, progressMap);

  // Grouper les achievements par catégorie
  const achievementsByCategory = useMemo(() => {
    const grouped: Record<AchievementCategory, AchievementWithStatus[]> = {
      streak: [],
      volume: [],
      performance: [],
      discipline: [],
      annual: [],
      milestone: [],
      rare: [],
    };
    
    achievements.forEach(achievement => {
      grouped[achievement.category].push(achievement);
    });
    
    return grouped;
  }, [achievements]);

  // Calculer le progrès de la semaine
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
      
      const done = dayData?.done || 0;
      const target = dayData?.target || 1;
      const percent = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;
      
      result.push({
        day: weekDays[i],
        done,
        percent,
      });
    }
    
    return result;
  }, [days]);

  // Composant pour afficher un badge
  const BadgeCard = ({ achievement }: { achievement: AchievementWithStatus }) => {
    const Icon = ICON_MAP[achievement.icon] || Trophy;
    
    return (
      <Card
        elevate={achievement.unlocked}
        p="$4"
        borderRadius={20}
        bg={achievement.unlocked ? '$background' : '$backgroundHover'}
        opacity={achievement.unlocked ? 1 : 0.7}
        borderLeftWidth={4}
        borderLeftColor={achievement.unlocked ? achievement.color : '$borderColor'}
        animation="lazy"
        pressStyle={{ scale: 0.98 }}
      >
        <XStack alignItems="center" gap="$3">
          <YStack
            width={50}
            height={50}
            borderRadius="$10"
            bg={achievement.unlocked ? `${achievement.color}20` : '$borderColor'}
            alignItems="center"
            justifyContent="center"
          >
            <Icon 
              size={24} 
              color={achievement.unlocked ? achievement.color : '#9ca3af'} 
            />
          </YStack>
          
          <YStack flex={1} gap="$1">
            <Text fontFamily="$heading" fontSize={16} color="$color">
              {achievement.title}
            </Text>
            <Text fontSize={13} color="$color" opacity={0.6}>
              {achievement.description}
            </Text>
            
            {/* Barre de progression si non débloqué */}
            {!achievement.unlocked && (
              <XStack alignItems="center" gap="$2" mt="$1">
                <YStack flex={1} height={4} bg="$borderColor" borderRadius={2} overflow="hidden">
                  <YStack
                    height="100%"
                    width={`${achievement.progressPercent}%`}
                    bg={achievement.color}
                    borderRadius={2}
                  />
                </YStack>
                <Text fontSize={11} color="$color" opacity={0.5}>
                  {Math.round(achievement.progressPercent)}%
                </Text>
              </XStack>
            )}
          </YStack>
          
          {achievement.unlocked && (
            <YStack 
              width={28} 
              height={28} 
              borderRadius="$10" 
              bg="$success" 
              alignItems="center" 
              justifyContent="center"
            >
              <Text fontSize={14} color="white" fontWeight="bold">✓</Text>
            </YStack>
          )}
        </XStack>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <YStack flex={1} bg="$backgroundHover" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color="#c026d3" />
        <Text mt="$4" color="$color" opacity={0.6}>Chargement des achievements...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView bg="$backgroundHover" showsVerticalScrollIndicator={false}>
      <YStack p="$4" gap="$4" pb="$8">
        
        {/* Header */}
        <Card elevate size="$4" p="$0" overflow="hidden" borderRadius={24} animation="bouncy">
          <LinearGradient
            colors={['#c026d3', '#db2777']}
            style={{ padding: 24 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <YStack gap="$2" alignItems="center">
              <Image 
                source={TRAINING_LOGOS[trainingType || 'pushup']}
                style={{ width: 70, height: 70 }}
                resizeMode="contain"
              />
              <H2 fontFamily="$heading" color="#fff" size="$6">
                Accomplissements
              </H2>
              <Text color="rgba(255,255,255,0.8)" fontSize={14} fontWeight="600">
                {unlockedCount} / {totalCount} débloqués
              </Text>
            </YStack>
          </LinearGradient>
        </Card>

        {/* Stats rapides */}
        <Card elevate p="$4" borderRadius={20} bg="$background">
          <XStack justifyContent="space-around">
            <YStack alignItems="center" gap="$1">
              <Text fontSize={24} fontWeight="bold" color="$primary">
                {stats.totalPushups.toLocaleString()}
              </Text>
              <Text fontSize={12} color="$color" opacity={0.6}>
                Total {trainingType === 'pushup' ? 'pompes' : trainingType === 'crunch' ? 'crunchs' : 'reps'}
              </Text>
            </YStack>
            <YStack alignItems="center" gap="$1">
              <Text fontSize={24} fontWeight="bold" color="$success">
                {stats.currentStreak}
              </Text>
              <Text fontSize={12} color="$color" opacity={0.6}>
                Streak actuel
              </Text>
            </YStack>
            <YStack alignItems="center" gap="$1">
              <Text fontSize={24} fontWeight="bold" color="$warning">
                {stats.bestStreak}
              </Text>
              <Text fontSize={12} color="$color" opacity={0.6}>
                Meilleur streak
              </Text>
            </YStack>
          </XStack>
        </Card>

        {/* Progrès de la semaine */}
        <YStack gap="$3">
          <H2 fontFamily="$heading" size="$4" color="$color">
            📅 Cette semaine
          </H2>
          
          <Card elevate p="$4" borderRadius={20} bg="$background">
            <XStack gap="$2" justifyContent="space-between">
              {weekProgress.map((day, idx) => (
                <YStack key={idx} alignItems="center" gap="$2" flex={1}>
                  <Text fontSize={11} fontWeight="700" color="$color" opacity={0.6}>
                    {day.day}
                  </Text>
                  <YStack
                    height={80}
                    width={12}
                    bg="$backgroundHover"
                    borderRadius={8}
                    justifyContent="flex-end"
                    overflow="hidden"
                  >
                    <YStack
                      height={`${day.percent}%`}
                      width="100%"
                      bg={day.percent === 100 ? '$success' : day.percent > 0 ? '$warning' : 'transparent'}
                      borderRadius={10}
                    />
                  </YStack>
                  <Text fontSize={10} color="$color" opacity={0.8} fontWeight="600">
                    {day.done}
                  </Text>
                </YStack>
              ))}
            </XStack>
          </Card>
        </YStack>

        {/* Badges par catégorie */}
        {CATEGORY_ORDER.map(category => {
          const categoryAchievements = achievementsByCategory[category];
          if (categoryAchievements.length === 0) return null;
          
          const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
          
          return (
            <YStack key={category} gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <H2 fontFamily="$heading" size="$4" color="$color">
                  {CATEGORY_LABELS[category]}
                </H2>
                <Text fontSize={12} color="$color" opacity={0.5}>
                  {unlockedInCategory}/{categoryAchievements.length}
                </Text>
              </XStack>
              
              {categoryAchievements.map(achievement => (
                <BadgeCard key={achievement.id} achievement={achievement} />
              ))}
            </YStack>
          );
        })}

      </YStack>
    </ScrollView>
  );
}