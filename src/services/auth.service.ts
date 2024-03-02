import { queryClient } from "@/Providers";
import { IRegisterUserForm } from "@/models/user.model";
import { AuthStoreState, useAuthStore } from "@/stores/auth.store";
import { supabaseClient } from "./supabase.service";

class AuthService {
  async logout() {
    await supabaseClient.auth.signOut();
  }

  async signIn(email: string, password: string) {
    useAuthStore.setState((state) => ({ signingIn: !state.signingIn }));

    const data = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    useAuthStore.setState((state) => ({ signingIn: !state.signingIn }));
    return data;
  }
  async signUp(data: IRegisterUserForm) {
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
  }

  async sendVerificationEmail(email: string) {
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
  }

  listenToAuthClient() {
    return supabaseClient.auth.onAuthStateChange((state, session) => {
      const updateState: Partial<AuthStoreState> = {};

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

      useAuthStore.setState((state) => ({ ...state, ...updateState }));
    });
  }
}

export const authService = new AuthService();
