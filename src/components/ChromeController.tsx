"use client";
import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type Ctx = {
  hideChrome: boolean;
  setHideChrome: (v: boolean) => void;
};
const ChromeCtx = createContext<Ctx | null>(null);

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [hideChrome, setHideChrome] = useState(false);
  const value = useMemo(() => ({ hideChrome, setHideChrome }), [hideChrome]);
  return <ChromeCtx.Provider value={value}>{children}</ChromeCtx.Provider>;
}

export function useChrome() {
  const ctx = useContext(ChromeCtx);
  if (!ctx) throw new Error("useChrome must be used within <ChromeProvider>");
  return ctx;
}

/** Gate component to conditionally render header/footer */
export function ChromeGate({ children }: { children: ReactNode }) {
  const { hideChrome } = useChrome();
  if (hideChrome) return null;
  return <>{children}</>;
}
