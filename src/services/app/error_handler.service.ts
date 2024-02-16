import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import { Capacitor } from "@capacitor/core";
import * as StackTrace from "stacktrace-js";

class AppErrorHandler {
  private isNative = Capacitor.isNativePlatform();

  async logError(error: Error) {
    const stackTrace = await this.recordExceptionWithStacktrace(error);

    if (!this.isNative) {
      console.error(stackTrace);

      return;
    }

    await FirebaseCrashlytics.recordException({
      stacktrace: stackTrace,
      message: error.message,
    });
  }

  private async recordExceptionWithStacktrace(error: Error) {
    const stacktrace = await StackTrace.fromError(error);

    return stacktrace;
  }
}

export const appErrorHandler = new AppErrorHandler();
