import React, { createContext, useContext, useState } from 'react';

interface SelectedRoutesContextValue {
  selectedRouteIds: string[];
  toggleRoute: (id: string) => void;
  isSelected: (id: string) => boolean;
}

const SelectedRoutesContext = createContext<SelectedRoutesContextValue | undefined>(undefined);

export const SelectedRoutesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);

  const toggleRoute = (id: string) => {
    setSelectedRouteIds(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const isSelected = (id: string) => selectedRouteIds.includes(id);

  return (
    <SelectedRoutesContext.Provider value={{ selectedRouteIds, toggleRoute, isSelected }}>
      {children}
    </SelectedRoutesContext.Provider>
  );
};

export const useSelectedRoutes = (): SelectedRoutesContextValue => {
  const ctx = useContext(SelectedRoutesContext);
  if (!ctx) throw new Error('useSelectedRoutes must be used within SelectedRoutesProvider');
  return ctx;
};
