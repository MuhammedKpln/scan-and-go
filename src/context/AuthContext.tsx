import { auth } from "@/services/firebase.service";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthContextProps {
  isInitialized: boolean;
  user: User | null;
  isSignedIn: boolean;
  isLoadingUser: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);
  if (value === null) throw Error("No context, add <AuthContextProvider>");
  return value;
};

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoadingUser(false);

      if (user) {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
      }

      setIsInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const logout = useMemo(() => async () => await signOut(auth), []);

  const value = useMemo(() => {
    return {
      user,
      isLoadingUser,
      isSignedIn,
      logout,
      isInitialized,
    };
  }, [user, isLoadingUser, isSignedIn, logout, isInitialized]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
