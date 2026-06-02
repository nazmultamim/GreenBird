"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loader from "./lodaer";

const NavigationLoaderContext = createContext(null);

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isInternalHref(href) {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  return href.startsWith("/");
}

export function NavigationLoaderProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const stopLoading = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setLoading(false);
  };

  const startLoading = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
      timerRef.current = null;
    }, 8000);
  };

  const navigate = (href, options) => {
    if (!isInternalHref(href)) return;

    startLoading();
    router.push(href, options);
  };

  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClickCapture = (event) => {
      if (loading || isModifiedClick(event)) return;

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest("a[href]");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (!isInternalHref(href)) return;

        const pathnameMatches = anchor.target === "_self" || !anchor.target;
        if (!pathnameMatches || anchor.hasAttribute("download")) return;

        startLoading();
        return;
      }

      const navButton = target?.closest("[data-nav-href]");
      if (navButton) {
        const href = navButton.getAttribute("data-nav-href");
        if (!isInternalHref(href)) return;
        startLoading();
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [loading]);

  const value = useMemo(
    () => ({
      loading,
      startLoading,
      stopLoading,
      navigate,
    }),
    [loading]
  );

  return (
    <NavigationLoaderContext.Provider value={value}>
      {children}
      {loading && <Loader label="Loading your next page" />}
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);

  if (!context) {
    throw new Error("useNavigationLoader must be used within NavigationLoaderProvider");
  }

  return context;
}
