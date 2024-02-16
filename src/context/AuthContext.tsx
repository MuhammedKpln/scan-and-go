import { IRegisterUserForm } from "@/models/user.model";
import { supabaseClient } from "@/services/supabase.service";
import {
  AuthResponse,
  AuthTokenResponsePassword,
  User,
} from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthContextProps {
  isInitialized: boolean;
  user: User | undefined;
  isSignedIn: boolean;
  logout: () => Promise<void>;
  signIn: (
    email: string,
    password: string
  ) => Promise<AuthTokenResponsePassword>;
  signUp: (data: IRegisterUserForm) => Promise<AuthResponse["data"]>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);
  if (value === null) throw Error("No context, add <AuthContextProvider>");
  return value;
};

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | undefined>();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const client = useQueryClient();

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((state, session) => {
      switch (state) {
        case "INITIAL_SESSION":
          setIsInitialized(true);

          if (session) {
            setIsSignedIn(true);
            setUser(session.user);
          }
          break;

        case "SIGNED_IN":
          setUser(session!.user);
          setIsSignedIn(true);
          break;

        case "SIGNED_OUT":
          setUser(undefined);
          setIsSignedIn(true);
          client.clear();
          break;

        case "USER_UPDATED":
          setUser(session!.user);
          break;
      }
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    return data;
  }, []);

  const signUp = useCallback(async (signData: IRegisterUserForm) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email: signData.email,
      password: signData.password,
      options: {
        data: {
          firstName: signData.firstName,
          lastName: signData.lastName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabaseClient.auth.signOut();
  }, []);

  const sendVerificationEmail = useCallback(async (email: string) => {
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

    if (!error) {
      return true;
    }

    return false;
  }, []);

  const value = useMemo(() => {
    return {
      user,
      isSignedIn,
      logout,
      isInitialized,
      signIn,
      signUp,
      sendVerificationEmail,
    };
  }, [user, isSignedIn, logout, isInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
