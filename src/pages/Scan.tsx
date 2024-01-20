import { Capacitor } from "@capacitor/core";
import {
  IonPage,
  useIonAlert,
  useIonRouter,
  useIonViewDidEnter,
} from "@ionic/react";

export default function ScanPage() {
  const router = useIonRouter();
  const [alert, dissmis] = useIonAlert();
  const isNative = Capacitor.isNativePlatform();

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
    }
  });

  return <IonPage></IonPage>;
}
