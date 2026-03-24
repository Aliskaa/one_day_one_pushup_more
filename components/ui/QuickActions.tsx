import { styled, XStack, YStack, Text, Separator } from 'tamagui';
import { forwardRef, useMemo, useState } from 'react';
import { PrimaryButton, SuccessButton, GhostButton } from './Button';
import { Modal } from './Modal';
import * as Haptics from 'expo-haptics';

// ============================================================================
// QUICK ACTIONS - Boutons rapides pour validation
// ============================================================================

export const QuickActionsContainer = styled(XStack, {
    name: 'QuickActionsContainer',
    gap: '$3',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'wrap',
});

export const QuickActionButton = styled(PrimaryButton, {
    name: 'QuickActionButton',
    minWidth: 80,
    height: '$6',
    paddingHorizontal: '$4',
    borderRadius: '$4',
    
    // Removed animation property to fix web compatibility
    pressStyle: {
        opacity: 0.8,
    },
    hoverStyle: {
        opacity: 0.9,
    },

    variants: {
        variant: {
            increment: {
                backgroundColor: '$primary',
            },
            complete: {
                backgroundColor: '$success',
                minWidth: 120,
            },
        },
    } as const,

    defaultVariants: {
        variant: 'increment',
    },
});

export interface QuickActionsProps {
    onIncrement: (amount: number) => void;
    onComplete: () => void;
    onUseBank?: () => void;
    /** Réserve actuelle (pour la modale banque) */
    surplusReserve?: number;
    /** Libellé unité : pompes, crunchs, etc. */
    repLabel?: string;
    currentValue: number;
    targetValue: number;
    bankAvailable?: boolean;
    disabled?: boolean;
}

export const QuickActions = forwardRef<any, QuickActionsProps>((props, ref) => {
    const {
        onIncrement,
        onComplete,
        onUseBank,
        surplusReserve = 0,
        repLabel = 'répétitions',
        currentValue,
        targetValue,
        bankAvailable = false,
        disabled = false,
    } = props;

    const [bankModalOpen, setBankModalOpen] = useState(false);

    const bankPreview = useMemo(() => {
        const shortfall = Math.max(0, targetValue - currentValue);
        const willUse = Math.min(shortfall, surplusReserve);
        const after = Math.max(0, surplusReserve - willUse);
        return { shortfall, willUse, after };
    }, [currentValue, targetValue, surplusReserve]);

    const isCompleted = currentValue >= targetValue;

    const handleIncrement = (amount: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onIncrement(amount);
    };

    const handleComplete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
    };

    return (
        <>
        <QuickActionsContainer ref={ref}>
            <QuickActionButton
                flex={1}
                variant="increment"
                onPress={() => handleIncrement(1)}
                disabled={disabled}
            >
                <Text fontSize={18} fontWeight="700" color="white">+1</Text>
            </QuickActionButton>

            <QuickActionButton
                flex={1}
                variant="increment"
                onPress={() => handleIncrement(10)}
                disabled={disabled}
            >
                <Text fontSize={18} fontWeight="700" color="white">+10</Text>
            </QuickActionButton>

            <QuickActionButton
                flex={1}
                variant="increment"
                onPress={() => handleIncrement(25)}
                disabled={disabled}
            >
                <Text fontSize={18} fontWeight="700" color="white">+25</Text>
            </QuickActionButton>

            {isCompleted ? (
                <SuccessButton
                    flex={1}
                    minWidth={120}
                    onPress={handleComplete}
                    disabled={disabled}
                    pressStyle={{ opacity: 0.8 }}
                >
                    <Text fontSize={16} fontWeight="700" color="white">✓ Fait !</Text>
                </SuccessButton>
            ) : (
                <>
                    <QuickActionButton
                        flex={1}
                        variant="complete"
                        onPress={handleComplete}
                        disabled={disabled}
                    >
                        <Text fontSize={16} fontWeight="700" color="white">Objectif</Text>
                    </QuickActionButton>
                    {onUseBank && bankAvailable ? (
                        <QuickActionButton
                            flex={1}
                            variant="increment"
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setBankModalOpen(true);
                            }}
                            disabled={disabled}
                            backgroundColor="$orange9"
                        >
                            <Text fontSize={14} fontWeight="700" color="white">Banque</Text>
                        </QuickActionButton>
                    ) : null}
                </>
            )}
        </QuickActionsContainer>

        {onUseBank && bankAvailable ? (
            <Modal
                visible={bankModalOpen}
                onClose={() => setBankModalOpen(false)}
                size="sm"
                showCloseButton={false}
                footer={
                    <>
                        <GhostButton onPress={() => setBankModalOpen(false)}>Annuler</GhostButton>
                        <PrimaryButton
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                onUseBank();
                                setBankModalOpen(false);
                            }}
                        >
                            Valider
                        </PrimaryButton>
                    </>
                }
            >
                <YStack gap="$3" paddingVertical="$1">
                    <YStack gap="$1.5">
                        <Text fontSize={16} fontWeight="600" color="$color" fontFamily="$body">
                            Compléter avec la réserve
                        </Text>
                        <Text fontSize={13} lineHeight={18} color="$colorMuted">
                            {repLabel} pour atteindre l’objectif du jour.
                        </Text>
                    </YStack>
                    <YStack
                        gap="$2"
                        padding="$3"
                        borderRadius="$4"
                        backgroundColor="$backgroundHover"
                        borderWidth={1}
                        borderColor="$borderColor"
                    >
                        <XStack justifyContent="space-between" alignItems="center" gap="$3">
                            <Text fontSize={14} color="$colorMuted">
                                Réserve actuelle
                            </Text>
                            <Text fontSize={17} fontWeight="700" color="$color">
                                {surplusReserve.toLocaleString()}
                            </Text>
                        </XStack>
                        <Separator borderColor="$borderColor" />
                        <XStack justifyContent="space-between" alignItems="center" gap="$3">
                            <Text fontSize={14} color="$colorMuted">
                                Prélevé
                            </Text>
                            <Text fontSize={17} fontWeight="700" color="$orange10">
                                −{bankPreview.willUse.toLocaleString()}
                            </Text>
                        </XStack>
                        <Separator borderColor="$borderColor" />
                        <XStack justifyContent="space-between" alignItems="center" gap="$3">
                            <Text fontSize={14} color="$colorMuted">
                                Reste en banque
                            </Text>
                            <Text fontSize={17} fontWeight="700" color="$success">
                                {bankPreview.after.toLocaleString()}
                            </Text>
                        </XStack>
                    </YStack>
                </YStack>
            </Modal>
        ) : null}
        </>
    );
});

QuickActions.displayName = 'QuickActions';
