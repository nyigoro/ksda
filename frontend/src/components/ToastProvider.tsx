import React, { useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toast from './Toast';
import { ToastContext, ToastMessage } from '../hooks/useToast';

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id: string = uuidv4();
    setToasts((prevToasts: ToastMessage[]) => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts: ToastMessage[]) => prevToasts.filter((toast: ToastMessage) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 w-80">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};