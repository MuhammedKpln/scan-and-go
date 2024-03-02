import { PreferencesStorage } from "@/helpers/storage_wrapper";
import { IUser } from "@/models/user.model";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type AuthStoreState = {
  isInitialized: boolean;
  user: User | undefined;
  isSignedIn: boolean;
  signingIn: boolean;
  profile: IUser | undefined;
};

type Action = {
  updateUser: (state: Pick<AuthStoreState, "isSignedIn" | "user">) => void;
  updateProfile: (state: AuthStoreState["profile"]) => void;
};

export const useAuthStore = create<AuthStoreState & Action>()(
  persist(
    immer((set) => ({
      isInitialized: false,
      isSignedIn: false,
      user: undefined,
      signingIn: false,
      profile: undefined,
      updateProfile(state) {
        set((s) => {
          s.profile = state;
        });
      },
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
