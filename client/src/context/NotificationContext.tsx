import React, { createContext, useRef, useContext } from 'react';
import { Toast } from 'primereact/toast';
import type { ReactNode } from 'react';

type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

interface NotificationContextType {
  showNotification: (severity: ToastSeverity, summary: string, detail: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const toast = useRef<Toast>(null);

  const showNotification = (severity: ToastSeverity, summary:string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <Toast ref={toast} />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
