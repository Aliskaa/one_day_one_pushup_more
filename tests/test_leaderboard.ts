/**
 * Script de test pour vérifier le leaderboard
 * Usage: npx tsx tests/test_leaderboard.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getLeaderboard } from '../services/leaderboard';
import { LeaderboardFilters } from '../types/leaderboard';

// Configuration Firebase (depuis vos variables d'environnement)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testLeaderboard() {
  console.log('🧪 Test du leaderboard...\n');

  const filters: LeaderboardFilters = {
    trainingType: 'pushup',
    sortBy: 'totalDone',
    period: 'allTime',
    limit: 10
  };

  try {
    console.log('📊 Récupération du leaderboard avec filtres:', filters);
    const entries = await getLeaderboard(filters);
    
    console.log(`\n✅ Succès! ${entries.length} entrées trouvées\n`);
    
    if (entries.length > 0) {
      console.log('🏆 Top 3:');
      entries.slice(0, 3).forEach((entry, index) => {
        const medal = ['🥇', '🥈', '🥉'][index] || '🏅';
        console.log(`${medal} #${entry.rank} ${entry.profile.username}: ${entry.stats.totalDone} total, streak ${entry.stats.currentStreak}j`);
      });
    } else {
      console.log('⚠️ Aucune donnée dans le leaderboard');
      console.log('💡 Assurez-vous qu\'au moins un utilisateur a enregistré un entraînement');
    }

    console.log('\n✨ Test réussi! Les index Firebase sont correctement configurés.');
    
  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message);
    
    if (error.message.includes('index')) {
      console.error('\n🔥 INDEX MANQUANT!');
      console.error('\n📝 Solution:');
      console.error('1. Allez sur https://console.firebase.google.com/');
      console.error('2. Sélectionnez votre projet');
      console.error('3. Firestore Database → Index');
      console.error('4. Créez les index (voir FIREBASE_INDEX_SETUP.md)');
      console.error('\nOu cherchez un lien direct dans le message d\'erreur ci-dessus ⬆️');
    }
    
    process.exit(1);
  }
}

// Exécuter le test
testLeaderboard()
  .then(() => {
    console.log('\n✅ Tous les tests sont passés!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test échoué:', error);
    process.exit(1);
  });
