import React, { useEffect, useState } from 'react';
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose(id);
        return undefined;
      }, 300); // Allow fade-out animation
    }, 5000); // Toast visible for 5 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const typeClasses = {
    success: 'bg-success-100 border-success-400 text-success-700 dark:bg-success-900 dark:border-success-700 dark:text-success-200',
    error: 'bg-error-100 border-error-400 text-error-700 dark:bg-error-900 dark:border-error-700 dark:text-error-200',
    info: 'bg-info-100 border-info-400 text-info-700 dark:bg-info-900 dark:border-info-700 dark:text-info-200',
    warning: 'bg-warning-100 border-warning-400 text-warning-700 dark:bg-warning-900 dark:border-warning-700 dark:text-warning-200',
  };

  const Icon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'info': return <Info size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      default: return null;
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 mb-3 rounded-lg border-l-4 shadow-md transition-opacity duration-300 ${typeClasses[type]} ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-2"><Icon /></span>
        <span>{message}</span>
      </div>
      <button onClick={() => { onClose(id); }} className="ml-4 text-current hover:opacity-75 focus:outline-none">
        <XCircle size={18} />
      </button>
    </div>
  );
};

export default Toast;
