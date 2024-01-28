import ScanModule from "@/modules/scan/Scan.module";
import { Capacitor } from "@capacitor/core";
import {
  IonPage,
  useIonAlert,
  useIonModal,
  useIonRouter,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { useCallback } from "react";

export default function ScanPage() {
  const router = useIonRouter();
  const [alert] = useIonAlert();
  const isNative = Capacitor.isNativePlatform();
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
    if (!isNative) {
      alert({
        header: "Ladda ner vår app!",
        message: "Du behöver ladda ner vår app för scanna qr koden.",
        buttons: [
          {
            text: "Gå tillbaka",
            role: "cancel",
            handler: () => router.goBack(),
          },
          {
            text: "Ladda ner appen",
            role: "confirm",
            id: "ion-primary",
            handler: () => router.goBack(),
          },
        ],
      });
    } else {
      showModal({
        onWillDismiss: onExit,
      });
    }
  });

  return <IonPage></IonPage>;
}
