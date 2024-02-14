import { useIsNative } from "@/hooks/app/useIsNative";
import ScanModule from "@/modules/scan/Scan.module";
import {
  IonPage,
  useIonModal,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { useCallback } from "react";

export default function ScanPage() {
  const router = useIonRouter();
  const { isNative } = useIsNative(true);
  const [showModal, hideModal] = useIonModal(ScanModule, {
    onCancel: () => hideModal(undefined, "cancel"),
  });

  const onExit = useCallback(() => {
    if (router.canGoBack()) {
      router.goBack();
    } else {
      router.push("/app");
    }
  }, []);

  useIonViewWillLeave(() => {
    hideModal(undefined, "cancel");
  });

  useIonViewDidEnter(() => {
    if (isNative.current) {
      showModal({
        onWillDismiss: onExit,
      });
    }
  });

  return <IonPage></IonPage>;
}
