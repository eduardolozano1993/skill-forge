"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
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

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(
  null,
);

type UiPreferencesProviderProps = {
  children: ReactNode;
};

export function UiPreferencesProvider({
  children,
}: UiPreferencesProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<UiTheme>("light");

  useEffect(() => {
    const storedSidebarCollapsed = window.localStorage.getItem(
      STORAGE_KEYS.sidebarCollapsed,
    );
    const storedTheme = window.localStorage.getItem(STORAGE_KEYS.theme);

    if (storedSidebarCollapsed === "true") {
      setSidebarCollapsed(true);
    }

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.sidebarCollapsed,
      String(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      theme,
      toggleSidebarCollapsed: () => setSidebarCollapsed((current) => !current),
      toggleTheme: () =>
        setTheme((current) => (current === "light" ? "dark" : "light")),
    }),
    [sidebarCollapsed, theme],
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
