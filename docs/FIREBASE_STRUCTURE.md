# Structure Firebase - Multi-Training

## 📊 Architecture de la base de données

Votre application supporte maintenant plusieurs types d'entraînement (Pompes/Crunch) avec des données complètement séparées.

### Structure Firestore

```
users/
  └── {userId}/
      ├── training/
      │   ├── pushup/
      │   │   └── progress/
      │   │       └── year_2025
      │   │           ├── year: 2025
      │   │           ├── progressMap: { "2025-01-01": 10, "2025-01-02": 15, ... }
      │   │           ├── lastUpdated: Timestamp
      │   │           └── totalDone: 12500
      │   │
      │   └── crunch/
      │       └── progress/
      │           └── year_2025
      │               ├── year: 2025
      │               ├── progressMap: { "2025-01-01": 20, "2025-01-02": 30, ... }
      │               ├── lastUpdated: Timestamp
      │               └── totalDone: 8200
      │
      └── achievements/
          ├── pushup/
          │   ├── unlockedBadges: { "first_step": {...}, "week_streak": {...} }
          │   ├── stats: { totalPushups: 12500, currentStreak: 45, ... }
          │   └── lastUpdated: Timestamp
          │
          └── crunch/
              ├── unlockedBadges: { "first_step": {...} }
              ├── stats: { totalPushups: 8200, currentStreak: 12, ... }
              └── lastUpdated: Timestamp

publicProfiles/ (Collection racine pour le leaderboard)
  └── {userId}
      ├── userId: "user123"
      ├── username: "JohnDoe"
      ├── avatarUrl: "https://..."
      ├── createdAt: Timestamp
      └── lastActive: Timestamp

publicStats/ (Collection racine pour le leaderboard - structure PLATE)
  └── {userId}_{trainingType}  (ex: "user123_pushup")
      ├── userId: "user123"
      ├── trainingType: "pushup"
      ├── totalDone: 12500
      ├── currentStreak: 45
      ├── bestStreak: 67
      ├── daysCompleted: 180
      ├── weekTotal: 420
      ├── monthTotal: 1800
      └── lastUpdated: Timestamp
```

**💡 Note :** Structure PLATE choisie pour faciliter les requêtes du leaderboard (where + orderBy).

## 🔧 Implémentation

### 1. Progression (firebaseStorage.ts)

Toutes les fonctions acceptent maintenant `trainingType: TrainingName` :

```typescript
// Charger les données
loadProgressFromFirebase(userId, trainingType);

// Sauvegarder
saveProgressToFirebase(userId, trainingType, progressMap);

// Mettre à jour un jour
updateDayProgress(userId, trainingType, dateStr, value);

// S'abonner aux changements
subscribeToProgress(userId, trainingType, onUpdate);
```

### 2. Achievements (achievementsStorage.ts)

Les achievements sont également séparés par type d'entraînement :

```typescript
// Charger les achievements
loadAchievementsFromFirebase(userId, trainingType);

// Sauvegarder
saveAchievementsToFirebase(userId, trainingType, unlockedBadges, stats);

// Débloquer un achievement
unlockAchievement(userId, trainingType, achievementId, progress);

// S'abonner aux changements
subscribeToAchievements(userId, trainingType, onUpdate);
```

### 3. Contexte Training (TrainingContext.tsx)

Le choix de l'entraînement est persisté dans AsyncStorage :

```typescript
const { trainingType, selectTraining } = useTraining();

// Changer de type d'entraînement
selectTraining('pushup'); // ou 'crunch'
```

### 4. Leaderboard (leaderboard.ts)

Système de classement public avec stats synchronisées automatiquement :

```typescript
// Récupérer le leaderboard
const entries = await getLeaderboard({
  trainingType: 'pushup',
  sortBy: 'totalDone',
  period: 'allTime',
  limit: 50
});

// S'abonner aux changements en temps réel
const unsubscribe = subscribeToLeaderboard(filters, (entries) => {
  console.log('Leaderboard mis à jour:', entries);
});

// Obtenir le rang d'un utilisateur
const rank = await getUserRank(userId, 'pushup', 'totalDone');
```

**Synchronisation automatique :**
Les stats publiques sont mises à jour automatiquement dans `useProgressData` après chaque sauvegarde de progression.



## 🔄 Flux de l'application

1. **Connexion** → `sign-in.tsx`
2. **Choix du défi** → `index.tsx` (si pas de trainingType)
3. **Application** → `(tabs)/` (avec trainingType défini)

### AuthGuard

L'`AuthGuard` gère automatiquement les redirections :
- Non connecté → `/sign-in`
- Connecté sans défi → `/` (index pour choisir)
- Connecté avec défi → `/(tabs)` (app principale)

## 💾 Persistance

### AsyncStorage
- `@training_type` : Stocke le choix pushup/crunch

### Firestore
- Données de progression par training
- Achievements par training
- Synchronisation temps réel multi-appareils

## 🎯 Avantages

✅ **Données séparées** : Les progrès pushup/crunch sont isolés
✅ **Achievements distincts** : Chaque entraînement a ses propres badges
✅ **Changement facile** : Basculer entre les défis depuis Settings
✅ **Pas de perte de données** : Les progrès sont conservés séparément
✅ **Synchronisation** : Temps réel sur tous les appareils

## 🚀 Ajout d'un nouveau type d'entraînement

Pour ajouter un nouveau type (ex: "squats") :

1. Modifier `TrainingContext.tsx` :
```typescript
export type TrainingName = 'pushup' | 'crunch' | 'squats';
```

2. Ajouter dans `index.tsx` (sélection) :
```typescript
<CardButton logo={LOGO_SQUATS} title="Squats" onClick={() => handleSelectTraining('squats')} />
```

3. Ajouter dans `settings.tsx` (Sheet) :
```typescript
<Button onPress={() => selectTraining('squats')}>
  🦵 Squats
</Button>
```

Aucune autre modification nécessaire ! 🎉
