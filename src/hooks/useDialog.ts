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
    if (dialog.resolve) {
      dialog.resolve(true);
    }
    setDialog({ ...dialog, isOpen: false });
  }, [dialog]);

  const handleCancel = useCallback(() => {
    if (dialog.resolve) {
      dialog.resolve(false);
    }
    setDialog({ ...dialog, isOpen: false });
  }, [dialog]);

  return {
    dialog,
    showDialog,
    handleConfirm,
    handleCancel,
  };
}
