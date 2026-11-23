/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import ConfirmationModal from '../components/common/ConfirmationModal';

const ConfirmationContext = createContext(null);

export function ConfirmationProvider({ children }) {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: 'Please Confirm',
    message: 'Are you sure you want to perform this action?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
    icon: null,
    isLoading: false
  });

  const resolverRef = useRef(null);
  const onConfirmCallbackRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      onConfirmCallbackRef.current = options.onConfirm || null;

      setModalConfig({
        isOpen: true,
        title: options.title || 'Please Confirm',
        message: options.message || 'Are you sure you want to continue?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'danger',
        icon: options.icon || null,
        isLoading: false
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
    onConfirmCallbackRef.current = null;
  }, []);

  const handleConfirm = useCallback(async () => {
    const callback = onConfirmCallbackRef.current;
    if (callback) {
      try {
        setModalConfig((prev) => ({ ...prev, isLoading: true }));
        await callback();
      } catch (err) {
        console.error('Confirmation action failed:', err);
      } finally {
        setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false }));
        if (resolverRef.current) {
          resolverRef.current(true);
          resolverRef.current = null;
        }
        onConfirmCallbackRef.current = null;
      }
    } else {
      setModalConfig((prev) => ({ ...prev, isOpen: false, isLoading: false }));
      if (resolverRef.current) {
        resolverRef.current(true);
        resolverRef.current = null;
      }
    }
  }, []);

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        variant={modalConfig.variant}
        icon={modalConfig.icon}
        isLoading={modalConfig.isLoading}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
}
