import { useContext } from 'react';
import { ToastContextType } from '../components/ToastProvider';
import { createContext } from 'react';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
