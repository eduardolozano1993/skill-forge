"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { MockCourseContentOverride } from "@/lib/mock-courses";

type MockCourseOverridesContextValue = {
  overrides: Map<number, string>;
  setCourseContent: (courseId: number, content: string) => void;
};

const STORAGE_KEY = "skill-forge:mock-course-content-overrides";

const MockCourseOverridesContext = createContext<MockCourseOverridesContextValue | null>(null);

type MockCourseOverridesProviderProps = {
  children: ReactNode;
};

export function MockCourseOverridesProvider({ children }: MockCourseOverridesProviderProps) {
  const [overrides, setOverrides] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        return;
      }

      const parsedValue = JSON.parse(storedValue) as MockCourseContentOverride[];
      setOverrides(new Map(parsedValue.map((item) => [item.courseId, item.content])));
    } catch {
      setOverrides(new Map());
    }
  }, []);

  const value = useMemo<MockCourseOverridesContextValue>(
    () => ({
      overrides,
      setCourseContent: (courseId, content) => {
        setOverrides((currentOverrides) => {
          const nextOverrides = new Map(currentOverrides);
          nextOverrides.set(courseId, content);

          const serializedOverrides = Array.from(nextOverrides.entries()).map(
            ([storedCourseId, storedContent]) => ({
              courseId: storedCourseId,
              content: storedContent,
            }),
          );

          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedOverrides));

          return nextOverrides;
        });
      },
    }),
    [overrides],
  );

  return (
    <MockCourseOverridesContext.Provider value={value}>
      {children}
    </MockCourseOverridesContext.Provider>
  );
}

export function useMockCourseOverrides() {
  const context = useContext(MockCourseOverridesContext);

  if (!context) {
    throw new Error("useMockCourseOverrides must be used within MockCourseOverridesProvider.");
  }

  return context;
}
