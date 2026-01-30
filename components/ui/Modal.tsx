import { styled, YStack, XStack, Text, H3, ScrollView } from 'tamagui';
import { Modal as RNModal, ModalProps as RNModalProps } from 'react-native';
import { forwardRef, ReactNode } from 'react';
import { PrimaryButton, GhostButton } from './Button';

// ============================================================================
// MODAL OVERLAY
// ============================================================================

export const ModalOverlay = styled(YStack, {
  name: 'ModalOverlay',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$4',
  zIndex: '$5',
});

// ============================================================================
// MODAL CONTENT
// ============================================================================

export const ModalContent = styled(YStack, {
  name: 'ModalContent',
  backgroundColor: '$surface',
  borderRadius: '$6',
  padding: '$6',
  maxWidth: 500,
  width: '90%',
  maxHeight: '80%',
  gap: '$4',
  
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 1,
  shadowRadius: 24,
  elevation: 10,
  
  animation: 'bouncy',
  
  variants: {
    size: {
      sm: {
        maxWidth: 400,
        padding: '$4',
      },
      md: {
        maxWidth: 500,
        padding: '$6',
      },
      lg: {
        maxWidth: 600,
        padding: '$8',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'md',
  },
});

// ============================================================================
// MODAL HEADER
// ============================================================================

export const ModalHeader = styled(YStack, {
  name: 'ModalHeader',
  gap: '$2',
  paddingBottom: '$4',
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
});

export const ModalTitle = styled(H3, {
  name: 'ModalTitle',
  fontSize: 24,
  fontWeight: '700',
  fontFamily: '$heading',
  color: '$color',
});

export const ModalDescription = styled(Text, {
  name: 'ModalDescription',
  fontSize: 14,
  color: '$colorMuted',
  fontFamily: '$body',
});

// ============================================================================
// MODAL BODY
// ============================================================================

export const ModalBody = styled(ScrollView, {
  name: 'ModalBody',
  flex: 1,
  paddingVertical: '$2',
  showsVerticalScrollIndicator: false,
});

// ============================================================================
// MODAL FOOTER
// ============================================================================

export const ModalFooter = styled(XStack, {
  name: 'ModalFooter',
  gap: '$3',
  paddingTop: '$4',
  borderTopWidth: 1,
  borderTopColor: '$borderColor',
  justifyContent: 'flex-end',
  
  variants: {
    layout: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column-reverse',
      },
    },
  } as const,
  
  defaultVariants: {
    layout: 'row',
  },
});

// ============================================================================
// SMART MODAL COMPONENT
// ============================================================================

export interface ModalProps extends Partial<RNModalProps> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  showCloseButton?: boolean;
}

export const Modal = forwardRef<any, ModalProps>((props, ref) => {
  const {
    visible,
    onClose,
    title,
    description,
    children,
    size = 'md',
    footer,
    showCloseButton = true,
    ...rest
  } = props;
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...rest}
    >
      <ModalOverlay onPress={onClose}>
        <ModalContent
          size={size}
          onPress={(e) => e.stopPropagation()}
          ref={ref}
        >
          {(title || description) && (
            <ModalHeader>
              {title && <ModalTitle>{title}</ModalTitle>}
              {description && <ModalDescription>{description}</ModalDescription>}
            </ModalHeader>
          )}
          
          <ModalBody contentContainerStyle={{ flexGrow: 1 }}>
            {children}
          </ModalBody>
          
          {(footer || showCloseButton) && (
            <ModalFooter>
              {footer}
              {showCloseButton && !footer && (
                <GhostButton onPress={onClose}>
                  Fermer
                </GhostButton>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </ModalOverlay>
    </RNModal>
  );
});

Modal.displayName = 'Modal';

// ============================================================================
// CONFIRM MODAL (Modale de confirmation)
// ============================================================================

export interface ConfirmModalProps extends Omit<ModalProps, 'footer'> {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

export const ConfirmModal = forwardRef<any, ConfirmModalProps>((props, ref) => {
  const {
    onConfirm,
    onClose,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    confirmVariant = 'primary',
    ...rest
  } = props;
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  const footer = (
    <>
      <GhostButton onPress={onClose}>
        {cancelText}
      </GhostButton>
      <PrimaryButton 
        onPress={handleConfirm}
        backgroundColor={confirmVariant === 'danger' ? '$danger' : '$primary'}
      >
        {confirmText}
      </PrimaryButton>
    </>
  );
  
  return (
    <Modal
      ref={ref}
      onClose={onClose}
      footer={footer}
      showCloseButton={false}
      {...rest}
    />
  );
});

ConfirmModal.displayName = 'ConfirmModal';

// ============================================================================
// CELEBRATION MODAL (Modale de célébration)
// ============================================================================

export const CelebrationContent = styled(YStack, {
  name: 'CelebrationContent',
  alignItems: 'center',
  gap: '$4',
  padding: '$6',
});

export interface CelebrationModalProps extends Partial<RNModalProps> {
  visible: boolean;
  onClose: () => void;
  icon?: ReactNode;
  message: string;
  submessage?: string;
  children?: ReactNode;
}

export const CelebrationModal = forwardRef<any, CelebrationModalProps>((props, ref) => {
  const { visible, onClose, icon, message, submessage, children, ...rest } = props;
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...rest}
    >
      <ModalOverlay onPress={onClose}>
        <ModalContent
          size="sm"
          onPress={(e) => e.stopPropagation()}
          ref={ref}
        >
          <CelebrationContent>
            {icon && <YStack marginBottom="$2">{icon}</YStack>}
            <H3 textAlign="center" fontSize={28} fontWeight="800" color="$color">
              {message}
            </H3>
            {submessage && (
              <Text textAlign="center" color="$colorMuted" fontSize={16}>
                {submessage}
              </Text>
            )}
            {children}
            <PrimaryButton onPress={onClose} fullWidth marginTop="$4">
              Continuer
            </PrimaryButton>
          </CelebrationContent>
        </ModalContent>
      </ModalOverlay>
    </RNModal>
  );
});

CelebrationModal.displayName = 'CelebrationModal';

// ============================================================================
// EXPORTS
// ============================================================================

export type ModalSize = 'sm' | 'md' | 'lg';
