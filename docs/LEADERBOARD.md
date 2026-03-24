# 🏆 Système de Leaderboard

## Vue d'ensemble

Le système de leaderboard permet de suivre et comparer les performances de tous les utilisateurs de l'application. Les statistiques publiques sont synchronisées automatiquement à chaque entraînement.

## 📊 Collections Firebase

### `publicProfiles`
Contient les profils publics des utilisateurs :
- `userId` : ID unique de l'utilisateur
- `username` : Nom d'affichage
- `avatarUrl` : URL de l'avatar (optionnel)
- `createdAt` : Date de création du profil
- `lastActive` : Dernière activité

### `publicStats`
Contient les statistiques par utilisateur et type d'entraînement :
- ID du document : `{userId}_{trainingType}` (ex: "user123_pushup")
- `totalDone` : Nombre total de répétitions
- `currentStreak` : Série de jours consécutifs actuelle
- `bestStreak` : Meilleure série de tous les temps
- `daysCompleted` : Nombre de jours complétés
- `weekTotal` : Total de la semaine en cours
- `monthTotal` : Total du mois en cours
- `lastUpdated` : Date de dernière mise à jour

## 🔧 Configuration Firebase

### Règles de sécurité Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Profils publics - lecture publique, écriture par propriétaire
    match /publicProfiles/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Stats publiques - lecture publique, écriture par propriétaire
    match /publicStats/{statsId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      statsId.matches(request.auth.uid + '_.*');
    }
    
    // ... autres règles
  }
}
```

### Index recommandés

Pour optimiser les requêtes du leaderboard, créez ces index composites :

1. **publicStats** : `trainingType` (ASC) + `totalDone` (DESC)
2. **publicStats** : `trainingType` (ASC) + `currentStreak` (DESC)
3. **publicStats** : `trainingType` (ASC) + `bestStreak` (DESC)

Firebase vous proposera de créer ces index automatiquement lors de la première utilisation.

## 💻 Utilisation

### Dans un composant

```tsx
import { useLeaderboard } from '@/hooks/useLeaderboard';

function LeaderboardScreen() {
  const { entries, loading, error, sortBy, setSortBy, refresh } = useLeaderboard();

  if (loading) return <Spinner />;
  if (error) return <Text>{error}</Text>;

  return (
    <ScrollView>
      {entries.map((entry) => (
        <LeaderboardRow key={entry.profile.userId} entry={entry} />
      ))}
    </ScrollView>
  );
}
```

### Changer le tri

```tsx
// Trier par total
setSortBy('totalDone');

// Trier par série actuelle
setSortBy('currentStreak');

// Trier par meilleure série
setSortBy('bestStreak');
```

### Activer les mises à jour en temps réel

```tsx
useEffect(() => {
  const unsubscribe = enableRealtime();
  return () => unsubscribe();
}, []);
```

### Rafraîchir manuellement

```tsx
<Button onPress={refresh}>
  Rafraîchir
</Button>
```

## 🔄 Synchronisation automatique

Les stats publiques sont **automatiquement synchronisées** après chaque sauvegarde de progression dans `useProgressData`. Aucune action manuelle n'est nécessaire.

Le processus :
1. L'utilisateur enregistre son entraînement
2. Les données sont sauvegardées dans Firestore (`users/{userId}/training/{type}/...`)
3. Les stats publiques sont calculées et mises à jour dans `publicStats`
4. Le profil public est mis à jour dans `publicProfiles`
5. Le leaderboard est automatiquement mis à jour

## 📈 Statistiques calculées

Le système calcule automatiquement :

- **Total** : Somme de toutes les répétitions
- **Série actuelle** : Nombre de jours consécutifs avec objectif atteint (depuis aujourd'hui)
- **Meilleure série** : Plus longue série de jours consécutifs de tous les temps
- **Jours complétés** : Nombre total de jours avec au moins une répétition
- **Total semaine** : Somme des 7 derniers jours
- **Total mois** : Somme du mois en cours

## 🔒 Confidentialité

- Seules les **statistiques** sont publiques, pas les données détaillées jour par jour
- Les utilisateurs peuvent voir le classement mais pas la progression détaillée des autres
- Chaque utilisateur contrôle ses propres données via les règles de sécurité Firestore

## 🚀 Performance

### Optimisations implémentées

1. **Index composites** : Pour des requêtes rapides
2. **Limit des résultats** : Par défaut 50 entrées maximum
3. **Synchronisation en arrière-plan** : N'impacte pas l'expérience utilisateur
4. **Cache client** : Les données sont mises en cache par Firebase

### Limites

- Maximum 100 entrées par requête (configurable)
- Temps réel optionnel pour économiser les lectures
- Les stats sont calculées côté client (pas de Cloud Functions pour le moment)

## 🐛 Dépannage

### Le classement ne s'affiche pas
1. Vérifiez que les règles Firestore autorisent la lecture de `publicProfiles` et `publicStats`
2. Créez les index composites demandés par Firebase
3. Vérifiez la console pour les erreurs

### Mes stats n'apparaissent pas
1. Assurez-vous d'avoir enregistré au moins un entraînement
2. Vérifiez que votre profil utilisateur a un username (Clerk)
3. Vérifiez les logs dans la console : recherchez "Stats publiques synchronisées"

### Le rang ne se met pas à jour
1. Attendez quelques secondes (synchronisation en cours)
2. Rafraîchissez manuellement avec le bouton
3. Activez le mode temps réel si nécessaire

## 📝 TODO / Améliorations futures

- [ ] Ajouter des filtres par période (semaine, mois, année)
- [ ] Classement par pays/région
- [ ] Système de badges publics
- [ ] Cloud Functions pour le calcul des stats (performance)
- [ ] Cache côté serveur pour le top 10
- [ ] Notifications pour nouveau record personnel
- [ ] Page de profil public détaillée
