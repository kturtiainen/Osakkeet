import { useState, useCallback } from 'react';

export interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'confirm';
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

export function useDialog() {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const showDialog = useCallback((options: DialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        ...options,
        isOpen: true,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialog((prev) => {
      if (prev.resolve) {
        prev.resolve(true);
      }
      return { ...prev, isOpen: false, resolve: undefined };
    });
  }, []);

  const handleCancel = useCallback(() => {
    setDialog((prev) => {
      if (prev.resolve) {
        prev.resolve(false);
      }
      return { ...prev, isOpen: false, resolve: undefined };
    });
  }, []);

  return {
    dialog,
    showDialog,
    handleConfirm,
    handleCancel,
  };
}
