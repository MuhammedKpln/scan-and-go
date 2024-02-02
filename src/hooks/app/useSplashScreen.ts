import { useAuthContext } from "@/context/AuthContext";
import { SplashScreen } from "@capacitor/splash-screen";
import { useEffect } from "react";

export function useSplashScreen() {
  const authContext = useAuthContext();

  useEffect(() => {
    if (authContext.isInitialized) {
      SplashScreen.hide();
    }
  }, [authContext.isInitialized]);
}
