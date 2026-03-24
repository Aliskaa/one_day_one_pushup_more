# 🔐 Intégration Clerk + Firebase

## Problème actuel

Vous utilisez **Clerk** pour l'authentification, mais les **règles Firestore** vérifient `request.auth.uid` qui vient de **Firebase Auth**. Les deux systèmes ne sont pas connectés.

## ✅ Solution recommandée : Firebase Admin + Clerk Webhooks

Cette solution synchronise automatiquement les comptes Clerk avec Firebase Auth.

### 1. Backend avec Firebase Admin (Cloud Functions)

Créez une Cloud Function qui écoute les webhooks Clerk :

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const clerkWebhook = functions.https.onRequest(async (req, res) => {
  const { type, data } = req.body;

  if (type === 'user.created') {
    const { id, email_addresses, username, image_url } = data;
    
    try {
      // Créer l'utilisateur dans Firebase Auth avec l'ID Clerk
      await admin.auth().createUser({
        uid: id, // Utiliser l'ID Clerk comme UID Firebase
        email: email_addresses[0]?.email_address,
        displayName: username,
        photoURL: image_url,
      });

      console.log(`User ${id} créé dans Firebase Auth`);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      res.status(500).send('Error');
    }
  }

  res.status(200).send('OK');
});
```

### 2. Configuration Clerk Webhook

1. Allez dans le **Clerk Dashboard**
2. Webhooks → Add Endpoint
3. URL : `https://REGION-PROJECT.cloudfunctions.net/clerkWebhook`
4. Events : cochez `user.created`, `user.updated`, `user.deleted`

### 3. Générer des Custom Tokens

Quand l'utilisateur se connecte avec Clerk, générez un custom token Firebase :

```typescript
// services/clerkFirebaseAuth.ts
import { auth } from './firebase';
import { signInWithCustomToken } from 'firebase/auth';

export const signInFirebaseWithClerk = async (clerkUserId: string) => {
  try {
    // Appeler votre Cloud Function pour générer un custom token
    const response = await fetch('https://YOUR-FUNCTION-URL/generateCustomToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: clerkUserId }),
    });

    const { token } = await response.json();
    
    // Connecter l'utilisateur à Firebase avec ce token
    await signInWithCustomToken(auth, token);
    
    console.log('✅ Connecté à Firebase via Clerk');
  } catch (error) {
    console.error('❌ Erreur auth Firebase:', error);
  }
};
```

## 🚀 Solution alternative (Plus simple) : Rules sans auth

Si vous voulez éviter la complexité, utilisez les règles modifiées dans `firestore.rules` qui n'ont plus besoin de Firebase Auth.

**Avantages** :
- ✅ Fonctionne immédiatement
- ✅ Pas de backend nécessaire

**Inconvénients** :
- ⚠️ N'importe qui peut écrire dans n'importe quel document
- ⚠️ Vous devez valider côté client que l'userId correspond à l'utilisateur Clerk

### Sécurisation côté client

Ajoutez une validation dans les services :

```typescript
// services/leaderboard.ts
export const updatePublicProfile = async (
  userId: string,
  username: string,
  avatarUrl?: string
): Promise<void> => {
  // ⚠️ Vérifier que l'userId correspond à l'utilisateur Clerk connecté
  const { userId: clerkUserId } = useAuth(); // À passer en paramètre
  
  if (userId !== clerkUserId) {
    throw new Error('Unauthorized: userId mismatch');
  }

  // ... reste du code
};
```

## 📝 Prochaines étapes

**Option 1 (Recommandée)** : Déployez les Cloud Functions + Webhooks Clerk
**Option 2 (Quick fix)** : Utilisez les nouvelles règles + validation côté client

Quelle approche préférez-vous ?
