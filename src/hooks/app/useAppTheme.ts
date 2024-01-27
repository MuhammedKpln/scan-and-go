import { IAppReducerType, useAppStore } from "@/stores/app.store";
import { useCallback, useEffect } from "react";

export function useAppTheme() {
  const dispatchAppStore = useAppStore((state) => state.dispatch);

  const toggleDarkTheme = useCallback((shouldAdd: boolean) => {
    dispatchAppStore({
      type: IAppReducerType.UpdateDarkMode,
      args: {
        darkMode: shouldAdd,
      },
    });
  }, []);

  const initializeDarkTheme = useCallback((isDark: boolean) => {
    toggleDarkTheme(isDark);
  }, []);

  useEffect(() => {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener("change", (mediaQuery) =>
      toggleDarkTheme(mediaQuery.matches)
    );
  }, []);
}
