import { appErrorHandler } from "@/services/app/error_handler.service";
import { fcmRegisteringService } from "@/services/app/firebase-push-notifications";
import { useAuthStore } from "@/stores/auth.store";
import { Capacitor } from "@capacitor/core";

export function useFcmToken() {
  const user = useAuthStore((state) => state.user);

  async function init() {
    if (!Capacitor.isNativePlatform()) return;

    await fcmRegisteringService.addListeners(user!.id);

    try {
      await fcmRegisteringService.registerNotifications();
    } catch (error) {
      if (error instanceof Error) {
        await appErrorHandler.logError(error);
      }
    }
  }

  async function deInit() {
    if (!Capacitor.isNativePlatform()) return;

    await fcmRegisteringService.removeAllListeners();
  }

  return { init, deInit };
}
