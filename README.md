# 💪 One Day One Pushup More

Une application mobile de suivi de progression pour vos pompes quotidiennes. Augmentez votre objectif chaque jour et suivez vos progrès !

## 📱 Description

**One Day One Pushup More** est une application mobile conçue pour vous aider à développer une habitude d'exercice progressive. L'idée est simple : chaque jour, vous devez faire au moins une pompe de plus que la veille. L'application vous permet de :

- ✅ Suivre vos performances quotidiennes
- 🎯 Visualiser vos objectifs progressifs
- 🏆 Débloquer des achievements
- 📊 Analyser vos statistiques
- 🌓 Profiter d'un thème clair/sombre fluide

## 🚀 Technologies utilisées

- **[Expo](https://expo.dev/)** - Framework React Native
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - Routing basé sur les fichiers
- **[Tamagui](https://tamagui.dev/)** - UI Kit avec animations natives
- **[Clerk](https://clerk.com/)** - Authentification complète
- **[Firebase](https://firebase.google.com/)** - Base de données et stockage cloud
- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Stockage local persistant
- **TypeScript** - Typage statique

## 📦 Installation

### Prérequis

- Node.js 18+ 
- Yarn 4.5+
- Expo CLI
- Un compte [Clerk](https://clerk.com/) pour l'authentification
- Un projet [Firebase](https://firebase.google.com/) configuré

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/Aliskaa/one_day_one_pushup_more.git
cd one_day_one_pushup_more

# Installer les dépendances
yarn install
```

### Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🏃 Démarrage

### Mode développement

```bash
# Démarrer Expo
yarn start

# Lancer sur Android
yarn android

# Lancer sur iOS
yarn ios

# Lancer sur le web
yarn web
```

### Build de production

```bash
# Build Android (preview)
npx eas build --profile preview --platform android

# Build iOS (preview)
npx eas build --profile preview --platform ios

# Build web optimisé
yarn build:web:optimized
```

## 📂 Structure du projet

```
one_day_one_pushup_more/
├── app/                      # Routes (Expo Router)
│   ├── (tabs)/              # Navigation par onglets
│   │   ├── index.tsx        # Dashboard principal
│   │   ├── days.tsx         # Liste des jours
│   │   ├── achievements.tsx # Achievements
│   │   └── settings.tsx     # Paramètres
│   ├── _layout.tsx          # Layout racine
│   └── sign-in.tsx          # Page de connexion
├── components/              # Composants réutilisables
│   ├── DayRow.tsx          # Composant d'une journée
│   ├── ThemeToggle.tsx     # Toggle du thème
│   ├── AuthGuard.tsx       # Protection des routes
│   └── ui/                 # Composants UI de base
├── contexts/               # Contextes React
│   ├── ThemeContext.tsx    # Gestion du thème
│   └── ModalContext.tsx    # Gestion des modales
├── hooks/                  # Hooks personnalisés
│   ├── useProgressData.ts  # Gestion des données
│   └── useAchievements.ts  # Système d'achievements
├── utils/                  # Utilitaires
│   ├── firebase.ts         # Configuration Firebase
│   ├── firebaseStorage.ts  # Stockage Firebase
│   └── cache.ts            # Cache Clerk
├── constants/              # Constantes
│   ├── achievements.ts     # Définitions des achievements
│   └── theme.ts            # Thème de l'app
├── types/                  # Types TypeScript
└── tamagui.config.ts       # Configuration Tamagui
```

## 🎨 Fonctionnalités principales

### Système de thème dynamique

L'application propose un thème clair/sombre avec :
- Transition fluide entre les thèmes
- Sauvegarde automatique de la préférence
- Support du thème système par défaut

### Suivi des jours

- **Affichage calendaire** avec code couleur :
  - 🟢 Vert : Objectif validé
  - 🟡 Jaune : En cours
  - 🔵 Bleu : Aujourd'hui
  - 🔴 Rouge : Jour manqué (non éditable)
  - ⚪ Gris : Jour futur (verrouillé)

- **Édition rapide** : Input numérique pour saisir vos performances
- **Barre de progression** : Visualisation de votre avancement

### Système d'achievements

Débloquez des récompenses basées sur :
- Nombre de jours consécutifs
- Total de pompes effectuées
- Milestones spécifiques

### Authentification sécurisée

- Sign-in avec Google via Clerk
- Protection des routes
- Gestion automatique des sessions

## 🛠️ Scripts disponibles

```bash
yarn start              # Démarrer Expo
yarn android           # Lancer sur Android
yarn ios              # Lancer sur iOS
yarn web              # Lancer sur web
yarn build:web        # Build web
yarn test             # Lancer les tests
yarn check:tamagui    # Vérifier les versions Tamagui
yarn upgrade:tamagui  # Mettre à jour Tamagui
```

## 🐛 Troubleshooting

### Erreur de configuration Tamagui

Si vous rencontrez l'erreur "Can't find Tamagui configuration" :

```bash
npx @tamagui/cli check
```

Assurez-vous que toutes les dépendances `@tamagui/*` sont à la même version.

### Problème de cache

```bash
yarn start -c  # Clear cache
```

### Build Android qui échoue

Vérifiez votre configuration EAS dans `eas.json` et assurez-vous que vos variables d'environnement sont correctement définies.

## 📝 Notes de développement

- Le projet utilise **Expo Router** pour la navigation basée sur les fichiers
- Les animations sont gérées par **Tamagui** avec des springs React Native
- Le thème est géré via un Context global avec persistance AsyncStorage
- Les données utilisateur sont stockées dans Firebase Firestore

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Kevin - Portfolio Project

---

**Note**: Ce projet fait partie d'un monorepo. Certaines dépendances (react, react-dom, react-native-web) ont été retirées et la configuration Metro a été adaptée en conséquence.
