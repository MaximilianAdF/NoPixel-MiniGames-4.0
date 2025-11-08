'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingContextType {
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isPageLoading: false,
  setPageLoading: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(false);

  const setPageLoading = useCallback((loading: boolean) => {
    setIsPageLoading(loading);
  }, []);

  return (
    <LoadingContext.Provider value={{ isPageLoading, setPageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
