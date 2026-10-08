'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Navigator = (href: string) => void;

type IntroContext = {
  /** False while a loader covers the page. Entrance animations wait for true. */
  ready: boolean;
  setReady: (ready: boolean) => void;
  /** Branded page transition, then client navigation. */
  navigate: Navigator;
  registerNavigator: (fn: Navigator) => () => void;
};

const Ctx = createContext<IntroContext | null>(null);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const navigator = useRef<Navigator | null>(null);

  // No loader was queued by the boot script (e.g. storage blocked): start at once.
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('intro-pending') && !html.classList.contains('page-pending')) setReady(true);
  }, []);

  const navigate = useCallback(
    (href: string) => (navigator.current ? navigator.current(href) : router.push(href)),
    [router],
  );

  const registerNavigator = useCallback((fn: Navigator) => {
    navigator.current = fn;
    return () => {
      if (navigator.current === fn) navigator.current = null;
    };
  }, []);

  const value = useMemo(() => ({ ready, setReady, navigate, registerNavigator }), [ready, navigate, registerNavigator]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useIntro() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useIntro must be used inside <IntroProvider>');
  return ctx;
}
