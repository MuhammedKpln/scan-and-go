import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  currentUser?: User;
};

type Actions = {
  setUser: (user: User) => void;
};

export const useAuthStore = create<State & Actions>()(
  immer((set) => ({
    currentUser: undefined,
    setUser(user) {
      set((state) => (state.currentUser = user));
    },
  }))
);
