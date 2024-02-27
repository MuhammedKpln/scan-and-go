import { useAuthStore } from "@/stores/auth.store";
import { SplashScreen } from "@capacitor/splash-screen";
import { useIonLoading } from "@ionic/react";
import { useEffect } from "react";

export function useSplashScreen() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [showLoading, hideLoading] = useIonLoading();

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hide();
      hideLoading();
    }
  }, [isInitialized]);

  return {
    showLoading,
    hideLoading,
  };
}
