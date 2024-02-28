import AppHeader from "@/components/App/AppHeader";
import ScanModule from "@/modules/scan/Scan.module";
import { Routes } from "@/routes/routes";
import {
  IonButton,
  IonContent,
  IonPage,
  IonTitle,
  useIonRouter,
} from "@ionic/react";

export default function ScanPage() {
  const router = useIonRouter();
  // useEffect(() => {
  //   if (isNative.current) {
  //     showModal();
  //   }

  //   return () => {
  //     hideModal(undefined, "cancel");
  //   };
  // }, [isNative]);

  function selam() {
    router.push(Routes.Settings);
  }

  return (
    <IonPage>
      <AppHeader>
        <IonTitle>selam</IonTitle>
      </AppHeader>

      <IonContent>
        <IonButton id="ss">selam</IonButton>

        <ScanModule onCancel={selam} />
      </IonContent>
    </IonPage>
  );
}
