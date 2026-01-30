import { styled, ButtonProps as TamaguiButtonProps, Button as TamaguiButton } from 'tamagui';
import { forwardRef } from 'react';

// ============================================================================
// BASE BUTTON COMPONENT
// ============================================================================

export const BaseButton = styled(TamaguiButton, {
  name: 'BaseButton',
  
  // Defaults
  fontFamily: '$body',
  fontWeight: '600',
  borderRadius: '$4',
  cursor: 'pointer',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  
  // Interactions
  hoverStyle: {
    opacity: 0.9,
  },
  pressStyle: {
    opacity: 0.8,
    scale: 0.98,
  },
  focusStyle: {
    outlineWidth: 2,
    outlineColor: '$borderColorFocus',
    outlineStyle: 'solid',
  },
  
  disabledStyle: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  // Animation
  animation: 'quick',
  
  variants: {
    size: {
      sm: {
        height: '$4',
        paddingHorizontal: '$3',
        fontSize: 14,
      },
      md: {
        height: '$5',
        paddingHorizontal: '$4',
        fontSize: 16,
      },
      lg: {
        height: '$6',
        paddingHorizontal: '$5',
        fontSize: 18,
      },
      xl: {
        height: '$7',
        paddingHorizontal: '$6',
        fontSize: 20,
      },
    },
    
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
  },
});

// ============================================================================
// PRIMARY BUTTON (Actions principales)
// ============================================================================

export const PrimaryButton = styled(BaseButton, {
  name: 'PrimaryButton',
  backgroundColor: '$primary',
  color: 'white',
  borderWidth: 0,
  
  hoverStyle: {
    backgroundColor: '$primaryHover',
  },
  pressStyle: {
    backgroundColor: '$primaryPress',
    scale: 0.98,
  },
  focusStyle: {
    outlineColor: '$primary',
  },
});

// ============================================================================
// SECONDARY BUTTON (Actions secondaires)
// ============================================================================

export const SecondaryButton = styled(BaseButton, {
  name: 'SecondaryButton',
  backgroundColor: '$secondary',
  color: 'white',
  borderWidth: 0,
  
  hoverStyle: {
    backgroundColor: '$secondaryHover',
  },
  pressStyle: {
    backgroundColor: '$secondaryPress',
    scale: 0.98,
  },
});

// ============================================================================
// OUTLINE BUTTON (Actions tertiaires)
// ============================================================================

export const OutlineButton = styled(BaseButton, {
  name: 'OutlineButton',
  backgroundColor: 'transparent',
  color: '$primary',
  borderWidth: 2,
  borderColor: '$primary',
  
  hoverStyle: {
    backgroundColor: '$primarySubtle',
    borderColor: '$primaryHover',
  },
  pressStyle: {
    backgroundColor: '$primaryMuted',
    scale: 0.98,
  },
});

// ============================================================================
// GHOST BUTTON (Actions discrètes)
// ============================================================================

export const GhostButton = styled(BaseButton, {
  name: 'GhostButton',
  backgroundColor: 'transparent',
  color: '$color',
  borderWidth: 0,
  
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
    scale: 0.98,
  },
});

// ============================================================================
// SUCCESS BUTTON (Validation, objectif atteint)
// ============================================================================

export const SuccessButton = styled(BaseButton, {
  name: 'SuccessButton',
  backgroundColor: '$success',
  color: 'white',
  borderWidth: 0,
  
  hoverStyle: {
    backgroundColor: '$successHover',
  },
  pressStyle: {
    backgroundColor: '$successPress',
    scale: 0.98,
  },
});

// ============================================================================
// DANGER BUTTON (Actions destructives)
// ============================================================================

export const DangerButton = styled(BaseButton, {
  name: 'DangerButton',
  backgroundColor: '$danger',
  color: 'white',
  borderWidth: 0,
  
  hoverStyle: {
    backgroundColor: '$dangerHover',
  },
  pressStyle: {
    backgroundColor: '$dangerPress',
    scale: 0.98,
  },
});

// ============================================================================
// ICON BUTTON (Boutons icônes seuls)
// ============================================================================

export const IconButton = styled(BaseButton, {
  name: 'IconButton',
  backgroundColor: 'transparent',
  color: '$color',
  borderWidth: 0,
  padding: '$2',
  
  variants: {
    size: {
      sm: {
        width: '$4',
        height: '$4',
        padding: '$1',
      },
      md: {
        width: '$5',
        height: '$5',
        padding: '$2',
      },
      lg: {
        width: '$6',
        height: '$6',
        padding: '$2',
      },
    },
    variant: {
      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
      },
      solid: {
        backgroundColor: '$surface',
        hoverStyle: {
          backgroundColor: '$surfaceHover',
        },
      },
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
    variant: 'ghost',
  },
  
  hoverStyle: {
    opacity: 0.9,
  },
  pressStyle: {
    opacity: 0.7,
    scale: 0.95,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface CustomButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export type ButtonProps = Omit<TamaguiButtonProps, 'variant'> & CustomButtonProps;

// Smart Button component avec variant switcher
export const Button = forwardRef<any, ButtonProps>((props, ref) => {
  const { variant = 'primary', ...rest } = props;
  
  switch (variant) {
    case 'secondary':
      return <SecondaryButton ref={ref} {...rest} />;
    case 'outline':
      return <OutlineButton ref={ref} {...rest} />;
    case 'ghost':
      return <GhostButton ref={ref} {...rest} />;
    case 'success':
      return <SuccessButton ref={ref} {...rest} />;
    case 'danger':
      return <DangerButton ref={ref} {...rest} />;
    case 'primary':
    default:
      return <PrimaryButton ref={ref} {...rest} />;
  }
});

Button.displayName = 'Button';
