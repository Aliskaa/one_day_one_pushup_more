/**
 * Types pour le système de leaderboard/classement
 */

import { TrainingName } from '@/contexts/TrainingContext';

/**
 * Profil public d'un utilisateur (visible dans le leaderboard)
 */
export interface PublicUserProfile {
  userId: string;
  username: string;
  avatarUrl?: string;
  createdAt: Date;
  lastActive: Date;
}

/**
 * Stats publiques d'un utilisateur pour un type d'entraînement
 */
export interface PublicUserStats {
  userId: string;
  trainingType: TrainingName;
  totalDone: number; // Total de répétitions effectuées
  currentStreak: number; // Série de jours consécutifs actuelle
  bestStreak: number; // Meilleure série de tous les temps
  /** Max de répétitions sur une seule journée (classement « Record ») — absent sur anciens docs avant sync */
  bestSingleDay?: number;
  daysCompleted: number; // Nombre de jours complétés
  /** Cumul réel − objectifs attendus jusqu’à aujourd’hui (comme sur l’accueil, sans banque) */
  physicalEcart?: number;
  lastUpdated: Date;
  // Stats optionnelles
  weekTotal?: number; // Total de la semaine
  monthTotal?: number; // Total du mois
}

/**
 * Entrée du leaderboard (profil + stats)
 */
export interface LeaderboardEntry {
  profile: PublicUserProfile;
  stats: PublicUserStats;
  rank?: number; // Position dans le classement
}

/**
 * Options de filtrage du leaderboard
 */
export type LeaderboardPeriod = 'allTime' | 'month' | 'week';
export type LeaderboardSortBy =
  | 'totalDone'
  | 'currentStreak'
  | 'bestSingleDay'
  | 'physicalEcart';

export interface LeaderboardFilters {
  period: LeaderboardPeriod;
  sortBy: LeaderboardSortBy;
  trainingType: TrainingName;
  limit?: number;
}
