/**
 * Types pour le système de badges/achievements
 */

export type AchievementCategory = 
  | 'streak'      // Régularité (jours consécutifs)
  | 'volume'      // Total de pompes
  | 'performance' // Performance en un jour
  | 'discipline'  // Discipline
  | 'annual'      // Objectifs annuels
  | 'milestone'   // Milestones spéciaux
  | 'rare';       // Exploits rares

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;           // Nom de l'icône Lucide
  color: string;          // Couleur du badge
  requirement: number;    // Valeur requise pour débloquer
  requirementType: AchievementRequirementType;
}

export type AchievementRequirementType =
  | 'streak'              // Jours consécutifs
  | 'total_pushups'       // Total pompes
  | 'single_day_pushups'  // Pompes en un jour
  | 'days_completed'      // Jours complétés (pas forcément consécutifs)
  | 'perfect_days'        // Jours où done === target
  | 'debt_payoff'         // Remboursement de dette
  | 'overachiever_ratio'; // Ratio done/target en un jour

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress: number;       // Valeur atteinte au moment du débloquage
}

export interface AchievementStats {
  totalPushups: number;
  currentStreak: number;
  bestStreak: number;
  daysCompleted: number;
  perfectDays: number;
  bestSingleDay: number;
}

export interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date;
  currentProgress: number;
  progressPercent: number;
}
