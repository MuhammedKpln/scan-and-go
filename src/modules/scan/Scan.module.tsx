import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { QueryKeys } from "@/models/query_keys.model";
import { Routes } from "@/routes/routes";
import { tagService } from "@/services/tag.service";
import { Barcode, BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { IonButton, useIonAlert } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";

interface IProps {
  onCancel: (route: string) => void;
}
export default function ScanModule(props: IProps) {
  const [showAlert] = useIonAlert();
  const queryClient = useQueryClient();

  const onBarcodeScanned = useCallback(async (e: Barcode) => {
    await stopScan();
    const url = e.displayValue;
    const tagSplitted = url.split("tag/");
    const tag = tagSplitted[1];

    if (tag) {
      const response = await queryClient.fetchQuery({
        queryKey: [QueryKeys.Tag, tag],
        queryFn: () => tagService.fetchTag(tag),
      });

      if (response && response.isAvailable) {
        showAlert({
          message: "Registrera ditt nya etikett.",
          subHeader: "Grattis!",
          buttons: [
            {
              text: "Registrera",
              handler() {
                props.onCancel(Routes.NewTag.replace(":tagUid", response.id));
              },
            },
            {
              text: "Gå tillbaka",
              role: "cancel",
              handler() {
                props.onCancel(Routes.AppRoot);
              },
            },
          ],
        });
      } else {
        console.log("yok");
      }
    }
  }, []);

  const onBarcodeError = useCallback(() => {}, []);

  const { initialize, stopScan, scanSingleBarcode } = useBarcodeScanner({
    onBarcodeError,
  });

  const stopScanAndNavigate = useCallback(async () => {
    // await stopScan();
    props.onCancel(Routes.AppRoot);
  }, []);

  useEffect(() => {
    initialize().then(async () => {
      scanSingleBarcode().then((value) => onBarcodeScanned(value));
    });

    return () => {
      stopScan();
      // Remove all listeners
      BarcodeScanner.removeAllListeners();
    };
  }, []);

  return (
    <div className="h-screen barcode-scanner-modal overflow-hidden p-10">
      <IonButton fill="outline" color="secondary" onClick={stopScanAndNavigate}>
        Cancel
      </IonButton>

      <div className="flex flex-col gap-5 items-center justify-around h-screen w-full">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
          id="qrView"
          className="border-4 border-white block border-solid w-56 h-56 rounded-xl"
        />
        <div className="w-full">
          <AppInfoCard
            message="Scanna ett QR-kod"
            status={InfoCardStatus.Information}
          />
        </div>
      </div>
    </div>
  );
}
