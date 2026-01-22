import { storageService } from "@/services/asyncStorage";
import { createContext, useContext, useEffect, useState } from "react";

export type TrainingName = 'pushup' | 'crunch';

interface TrainingContextType {
  trainingType: TrainingName | null;
  selectTraining: (type: TrainingName) => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

const TRAINING_STORAGE_KEY = '@training_type';

export const TrainingProvider = ({ children }: { children: React.ReactNode }) => {
  const [trainingType, setTrainingType] = useState<TrainingName | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le choix au démarrage
  useEffect(() => {
    const loadTraining = async () => {
      try {
        const saved = await storageService.getItem<TrainingName | null>(TRAINING_STORAGE_KEY);
        if (saved && (saved === 'pushup' || saved === 'crunch')) {
          setTrainingType(saved);
        }
      } catch (error) {
        console.error('Erreur chargement training:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTraining();
  }, []);

  const selectTraining = async (type: TrainingName) => {
    setTrainingType(type);
    try {
      await storageService.setItem(TRAINING_STORAGE_KEY, type);
    } catch (error) {
      console.error('Erreur sauvegarde training:', error);
    }
  };

  // Attendre le chargement avant de rendre
  if (isLoading) {
    return null;
  }

  return (
    <TrainingContext.Provider value={{ trainingType, selectTraining }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
};