import { useAuthStore } from "@/stores/auth.store";
import { SplashScreen } from "@capacitor/splash-screen";
import { useEffect } from "react";

export function useSplashScreen() {
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hide();
    }
  }, [isInitialized]);
}
