import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import { useIsNative } from "@/hooks/app/useIsNative";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { QueryKeys } from "@/models/query_keys.model";
import { tagService } from "@/services/tag.service";
import { Barcode, BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";
import { IonButton, useIonAlert, useIonModal } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import TagDialogModule from "../tag/tag_dialog/tag_dialog.module";

interface IProps {
  onCancel: () => void;
}
export default function ScanModule(props: IProps) {
  const [tagUid, setTagUid] = useState<string | undefined>();
  const [showTagDialog, hideTagDialog] = useIonModal(TagDialogModule, {
    tagUid,
    onClose: () => {
      hideTagDialog(undefined, "confirm");
      scanBarcode();
    },
  });
  const [showAlert] = useIonAlert();
  const queryClient = useQueryClient();
  const { isNative } = useIsNative();

  useEffect(() => {
    return () => {
      console.log("Selam");
      hideTagDialog(undefined, "confirm");
    };
  }, []);

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
                props.onCancel();
              },
            },
            {
              text: "Gå tillbaka",
              role: "cancel",
              handler() {
                props.onCancel();
              },
            },
          ],
        });
      } else {
        setTagUid(tag);
        showTagDialog({
          initialBreakpoint: 0.75,
        });
      }
    }
  }, []);

  const onBarcodeError = useCallback(() => {}, []);

  const { initialize, stopScan, scanSingleBarcode } = useBarcodeScanner({
    onBarcodeError,
  });

  const stopScanAndNavigate = useCallback(async () => {
    props.onCancel();
  }, []);

  const scanBarcode = useCallback(() => {
    scanSingleBarcode().then((value) => onBarcodeScanned(value));
  }, []);

  useEffect(() => {
    if (!isNative.current) {
      props.onCancel();

      return;
    }

    initialize().then(async () => {
      scanBarcode();
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
