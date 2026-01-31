import React, { useState } from 'react';
import { ScrollView, YStack, XStack, H2, H3, H4, Text, Separator } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  SuccessButton,
  DangerButton,
  IconButton,
  Card,
  StatCard,
  HeroCard,
  AchievementCard,
  WorkoutCard,
  Badge,
  StatusBadge,
  StreakBadge,
  AchievementBadge,
  LevelBadge,
  Modal,
  ConfirmModal,
  CelebrationModal,
} from '@/components/ui';
import { Trophy, Flame, Star, Target, Check, X, Award } from '@tamagui/lucide-icons';

/**
 * ÉCRAN DE DÉMONSTRATION DU DESIGN SYSTEM
 * Permet de tester visuellement tous les composants UI
 */
export default function DesignSystemScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack padding="$4" gap="$6" paddingBottom="$10">
            
            {/* HEADER */}
            <YStack gap="$2" alignItems="center" paddingTop="$4">
              <H2 fontFamily="$heading" fontWeight="800" color="$color">
                Design System
              </H2>
              <Text color="$colorMuted" textAlign="center">
                Test de tous les composants UI
              </Text>
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* SECTION: BUTTONS */}
            <YStack gap="$4">
              <H3 fontWeight="700" color="$color">Boutons</H3>
              
              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">VARIANTS</Text>
                <PrimaryButton>Primary Button</PrimaryButton>
                <SecondaryButton>Secondary Button</SecondaryButton>
                <OutlineButton>Outline Button</OutlineButton>
                <GhostButton>Ghost Button</GhostButton>
                <SuccessButton>Success Button</SuccessButton>
                <DangerButton>Danger Button</DangerButton>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">SIZES</Text>
                <XStack gap="$2" flexWrap="wrap">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="xl">X-Large</Button>
                </XStack>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">ICON BUTTONS</Text>
                <XStack gap="$2">
                  <IconButton variant="ghost">
                    <Star size={20} />
                  </IconButton>
                  <IconButton variant="solid">
                    <Trophy size={20} />
                  </IconButton>
                  <IconButton variant="primary">
                    <Flame size={20} />
                  </IconButton>
                </XStack>
              </YStack>

              <Button variant="primary" fullWidth disabled>
                Disabled Button
              </Button>
            </YStack>
            <Separator borderColor="$borderColor" />

            {/* SECTION: CARDS */}
            <YStack gap="$4">
              <H3 fontWeight="700" color="$color">Cards</H3>

              <Card elevated padded="lg">
                <Text fontWeight="600">Card élevée avec padding large</Text>
                <Text color="$colorMuted" fontSize={14}>
                  Exemple de card basique avec élévation et contenu texte.
                </Text>
              </Card>

              <StatCard variant="streak" highlight>
                <XStack alignItems="center" gap="$2">
                  <Flame size={24} color="$streak" />
                  <H2 fontWeight="800" color="$streak">7</H2>
                </XStack>
                <Text fontSize={14} color="$colorMuted">jours de série</Text>
              </StatCard>

              <StatCard variant="achievement">
                <XStack alignItems="center" gap="$2">
                  <Trophy size={24} color="$achievement" />
                  <H2 fontWeight="800" color="$achievement">12</H2>
                </XStack>
                <Text fontSize={14} color="$colorMuted">achievements débloqués</Text>
              </StatCard>

              <HeroCard>
                <Text fontSize={16} color="$colorMuted" fontWeight="600">OBJECTIF DU JOUR</Text>
                <H2 fontSize={64} fontWeight="800" color="$primary">50</H2>
                <Text fontSize={18} color="$color">pompes à réaliser</Text>
              </HeroCard>

              <WorkoutCard training="pushup" status="completed">
                <XStack justifyContent="space-between" alignItems="center">
                  <YStack gap="$1">
                    <Text fontWeight="600" fontSize={16}>Pompes</Text>
                    <Text color="$colorMuted" fontSize={14}>Objectif atteint</Text>
                  </YStack>
                  <Check size={32} color="$completed" />
                </XStack>
              </WorkoutCard>

              <WorkoutCard training="crunch" status="missed">
                <XStack justifyContent="space-between" alignItems="center">
                  <YStack gap="$1">
                    <Text fontWeight="600" fontSize={16}>Crunchs</Text>
                    <Text color="$colorMuted" fontSize={14}>Objectif manqué</Text>
                  </YStack>
                  <X size={32} color="$missed" />
                </XStack>
              </WorkoutCard>

              <AchievementCard unlocked rarity="legendary">
                <XStack gap="$3" alignItems="center">
                  <Trophy size={40} color="$amber500" />
                  <YStack flex={1} gap="$1">
                    <H4 fontWeight="700">Premier Century</H4>
                    <Text fontSize={14} color="$colorMuted">
                      Effectuer 100 répétitions en une journée
                    </Text>
                  </YStack>
                </XStack>
              </AchievementCard>

              <AchievementCard unlocked={false} rarity="rare">
                <XStack gap="$3" alignItems="center" opacity={0.6}>
                  <Award size={40} color="$blue500" />
                  <YStack flex={1} gap="$1">
                    <H4 fontWeight="700">Semaine Parfaite</H4>
                    <Text fontSize={14} color="$colorMuted">
                      7 jours consécutifs d'objectifs atteints
                    </Text>
                  </YStack>
                </XStack>
              </AchievementCard>
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* SECTION: BADGES */}
            <YStack gap="$4">
              <H3 fontWeight="700" color="$color">Badges</H3>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">VARIANTS</Text>
                <XStack gap="$2" flexWrap="wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </XStack>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">STATUS</Text>
                <XStack gap="$2" flexWrap="wrap">
                  <StatusBadge status="completed">
                    <Text color="white" fontSize={12} fontWeight="600">✓ Complété</Text>
                  </StatusBadge>
                  <StatusBadge status="missed">
                    <Text color="white" fontSize={12} fontWeight="600">✗ Manqué</Text>
                  </StatusBadge>
                  <StatusBadge status="pending">
                    <Text color="$color" fontSize={12} fontWeight="600">○ En attente</Text>
                  </StatusBadge>
                  <StatusBadge status="future">
                    <Text color="$color" fontSize={12} fontWeight="600">− Futur</Text>
                  </StatusBadge>
                </XStack>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">STREAK</Text>
                <XStack gap="$2" alignItems="center">
                  <StreakBadge size="lg" highlight>
                    <Flame size={20} color="white" />
                    <Text color="white" fontSize={16} fontWeight="700">7 jours</Text>
                  </StreakBadge>
                  <StreakBadge size="md">
                    <Flame size={16} color="$streak" />
                    <Text color="$streak" fontSize={14} fontWeight="600">5 jours</Text>
                  </StreakBadge>
                </XStack>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">ACHIEVEMENTS</Text>
                <XStack gap="$2" flexWrap="wrap">
                  <AchievementBadge unlocked rarity="legendary">
                    <Trophy size={16} color="white" />
                    <Text color="white" fontSize={12} fontWeight="600">Légendaire</Text>
                  </AchievementBadge>
                  <AchievementBadge unlocked rarity="epic">
                    <Star size={16} color="white" />
                    <Text color="white" fontSize={12} fontWeight="600">Épique</Text>
                  </AchievementBadge>
                  <AchievementBadge unlocked={false} rarity="rare">
                    <Award size={16} color="$blue500" />
                    <Text color="$blue500" fontSize={12} fontWeight="600">Rare</Text>
                  </AchievementBadge>
                </XStack>
              </YStack>

              <YStack gap="$3">
                <Text fontSize={12} color="$colorMuted" fontWeight="600">LEVEL</Text>
                <XStack gap="$2" alignItems="center">
                  <LevelBadge size="sm">
                    <Text color="white" fontSize={14} fontWeight="800">5</Text>
                  </LevelBadge>
                  <LevelBadge >
                    <Text color="white" fontSize={18} fontWeight="800">10</Text>
                  </LevelBadge>
                  <LevelBadge size="lg">
                    <Text color="white" fontSize={24} fontWeight="800">25</Text>
                  </LevelBadge>
                </XStack>
              </YStack>
            </YStack>

            <Separator borderColor="$borderColor" />

            {/* SECTION: MODALS */}
            <YStack gap="$4">
              <H3 fontWeight="700" color="$color">Modales</H3>

              <PrimaryButton onPress={() => setShowModal(true)}>
                Ouvrir Modal Simple
              </PrimaryButton>

              <SecondaryButton onPress={() => setShowConfirm(true)}>
                Ouvrir Confirmation
              </SecondaryButton>

              <SuccessButton onPress={() => setShowCelebration(true)}>
                Ouvrir Célébration
              </SuccessButton>

              {/* Modales */}
              <Modal
                visible={showModal}
                onClose={() => setShowModal(false)}
                title="Modal de démonstration"
                description="Ceci est une modal simple avec header et footer"
              >
                <YStack gap="$3" padding="$2">
                  <Text>Contenu de la modal. Vous pouvez y mettre n'importe quel composant.</Text>
                  <Card elevated>
                    <Text fontWeight="600">Card dans une modal</Text>
                  </Card>
                  <Text color="$colorMuted">
                    La modal se ferme en cliquant sur l'overlay ou le bouton Fermer.
                  </Text>
                </YStack>
              </Modal>

              <ConfirmModal
                visible={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => console.log('Confirmé !')}
                title="Confirmer l'action ?"
                description="Cette action nécessite une confirmation"
                confirmText="Oui, continuer"
                cancelText="Annuler"
                confirmVariant="danger"
              >
                <Text>Êtes-vous sûr de vouloir effectuer cette action ?</Text>
              </ConfirmModal>

              <CelebrationModal
                visible={showCelebration}
                onClose={() => setShowCelebration(false)}
                icon={<Trophy size={64} color="$achievement" />}
                message="🎉 Objectif atteint !"
                submessage="Vous avez validé votre séance quotidienne"
              />
            </YStack>

            {/* FOOTER INFO */}
            <YStack gap="$2" paddingTop="$6" alignItems="center">
              <Text fontSize={12} color="$colorMuted" textAlign="center">
                Design System - One Day One Pushup More
              </Text>
              <Text fontSize={10} color="$colorSubtle" textAlign="center">
                Basé sur Tamagui avec tokens fitness personnalisés
              </Text>
            </YStack>


          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  );
}
