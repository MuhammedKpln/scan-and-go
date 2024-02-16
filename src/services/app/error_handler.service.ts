import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import { Capacitor } from "@capacitor/core";

class AppErrorHandler {
  async logError(message: string) {
    if (!Capacitor.isNativePlatform()) {
      console.error(message);

      return;
    }

    await FirebaseCrashlytics.recordException({ message });
  }
}

export const appErrorHandler = new AppErrorHandler();
