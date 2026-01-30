import { styled, XStack, YStack, Text } from 'tamagui';
import { forwardRef } from 'react';
import { PrimaryButton, SuccessButton } from './Button';

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
    currentValue: number;
    targetValue: number;
    disabled?: boolean;
}

export const QuickActions = forwardRef<any, QuickActionsProps>((props, ref) => {
    const { onIncrement, onComplete, currentValue, targetValue, disabled = false } = props;

    const isCompleted = currentValue >= targetValue;

    return (
        <QuickActionsContainer ref={ref}>
            <QuickActionButton
                flex={1}
                variant="increment"
                onPress={() => onIncrement(1)}
                disabled={disabled}
            >
                <Text fontSize={18} fontWeight="700" color="white">+1</Text>
            </QuickActionButton>

            <QuickActionButton
                flex={1}
                variant="increment"
                onPress={() => onIncrement(10)}
                disabled={disabled}
            >
                <Text fontSize={18} fontWeight="700" color="white">+10</Text>
            </QuickActionButton>

            <QuickActionButton
                flex={1}
                variant="increment"
                onPress={() => onIncrement(25)}
                disabled={disabled}
            >
                <Text fontSize={18} fontWeight="700" color="white">+25</Text>
            </QuickActionButton>

            {isCompleted ? (
                <SuccessButton
                    flex={1}
                    minWidth={120}
                    onPress={onComplete}
                    disabled={disabled}
                >
                    <Text fontSize={16} fontWeight="700" color="white">✓ Fait !</Text>
                </SuccessButton>
            ) : (
                <QuickActionButton
                    flex={1}
                    variant="complete"
                    onPress={onComplete}
                    disabled={disabled}
                >
                    <Text fontSize={16} fontWeight="700" color="white">Objectif</Text>
                </QuickActionButton>
            )}
        </QuickActionsContainer>
    );
});

QuickActions.displayName = 'QuickActions';
