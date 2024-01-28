import {
  BarcodeFormat,
  BarcodeScannedEvent,
  BarcodeScanner,
  GoogleBarcodeScannerModuleInstallState,
} from "@capacitor-mlkit/barcode-scanning";
import { Capacitor } from "@capacitor/core";
import { useIonAlert } from "@ionic/react";
import { useCallback, useRef } from "react";

interface IProps {
  onBarcodeScanned: (e: BarcodeScannedEvent) => void;
  onBarcodeError: () => void;
}

export function useBarcodeScanner(props: IProps) {
  const [showAlert] = useIonAlert();
  const googleModulesInstalled = useRef<boolean>(false);

  const initialize = useCallback(async () => {
    const supported = await isSupported();

    if (!supported) {
      showAlert("Not supported");
      return;
    }

    initializeListeners();

    const hasPermission = await hasPermissions();

    if (hasPermission) {
      if (Capacitor.getPlatform() === "android") {
        await installGoogleModule();
      }
    } else {
      await BarcodeScanner.requestPermissions();
    }
  }, []);

  const startScan = useCallback(async () => {
    if (!googleModulesInstalled.current) {
      console.error("Google modules is not installed.");
    }

    document.querySelector("body")?.classList.add("barcode-scanner-active");

    await BarcodeScanner.startScan({
      formats: [BarcodeFormat.QrCode],
    });
  }, []);

  const stopScan = useCallback(async () => {
    document.querySelector("body")?.classList.remove("barcode-scanner-active");

    await BarcodeScanner.stopScan();
  }, []);

  const isSupported = useCallback(async () => {
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  }, []);

  const initializeListeners = useCallback(() => {
    BarcodeScanner.addListener("barcodeScanned", props.onBarcodeScanned);
    BarcodeScanner.addListener("scanError", props.onBarcodeError);

    BarcodeScanner.addListener(
      "googleBarcodeScannerModuleInstallProgress",
      (e) => {
        switch (e.state) {
          case GoogleBarcodeScannerModuleInstallState.CANCELED:
            showAlert("Canceled");
            break;
          case GoogleBarcodeScannerModuleInstallState.DOWNLOADING:
            showAlert("Downloading " + e.progress);
            break;
          case GoogleBarcodeScannerModuleInstallState.FAILED:
            showAlert("Failed");
            break;
          case GoogleBarcodeScannerModuleInstallState.COMPLETED:
            showAlert("Completed Downloading");
            googleModulesInstalled.current = true;
            break;
          case GoogleBarcodeScannerModuleInstallState.INSTALLING:
            showAlert("Installing");
            break;
        }
      }
    );
  }, []);

  const permissionDeniedAlert = useCallback(() => {
    showAlert("Camera permission is denied, please allow it", [
      {
        text: "App Settings",
        handler: () => showAlert("Open app settings"),
      },
    ]);
  }, []);

  const hasPermissions = useCallback(async (): Promise<boolean> => {
    const hasPermission = await BarcodeScanner.checkPermissions();

    if (hasPermission.camera === "denied") {
      permissionDeniedAlert();

      return false;
    }

    return hasPermission.camera === "granted";
  }, []);

  const installGoogleModule = useCallback(async () => {
    const hasModule =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

    if (!hasModule) {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    }
  }, []);

  return {
    initialize,
    startScan,
    stopScan,
  };
}
