/**
 * Définition de tous les badges disponibles dans l'application
 */

import { Achievement } from '@/types/achievement';
import { DAYS_IN_YEAR, TOTAL_TARGET_YEAR } from './constants';
import { Footprints, Calendar, CalendarCheck, Star, Crown, Dumbbell, Target, Milestone, Rocket, Trophy, Mountain, Flame, Globe, CheckCircle, TrendingUp, Zap, Sparkles, Shield, RotateCcw, Swords, Medal, Award, Gem, CalendarDays, CalendarRange, PartyPopper, BadgeCheck } from '@tamagui/lucide-icons';

export const ICON_MAP: Record<string, any> = {
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

export const ACHIEVEMENTS: Achievement[] = [
  // ===== CATÉGORIE: RÉGULARITÉ (STREAKS) =====
  {
    id: 'first_step',
    title: 'Premier pas',
    description: 'Ton premier jour complété',
    category: 'streak',
    icon: 'Footprints',
    color: '#10b981', // green
    requirement: 1,
    requirementType: 'streak',
  },
  {
    id: 'week_streak',
    title: '7 jours consécutifs',
    description: 'Une semaine complète !',
    category: 'streak',
    icon: 'Calendar',
    color: '#f59e0b', // amber
    requirement: 7,
    requirementType: 'streak',
  },
  {
    id: 'month_streak',
    title: '30 jours consécutifs',
    description: 'Mois parfait',
    category: 'streak',
    icon: 'CalendarCheck',
    color: '#8b5cf6', // violet
    requirement: 30,
    requirementType: 'streak',
  },
  {
    id: 'hundred_streak',
    title: '100 jours consécutifs',
    description: 'Centenaire !',
    category: 'streak',
    icon: 'Star',
    color: '#ec4899', // pink
    requirement: 100,
    requirementType: 'streak',
  },
  {
    id: 'year_streak',
    title: '365 jours',
    description: 'Cœur de champion - Une année complète',
    category: 'streak',
    icon: 'Crown',
    color: '#eab308', // yellow/gold
    requirement: 365,
    requirementType: 'streak',
  },

  // ===== CATÉGORIE: VOLUME (TOTAL POMPES) =====
  {
    id: 'pushups_100',
    title: 'Première centaine',
    description: '100 répétitions au total',
    category: 'volume',
    icon: 'Dumbbell',
    color: '#06b6d4', // cyan
    requirement: 100,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_500',
    title: '500 répétitions',
    description: 'Demi-millier',
    category: 'volume',
    icon: 'Target',
    color: '#3b82f6', // blue
    requirement: 500,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_1000',
    title: '1000 répétitions',
    description: 'Millénaire',
    category: 'volume',
    icon: 'Milestone',
    color: '#6366f1', // indigo
    requirement: 1000,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_5000',
    title: '5000 répétitions',
    description: 'Fusée musculaire',
    category: 'volume',
    icon: 'Rocket',
    color: '#a855f7', // purple
    requirement: 5000,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_10000',
    title: '10 000 répétitions',
    description: 'Légende',
    category: 'volume',
    icon: 'Trophy',
    color: '#f97316', // orange
    requirement: 10000,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_20000',
    title: '20 000 répétitions',
    description: 'Montagne gravie',
    category: 'volume',
    icon: 'Mountain',
    color: '#14b8a6', // teal
    requirement: 20000,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_30000',
    title: '30 000 répétitions',
    description: 'Volcan conquis',
    category: 'volume',
    icon: 'Flame',
    color: '#ef4444', // red
    requirement: 30000,
    requirementType: 'total_pushups',
  },
  {
    id: 'pushups_50000',
    title: '50 000 répétitions',
    description: 'Tour du monde',
    category: 'volume',
    icon: 'Globe',
    color: '#22c55e', // green
    requirement: 50000,
    requirementType: 'total_pushups',
  },

  // ===== CATÉGORIE: PERFORMANCE (SINGLE DAY) =====
  {
    id: 'perfect_day',
    title: 'Jour parfait',
    description: 'Objectif atteint exactement',
    category: 'performance',
    icon: 'CheckCircle',
    color: '#10b981', // emerald
    requirement: 1,
    requirementType: 'perfect_days',
  },
  {
    id: 'overachiever',
    title: 'Overachiever',
    description: '+50% de l\'objectif en un jour',
    category: 'performance',
    icon: 'TrendingUp',
    color: '#f59e0b', // amber
    requirement: 1.5,
    requirementType: 'overachiever_ratio',
  },
  {
    id: 'hundred_single_day',
    title: '100 en un jour',
    description: 'Force maximale',
    category: 'performance',
    icon: 'Zap',
    color: '#eab308', // yellow
    requirement: 100,
    requirementType: 'single_day_pushups',
  },
  {
    id: 'two_hundred_single_day',
    title: '200 en un jour',
    description: 'Surhumain',
    category: 'performance',
    icon: 'Sparkles',
    color: '#ec4899', // pink
    requirement: 200,
    requirementType: 'single_day_pushups',
  },

  // ===== CATÉGORIE: DISCIPLINE =====
  {
    id: 'no_debt_week',
    title: 'Jamais en dette',
    description: 'Toujours à jour pendant 7 jours',
    category: 'discipline',
    icon: 'Shield',
    color: '#10b981', // green
    requirement: 7,
    requirementType: 'perfect_days',
  },
  {
    id: 'consistent_two_weeks',
    title: 'Progression constante',
    description: '14 jours sans manquer',
    category: 'discipline',
    icon: 'TrendingUp',
    color: '#3b82f6', // blue
    requirement: 14,
    requirementType: 'streak',
  },
  {
    id: 'comeback_kid',
    title: 'Comeback kid',
    description: 'Rattraper un retard de +10',
    category: 'discipline',
    icon: 'RotateCcw',
    color: '#8b5cf6', // violet
    requirement: 10,
    requirementType: 'debt_payoff',
  },
  {
    id: 'heroic_comeback',
    title: 'Rattrapage héroïque',
    description: 'Rattraper un retard de +50',
    category: 'rare',
    icon: 'Swords',
    color: '#ef4444', // red
    requirement: 50,
    requirementType: 'debt_payoff',
  },

  // ===== CATÉGORIE: OBJECTIFS ANNUELS =====
  {
    id: 'quarter_goal',
    title: 'Quart du chemin',
    description: '25% de l\'objectif annuel (16 699 pompes)',
    category: 'annual',
    icon: 'Target',
    color: '#06b6d4', // cyan
    requirement: Math.floor(TOTAL_TARGET_YEAR * 0.25),
    requirementType: 'total_pushups',
  },
  {
    id: 'half_goal',
    title: 'Mi-parcours',
    description: '50% de l\'objectif annuel (33 398 pompes)',
    category: 'annual',
    icon: 'Medal',
    color: '#a855f7', // purple
    requirement: Math.floor(TOTAL_TARGET_YEAR * 0.5),
    requirementType: 'total_pushups',
  },
  {
    id: 'three_quarter_goal',
    title: 'Trois quarts',
    description: '75% de l\'objectif annuel (50 096 pompes)',
    category: 'annual',
    icon: 'Award',
    color: '#f97316', // orange
    requirement: Math.floor(TOTAL_TARGET_YEAR * 0.75),
    requirementType: 'total_pushups',
  },
  {
    id: 'annual_goal',
    title: 'Objectif Annuel',
    description: '66 795 répétitions - Challenge complété !',
    category: 'annual',
    icon: 'Trophy',
    color: '#eab308', // gold
    requirement: TOTAL_TARGET_YEAR,
    requirementType: 'total_pushups',
  },
  {
    id: 'beyond_limits',
    title: 'Au-delà des limites',
    description: 'Dépasser l\'objectif annuel (66 796+ pompes)',
    category: 'annual',
    icon: 'Gem',
    color: '#ec4899', // pink
    requirement: TOTAL_TARGET_YEAR + 1,
    requirementType: 'total_pushups',
  },

  // ===== CATÉGORIE: MILESTONES SPÉCIAUX =====
  {
    id: 'first_month',
    title: 'Premier mois',
    description: '30 jours dans l\'aventure',
    category: 'milestone',
    icon: 'Calendar',
    color: '#10b981', // green
    requirement: 30,
    requirementType: 'days_completed',
  },
  {
    id: 'quarter_year',
    title: 'Trimestre',
    description: '90 jours d\'entraînement',
    category: 'milestone',
    icon: 'CalendarDays',
    color: '#3b82f6', // blue
    requirement: 90,
    requirementType: 'days_completed',
  },
  {
    id: 'half_year',
    title: 'Semestre',
    description: '180 jours d\'entraînement',
    category: 'milestone',
    icon: 'CalendarRange',
    color: '#8b5cf6', // violet
    requirement: 180,
    requirementType: 'days_completed',
  },
  {
    id: 'full_year',
    title: 'Année complète',
    description: '365 jours d\'entraînement',
    category: 'milestone',
    icon: 'PartyPopper',
    color: '#eab308', // gold
    requirement: 365,
    requirementType: 'days_completed',
  },

  // ===== CATÉGORIE: EXPLOITS RARES =====
  {
    id: 'perfectionist',
    title: 'Perfectionniste',
    description: '7 jours parfaits (done === target)',
    category: 'rare',
    icon: 'BadgeCheck',
    color: '#6366f1', // indigo
    requirement: 7,
    requirementType: 'perfect_days',
  },
];

// Helper pour obtenir un achievement par ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id);
};

// Helper pour obtenir les achievements par catégorie
export const getAchievementsByCategory = (category: Achievement['category']): Achievement[] => {
  return ACHIEVEMENTS.filter(a => a.category === category);
};
