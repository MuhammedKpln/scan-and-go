import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IAppStore {
  darkMode: boolean;
  dispatch: (state: IReducerPayload) => void;
}

interface IReducerPayload {
  type: IAppReducerType;
  args: Partial<IAppStore>;
}

export enum IAppReducerType {
  UpdateDarkMode,
  ToggleDarkMode,
  Initialize,
}

const reducer = (
  state: IAppStore,
  { type, args }: IReducerPayload
): Partial<IAppStore> => {
  switch (type) {
    case IAppReducerType.UpdateDarkMode:
      if (Capacitor.isNativePlatform()) {
        StatusBar.setStyle({
          style: args.darkMode ? Style.Dark : Style.Light,
        });
      }
      document.body.classList.toggle("dark", args.darkMode);

      return {
        darkMode: args.darkMode,
      };
    case IAppReducerType.ToggleDarkMode:
      if (Capacitor.isNativePlatform()) {
        StatusBar.setStyle({
          style: !state.darkMode ? Style.Dark : Style.Light,
        });
      }

      document.body.classList.toggle("dark", !state.darkMode);

      return {
        darkMode: !state.darkMode,
      };
    case IAppReducerType.Initialize:
      return {
        darkMode: args.darkMode,
      };
  }
};

export const useAppStore = create<IAppStore>()(
  persist(
    (set) => ({
      darkMode: false,
      dispatch: (args) => set((state) => reducer(state, args)),
    }),
    {
      name: "app",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
