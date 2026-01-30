// ============================================================================
// DESIGN SYSTEM - UI COMPONENTS BARREL EXPORT
// ============================================================================
// Centralise tous les exports des composants UI pour un import simplifié

// Buttons
export {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  SuccessButton,
  DangerButton,
  IconButton,
  BaseButton,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './Button';

// Cards
export {
  Card,
  BaseCard,
  StatCard,
  CompactCard,
  HeroCard,
  AchievementCard,
  WorkoutCard,
  type CardProps,
} from './Card';

// Badges
export {
  Badge,
  BaseBadge,
  BadgeText,
  StatusBadge,
  StreakBadge,
  AchievementBadge,
  LevelBadge,
  DotBadge,
  CountBadge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
  type BadgeStatus,
  type BadgeRarity,
} from './Badge';

// Modals
export {
  Modal,
  ConfirmModal,
  CelebrationModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  CelebrationContent,
  type ModalProps,
  type ConfirmModalProps,
  type CelebrationModalProps,
  type ModalSize,
} from './Modal';

// Fitness Components
export {
  QuickActions,
  QuickActionsContainer,
  QuickActionButton,
  type QuickActionsProps,
} from './QuickActions';

export {
  TodayObjective,
  ObjectiveContainer,
  ObjectiveLabel,
  ObjectiveNumber,
  ObjectiveTarget,
  ObjectiveProgress,
  type TodayObjectiveProps,
} from './TodayObjective';

export {
  StreakDisplay,
  StreakContainer,
  StreakContent,
  StreakNumber,
  StreakIcon,
  type StreakDisplayProps,
} from './StreakDisplay';
