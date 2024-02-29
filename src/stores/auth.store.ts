import { queryClient } from "@/Providers";
import { IRegisterUserForm } from "@/models/user.model";
import { supabaseClient } from "@/services/supabase.service";
import { AuthTokenResponse, Subscription, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  isInitialized: boolean;
  user: User | undefined;
  isSignedIn: boolean;
  signingIn: boolean;
};

type Actions = {
  listenToAuthClient: () => { data: { subscription: Subscription } };
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthTokenResponse>;
  signUp: (data: IRegisterUserForm) => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<void>;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      isInitialized: false,
      isSignedIn: false,
      user: undefined,
      signingIn: false,
      async logout() {
        await supabaseClient.auth.signOut();
      },

      async signIn(email, password) {
        set((state) => !state.signingIn);
        const data = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        set((state) => !state.signingIn);

        return data;
      },

      async signUp(data) {
        const { error } = await supabaseClient.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
            },
          },
        });

        if (error) {
          throw error;
        }
      },

      async sendVerificationEmail(email) {
        const returnUrl = import.meta.env.PROD
          ? import.meta.env.VITE_SUPABASE_VERIFY_RETURN_URL
          : "http://localhost:8100";

        const { error } = await supabaseClient.auth.resend({
          email,
          type: "signup",
          options: {
            emailRedirectTo: returnUrl,
          },
        });

        if (error) {
          throw error;
        }
      },

      listenToAuthClient() {
        return supabaseClient.auth.onAuthStateChange((state, session) => {
          const updateState: Partial<State> = {};

          switch (state) {
            case "INITIAL_SESSION":
              updateState.isInitialized = true;

              if (session) {
                updateState.isSignedIn = true;
                updateState.user = session.user;
              }
              break;

            case "SIGNED_IN":
              updateState.isSignedIn = true;
              updateState.user = session!.user;
              break;

            case "SIGNED_OUT":
              updateState.isSignedIn = false;
              updateState.user = undefined;
              queryClient.clear();
              break;

            case "USER_UPDATED":
              updateState.user = session!.user;
              break;
          }

          set((s) => ({ ...s, ...updateState }));
        });
      },
    })),
    {
      name: "auth",
    }
  )
);
