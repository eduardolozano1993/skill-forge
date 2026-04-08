"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type UiTheme = "light" | "dark";

type UiPreferencesContextValue = {
  sidebarCollapsed: boolean;
  theme: UiTheme;
  toggleSidebarCollapsed: () => void;
  toggleTheme: () => void;
};

const STORAGE_KEYS = {
  sidebarCollapsed: "skill-forge.ui.sidebar-collapsed",
  theme: "skill-forge.ui.theme",
} as const;

const UI_PREFERENCES_EVENT = "skill-forge:ui-preferences-changed";

const defaultPreferences = {
  sidebarCollapsed: false,
  theme: "light" as UiTheme,
};

let cachedPreferences = defaultPreferences;

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(
  null,
);

type UiPreferencesProviderProps = {
  children: ReactNode;
};

function readPreferences() {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);
  const nextPreferences = {
    sidebarCollapsed:
      window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true",
    theme:
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : defaultPreferences.theme,
  };

  if (
    cachedPreferences.sidebarCollapsed === nextPreferences.sidebarCollapsed &&
    cachedPreferences.theme === nextPreferences.theme
  ) {
    return cachedPreferences;
  }

  cachedPreferences = nextPreferences;

  return cachedPreferences;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      !event.key ||
      event.key === STORAGE_KEYS.sidebarCollapsed ||
      event.key === STORAGE_KEYS.theme
    ) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(UI_PREFERENCES_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(UI_PREFERENCES_EVENT, callback);
  };
}

function emitPreferencesChanged() {
  window.dispatchEvent(new Event(UI_PREFERENCES_EVENT));
}

export function UiPreferencesProvider({
  children,
}: UiPreferencesProviderProps) {
  const preferences = useSyncExternalStore(
    subscribe,
    readPreferences,
    () => defaultPreferences,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
  }, [preferences.theme]);

  const value = useMemo(
    () => ({
      sidebarCollapsed: preferences.sidebarCollapsed,
      theme: preferences.theme,
      toggleSidebarCollapsed: () => {
        const nextValue = !preferences.sidebarCollapsed;

        window.localStorage.setItem(
          STORAGE_KEYS.sidebarCollapsed,
          String(nextValue),
        );
        emitPreferencesChanged();
      },
      toggleTheme: () => {
        const nextTheme: UiTheme =
          preferences.theme === "light" ? "dark" : "light";

        window.localStorage.setItem(STORAGE_KEYS.theme, nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        emitPreferencesChanged();
      },
    }),
    [preferences],
  );

  return (
    <UiPreferencesContext.Provider value={value}>
      {children}
    </UiPreferencesContext.Provider>
  );
}

export function useUiPreferences() {
  const context = useContext(UiPreferencesContext);

  if (!context) {
    throw new Error(
      "useUiPreferences must be used inside UiPreferencesProvider",
    );
  }

  return context;
}
