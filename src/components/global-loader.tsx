"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

type GlobalLoaderCtx = {
  isLoading: boolean;
  start: () => void;
  stop: () => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderCtx | null>(null);

// ✅ Safe no-op fallback (prevents crashes if Provider is missing)
const noopCtx: GlobalLoaderCtx = {
  isLoading: false,
  start: () => {},
  stop: () => {},
};

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const activeLoadersRef = useRef(0);

  const start = useMemo(
    () => () => {
      activeLoadersRef.current += 1;
      if (activeLoadersRef.current === 1) setIsLoading(true);
    },
    []
  );

  const stop = useMemo(
    () => () => {
      if (activeLoadersRef.current > 0) {
        activeLoadersRef.current -= 1;
        if (activeLoadersRef.current === 0) setIsLoading(false);
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      isLoading,
      start,
      stop,
    }),
    [isLoading, start, stop]
  );

  // ✅ No spinner overlay anymore
  return (
    <GlobalLoaderContext.Provider value={value}>
      {children}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  // ✅ Never throw again — if Provider missing, return no-op
  return useContext(GlobalLoaderContext) ?? noopCtx;
}
