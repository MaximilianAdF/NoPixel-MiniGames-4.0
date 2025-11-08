'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GuideContextType {
  isOpen: boolean;
  width: number;
  setIsOpen: (isOpen: boolean) => void;
  setWidth: (width: number) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(380); // Default width

  return (
    <GuideContext.Provider value={{ isOpen, width, setIsOpen, setWidth }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
}
