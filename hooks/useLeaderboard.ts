/**
 * Hook personnalisé pour gérer le leaderboard
 */

import { useTraining } from '@/contexts/TrainingContext';
import {
  LeaderboardEntry,
  LeaderboardFilters,
  LeaderboardPeriod,
  LeaderboardSortBy,
} from '@/types/leaderboard';
import { useEffect, useState } from 'react';
import { getLeaderboard, subscribeToLeaderboard } from '@/services/leaderboard';
import log from '@/services/logger';

export const useLeaderboard = (initialFilters?: Partial<LeaderboardFilters>) => {
  const { trainingType } = useTraining();
  
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<LeaderboardPeriod>(
    initialFilters?.period || 'allTime'
  );
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>(
    initialFilters?.sortBy || 'totalDone'
  );
  const [limit, setLimit] = useState(initialFilters?.limit || 50);

  // Chargement initial
  useEffect(() => {
    // Ne rien faire si pas de trainingType
    if (!trainingType) {
      setLoading(false);
      return;
    }

    const filters: LeaderboardFilters = {
      trainingType,
      period,
      sortBy,
      limit,
    };

    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderboard(filters);
        setEntries(data);
      } catch (err: any) {
        log.error('Erreur chargement leaderboard:', err);
        
        // Message spécifique pour l'erreur d'index
        if (err?.message?.includes('index')) {
          setError('Configuration Firebase requise. Voir FIREBASE_INDEX_SETUP.md');
        } else {
          setError('Impossible de charger le classement');
        }
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [trainingType, period, sortBy, limit]);

  // Subscription en temps réel (optionnel)
  const enableRealtime = () => {
    if (!trainingType) return () => {};

    const filters: LeaderboardFilters = {
      trainingType,
      period,
      sortBy,
      limit,
    };

    const unsubscribe = subscribeToLeaderboard(filters, (data) => {
      setEntries(data);
      setLoading(false);
    });

    return unsubscribe;
  };

  // Rafraîchissement manuel
  const refresh = async () => {
    if (!trainingType) return;

    const filters: LeaderboardFilters = {
      trainingType,
      period,
      sortBy,
      limit,
    };

    try {
      setLoading(true);
      setError(null);
      const data = await getLeaderboard(filters);
      setEntries(data);
    } catch (err: any) {
      log.error('Erreur rafraîchissement leaderboard:', err);
      
      // Message spécifique pour l'erreur d'index
      if (err?.message?.includes('index')) {
        setError('Configuration Firebase requise. Voir FIREBASE_INDEX_SETUP.md');
      } else {
        setError('Impossible de rafraîchir le classement');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    entries,
    loading,
    error,
    period,
    setPeriod,
    sortBy,
    setSortBy,
    limit,
    setLimit,
    refresh,
    enableRealtime,
  };
};
