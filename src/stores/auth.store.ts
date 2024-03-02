import { PreferencesStorage } from "@/helpers/storage_wrapper";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AuthStoreState = {
  isInitialized: boolean;
  user: User | undefined;
  isSignedIn: boolean;
  signingIn: boolean;
};

type Action = {
  updateUser: (state: Pick<AuthStoreState, "isSignedIn" | "user">) => void;
};

export const useAuthStore = create<AuthStoreState & Action>()(
  persist(
    immer((set) => ({
      isInitialized: false,
      isSignedIn: false,
      user: undefined,
      signingIn: false,
      updateUser(state) {
        set((s) => {
          s.user = state.user;
          s.isSignedIn = state.isSignedIn;
        });
      },
    })),
    {
      name: "auth",
      storage: createJSONStorage(() => PreferencesStorage),
    }
  )
);
