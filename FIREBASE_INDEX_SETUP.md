# 🔥 Configuration Firebase - Index et Règles

## ⚠️ Erreur actuelle

Vous voyez cette erreur : **"The query requires an index"**

C'est normal ! Firebase a besoin d'index composites pour les requêtes avec `where` + `orderBy`.

## 🚀 Solution rapide (Console Firebase)

### Option 1 : Cliquer sur le lien dans l'erreur

1. Regardez l'erreur complète dans votre terminal/console
2. Firebase fournit un lien direct pour créer l'index automatiquement
3. Cliquez sur ce lien et confirmez la création

### Option 2 : Créer manuellement via la console

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Firestore Database** → **Index**
4. Cliquez sur **Create Index**
5. Créez ces 3 index :

#### Index 1 : Tri par Total
- Collection : `publicStats`
- Champs :
  - `trainingType` : Ascending
  - `totalDone` : Descending
- Query scopes : Collection

#### Index 2 : Tri par Série actuelle
- Collection : `publicStats`
- Champs :
  - `trainingType` : Ascending
  - `currentStreak` : Descending
- Query scopes : Collection

#### Index 3 : Tri par Record
- Collection : `publicStats`
- Champs :
  - `trainingType` : Ascending
  - `bestStreak` : Descending
- Query scopes : Collection

⏱️ **La création prend 1-2 minutes**

## 🔧 Solution avancée (Firebase CLI)

Si vous avez Firebase CLI installé :

```bash
# Installer Firebase CLI (si pas déjà fait)
npm install -g firebase-tools

# Se connecter
firebase login

# Initialiser Firebase dans le projet (si pas déjà fait)
firebase init firestore

# Déployer les index et règles
firebase deploy --only firestore
```

Les fichiers de configuration sont déjà créés :
- `firestore.indexes.json` : Configuration des index
- `firestore.rules` : Règles de sécurité

## 🔒 Règles de sécurité

Assurez-vous aussi de déployer/copier les règles depuis `firestore.rules` :

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
                      statsId.matches('^' + request.auth.uid + '_.*');
    }
    
    // Données utilisateur privées
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

**Pour appliquer via la console :**
1. Firebase Console → Firestore Database → Rules
2. Copiez-collez le contenu de `firestore.rules`
3. Publish

## ✅ Vérification

Après la création des index (attendez 1-2 minutes), testez :

1. Relancez votre app
2. Allez dans l'onglet Leaderboard
3. L'erreur devrait avoir disparu ! 🎉

## 📝 Note importante

Les index se créent **une seule fois**. Une fois configurés, ils fonctionneront pour toujours (même si vous ajoutez de nouvelles données).

## 🐛 Toujours des problèmes ?

Si après 5 minutes les index ne fonctionnent toujours pas :

1. Vérifiez le statut dans Firebase Console → Firestore → Index
2. Les index doivent être en état "Enabled" (vert)
3. Vérifiez que les règles de sécurité autorisent la lecture de `publicProfiles` et `publicStats`
