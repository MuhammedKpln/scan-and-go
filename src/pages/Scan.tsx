import AppHeader from "@/components/App/AppHeader";
import { useIsNative } from "@/hooks/app/useIsNative";
import ScanModule from "@/modules/scan/Scan.module";
import { Routes } from "@/routes/routes";
import {
  IonContent,
  IonPage,
  IonTitle,
  useIonModal,
  useIonRouter,
} from "@ionic/react";
import { useCallback, useEffect } from "react";
import { useHistory } from "react-router";

export default function ScanPage() {
  const { isNative } = useIsNative(false);
  const [showModal, hideModal] = useIonModal(ScanModule, {
    onCancel: () => {
      hideModal(undefined, "cancel");
      onExit();
    },
  });
  const router = useIonRouter();
  const history = useHistory();
  useEffect(() => {
    if (isNative.current) {
      showModal({
        onDidDismiss: onExit,
      });
    }

    return () => {
      hideModal(undefined, "cancel");
    };
  }, [isNative]);

  const onExit = useCallback(() => {
    setTimeout(() => {
      router.push(Routes.Home);
    }, 300);
  }, []);

  return (
    <IonPage>
      <AppHeader>
        <IonTitle>selam</IonTitle>
      </AppHeader>

      <IonContent>
        {/* <IonButton id="ss">selam</IonButton> */}

        {/* <ScanModule onCancel={selam} /> */}
      </IonContent>
    </IonPage>
  );
}
