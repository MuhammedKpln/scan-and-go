import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import {
  BarcodeScannedEvent,
  BarcodeScanner,
} from "@capacitor-mlkit/barcode-scanning";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonPage,
  useIonAlert,
  useIonRouter,
} from "@ionic/react";
import { useCallback, useLayoutEffect } from "react";

interface IProps {
  onCancel: () => void;
}
export default function ScanModule(props: IProps) {
  const [showAlert] = useIonAlert();
  const router = useIonRouter();

  const onBarcodeScanned = useCallback(async (e: BarcodeScannedEvent) => {
    showAlert(e.barcode.displayValue);
    await stopScan();
  }, []);

  const onBarcodeError = useCallback(() => {}, []);

  const { initialize, startScan, stopScan } = useBarcodeScanner({
    onBarcodeScanned,
    onBarcodeError,
  });

  const stopScanAndNavigate = useCallback(async () => {
    await stopScan();
    props.onCancel();
  }, []);

  useLayoutEffect(() => {
    initialize().then(async (s) => {
      startScan();
    });

    return () => {
      stopScan();
      // Remove all listeners
      BarcodeScanner.removeAllListeners();
    };
  }, []);

  return (
    <IonPage>
      <IonContent className="h-full barcode-scanner-modal overflow-hidden">
        <IonButtons style={{ paddingTop: "var(--ion-safe-area-top)" }}>
          <IonButton fill="clear" slot="start" onClick={stopScanAndNavigate}>
            Cancel
          </IonButton>
        </IonButtons>

        <div className="flex items-center justify-center h-full">
          <div
            id="qrView"
            className="border border-white block border-solid w-56 h-56"
          ></div>
        </div>
      </IonContent>
    </IonPage>
  );
}
