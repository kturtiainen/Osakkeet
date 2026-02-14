import { useState, useCallback } from 'react';
import type { StatusMessage } from '../types';

let messageIdCounter = 0;

export function useStatus() {
  const [messages, setMessages] = useState<StatusMessage[]>([]);

  const showStatus = useCallback((type: StatusMessage['type'], message: string) => {
    const id = messageIdCounter++;
    const newMessage: StatusMessage = { type, message, id };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 5000);
  }, []);

  const removeMessage = useCallback((id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return {
    messages,
    showSuccess: useCallback((message: string) => showStatus('success', message), [showStatus]),
    showError: useCallback((message: string) => showStatus('error', message), [showStatus]),
    showWarning: useCallback((message: string) => showStatus('warning', message), [showStatus]),
    removeMessage,
  };
}
