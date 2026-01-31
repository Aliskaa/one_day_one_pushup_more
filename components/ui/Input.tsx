import { styled, Input as TamaguiInput, InputProps as TamaguiInputProps, YStack, Text } from 'tamagui';
import { forwardRef } from 'react';

// ============================================================================
// BASE INPUT COMPONENT
// ============================================================================

export const BaseInput = styled(TamaguiInput, {
  name: 'BaseInput',
  
  // Defaults
  fontFamily: '$body',
  fontSize: 16,
  backgroundColor: '$surface',
  borderRadius: '$3',
  borderWidth: 2,
  borderColor: '$borderColor',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  color: '$color',
  
  // States
  focusStyle: {
    borderColor: '$borderColorFocus',
    backgroundColor: '$surface',
    outlineWidth: 0,
  },
  
  hoverStyle: {
    borderColor: '$borderColorHover',
  },
  
  variants: {
    size: {
      sm: {
        height: '$4',
        fontSize: 14,
        paddingHorizontal: '$3',
      },
      md: {
        height: '$5',
        fontSize: 16,
        paddingHorizontal: '$4',
      },
      lg: {
        height: '$6',
        fontSize: 18,
        paddingHorizontal: '$5',
      },
      xl: {
        height: '$7',
        fontSize: 20,
        paddingHorizontal: '$6',
      },
    },
    
    variant: {
      default: {
        backgroundColor: '$surface',
        borderColor: '$borderColor',
      },
      filled: {
        backgroundColor: '$backgroundSoft',
        borderColor: 'transparent',
      },
      outlined: {
        backgroundColor: 'transparent',
        borderColor: '$borderColor',
        borderWidth: 2,
      },
    },
    
    state: {
      error: {
        borderColor: '$danger',
      },
      success: {
        borderColor: '$success',
      },
      warning: {
        borderColor: '$warning',
      },
    },
    
    disabled: {
      true: {
        opacity: 0.5,
        backgroundColor: '$backgroundSoft',
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
    variant: 'default',
  },
});

// ============================================================================
// NUMBER INPUT (Spécialisé pour les répétitions)
// ============================================================================

export const NumberInput = styled(TamaguiInput, {
  name: 'NumberInput',
  textAlign: 'center',
  fontSize: 24,
  fontWeight: '700',
  height: '$6',
  fontFamily: '$body',
  backgroundColor: '$surface',
  borderRadius: '$3',
  borderWidth: 2,
  borderColor: '$borderColor',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  color: '$color',
  
  focusStyle: {
    borderColor: '$borderColorFocus',
    backgroundColor: '$surface',
    outlineWidth: 0,
  },
  
  variants: {
    hero: {
      true: {
        fontSize: 48,
        fontWeight: '800',
        height: '$8',
        borderWidth: 3,
        borderColor: '$primary',
        backgroundColor: '$primarySubtle',
        color: '$primary',
      },
    },
  } as const,
});

// ============================================================================
// INPUT CONTAINER (Avec label et helper)
// ============================================================================

export const InputContainer = styled(YStack, {
  name: 'InputContainer',
  gap: '$2',
  width: '100%',
});

export const InputLabel = styled(Text, {
  name: 'InputLabel',
  fontSize: 14,
  fontWeight: '600',
  fontFamily: '$body',
  color: '$color',
  marginBottom: '$1',
});

export const InputHelper = styled(Text, {
  name: 'InputHelper',
  fontSize: 12,
  fontFamily: '$body',
  color: '$colorMuted',
  marginTop: '$1',
  
  variants: {
    state: {
      error: {
        color: '$danger',
      },
      success: {
        color: '$success',
      },
      warning: {
        color: '$warning',
      },
    },
  } as const,
});

// ============================================================================
// SMART INPUT WITH LABEL
// ============================================================================

export interface InputProps extends TamaguiInputProps {
  label?: string;
  helper?: string;
  error?: string;
  success?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'outlined';
  state?: 'error' | 'success' | 'warning';
  fullWidth?: boolean;
}

export const Input = forwardRef<any, InputProps>((props, ref) => {
  const { 
    label, 
    helper, 
    error, 
    success,
    state: propState,
    ...rest 
  } = props;
  
  const state = error ? 'error' : success ? 'success' : propState;
  const helperText = error || success || helper;
  
  if (label || helperText) {
    return (
      <InputContainer>
        {label && <InputLabel>{label}</InputLabel>}
        <BaseInput ref={ref} state={state} {...rest} />
        {helperText && (
          <InputHelper state={state}>
            {helperText}
          </InputHelper>
        )}
      </InputContainer>
    );
  }
  
  return <BaseInput ref={ref} state={state} {...rest} />;
});

Input.displayName = 'Input';

// ============================================================================
// EXPORTS
// ============================================================================

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';
export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputState = 'error' | 'success' | 'warning';
