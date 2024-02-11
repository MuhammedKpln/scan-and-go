import { useAuthContext } from "@/context/AuthContext";
import { fcmRegisteringService } from "@/services/app/firebase-push-notifications";
import { Capacitor } from "@capacitor/core";

export function useFcmToken() {
  const { user } = useAuthContext();

  async function init() {
    if (!Capacitor.isNativePlatform()) return;

    await fcmRegisteringService.addListeners(user!.uid);

    try {
      await fcmRegisteringService.registerNotifications();
    } catch (error) {
      console.error(error);
    }
  }

  async function deInit() {
    if (!Capacitor.isNativePlatform()) return;

    await fcmRegisteringService.removeAllListeners();
  }

  return { init, deInit };
}
