/**
 * ============================================================================
 * DESIGN SYSTEM DOCUMENTATION
 * ============================================================================
 * Guide d'utilisation du Design System "One Day One Pushup More"
 * 
 * Ce fichier documente l'architecture et l'usage des composants UI
 */

# Design System - One Day One Pushup More

## 📁 Structure

```
components/ui/
├── Button.tsx        # Système de boutons complet
├── Card.tsx          # Cards pour tous usages
├── Badge.tsx         # Badges et indicateurs
├── Input.tsx         # Inputs et formulaires
├── Modal.tsx         # Modales et overlays
└── index.ts          # Barrel export
```

## 🎨 Palette de couleurs

### Couleurs principales
- **Blue (Pompes)**: #2563eb → Énergie, actions principales
- **Orange (Crunchs)**: #ea580c → Dynamisme, actions secondaires
- **Green (Success)**: #16a34a → Validation, objectif atteint
- **Amber (Streak)**: #f59e0b → Flammes, séries, motivation
- **Purple (Achievements)**: #9333ea → Accomplissements, rareté

### Tokens Tamagui
Tous les composants utilisent les tokens définis dans `tamagui.config.ts`:
- `$primary`, `$secondary`, `$success`, `$warning`, `$danger`
- `$streak`, `$achievement`, `$milestone`
- `$pushup`, `$crunch`
- `$completed`, `$missed`, `$pending`

## 🧩 Composants

### Buttons

```tsx
import { Button, PrimaryButton, IconButton } from '@/components/ui';

// Smart button avec variant
<Button variant="primary" size="lg" fullWidth>
  Valider
</Button>

// Bouton direct
<PrimaryButton onPress={handlePress}>
  Action
</PrimaryButton>

// Bouton icône
<IconButton variant="primary" size="md">
  <Icon />
</IconButton>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`, `success`, `danger`
**Sizes**: `sm`, `md`, `lg`, `xl`

### Cards

```tsx
import { Card, StatCard, HeroCard } from '@/components/ui';

// Card basique
<Card elevated padded="lg">
  <Text>Contenu</Text>
</Card>

// Card de statistique
<StatCard variant="streak" highlight>
  <H3>7 jours</H3>
  <Text>Série actuelle</Text>
</StatCard>

// Hero card (objectif principal)
<HeroCard>
  <H1>50</H1>
  <Text>pompes aujourd'hui</Text>
</HeroCard>
```

**Variants**: `default`, `muted`, `primary`, `success`, `warning`, `danger`
**Types**: `BaseCard`, `StatCard`, `CompactCard`, `HeroCard`, `AchievementCard`, `WorkoutCard`

### Badges

```tsx
import { Badge, StatusBadge, StreakBadge } from '@/components/ui';

// Badge simple
<Badge variant="success" size="md">
  Complété
</Badge>

// Badge de statut
<StatusBadge status="completed" />

// Badge de streak
<StreakBadge highlight size="lg">
  🔥 7 jours
</StreakBadge>
```

**Variants**: `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `muted`
**Status**: `completed`, `missed`, `pending`, `future`
**Rarity**: `common`, `rare`, `epic`, `legendary`

### Inputs

```tsx
import { Input, NumberInput } from '@/components/ui';

// Input avec label
<Input
  label="Répétitions"
  placeholder="Entrez le nombre"
  helper="Nombre de répétitions effectuées"
  error="Valeur invalide"
/>

// Input numérique hero
<NumberInput
  hero
  value={reps}
  onChangeText={setReps}
  keyboardType="number-pad"
/>
```

**Sizes**: `sm`, `md`, `lg`, `xl`
**Variants**: `default`, `filled`, `outlined`
**States**: `error`, `success`, `warning`

### Modals

```tsx
import { Modal, ConfirmModal, CelebrationModal } from '@/components/ui';

// Modale basique
<Modal
  visible={visible}
  onClose={handleClose}
  title="Titre"
  description="Description"
>
  <Text>Contenu</Text>
</Modal>

// Modale de confirmation
<ConfirmModal
  visible={visible}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Confirmer l'action ?"
  confirmText="Oui"
  cancelText="Non"
  confirmVariant="danger"
>
  <Text>Êtes-vous sûr ?</Text>
</ConfirmModal>

// Modale de célébration
<CelebrationModal
  visible={visible}
  onClose={handleClose}
  icon={<Trophy size={64} color="$achievement" />}
  message="🎉 Objectif atteint !"
  submessage="Vous avez validé votre journée"
/>
```

## 🎭 Animations

Les animations sont définies dans `tamagui.config.ts`:
- `quick`: Feedbacks rapides (boutons, validation)
- `smooth`: Transitions douces (navigation)
- `bouncy`: Célébrations
- `lazy`: Chargements
- `energetic`: Achievements

Usage:
```tsx
<YStack animation="bouncy" enterStyle={{ opacity: 0, scale: 0.9 }}>
  <Text>Contenu animé</Text>
</YStack>
```

## 📏 Espacements

Tokens d'espacement (multiples de 4):
- `$1` = 4px
- `$2` = 8px
- `$3` = 12px
- `$4` = 16px (default)
- `$5` = 20px
- `$6` = 24px
- `$8` = 40px

## 🔤 Typographie

### Tailles
- Hero (objectif du jour): `$9` (80px)
- Display (célébrations): `$8` (60px)
- Hero: `$7` (42px)
- Title: `$6` (28px)
- Subtitle: `$5` (22px)
- Body: `$4` (18px)
- Small: `$3` (15px)
- Caption: `$2` (13px)
- Micro: `$1` (11px)

### Poids
- Light: `300`
- Regular: `400`
- Medium: `500`
- Semibold: `600`
- Bold: `700`
- Extrabold: `800`

## 🌓 Thèmes

Le système supporte automatiquement light/dark mode via Tamagui.

Usage dans composants non-Tamagui:
```tsx
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/contexts/ThemeContext';

const { theme } = useAppTheme();
const colors = Colors[theme];

<View style={{ backgroundColor: colors.background }}>
```

## ✅ Best Practices

1. **Toujours utiliser les tokens** plutôt que les couleurs en dur
2. **Privilégier les composants typés** (`PrimaryButton` vs `Button variant="primary"`)
3. **Utiliser les variants sémantiques** (`variant="success"` pour validation)
4. **Respecter la hiérarchie visuelle** (Hero → Title → Body)
5. **Animations cohérentes** (quick pour actions, bouncy pour célébrations)
6. **Mobile-first** (touch targets >= 44px)
7. **Accessibilité** (contraste suffisant, textes lisibles)

## 🚀 Migration depuis l'ancien code

### Ancien
```tsx
<Card elevate p="$4" borderRadius="$6">
  <Button backgroundColor="#2563eb" onPress={...}>
```

### Nouveau
```tsx
<Card elevated padded="lg">
  <PrimaryButton onPress={...}>
```

## 📦 Imports recommandés

```tsx
// Import groupé depuis barrel
import {
  Button,
  Card,
  Badge,
  Input,
  Modal,
} from '@/components/ui';

// Import spécifique si besoin
import { StreakBadge } from '@/components/ui/Badge';
```
