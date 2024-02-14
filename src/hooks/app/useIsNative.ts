import { Capacitor } from "@capacitor/core";
import { useIonAlert, useIonRouter } from "@ionic/react";
import { useEffect, useRef } from "react";

export function useIsNative(showPopup?: boolean) {
  const [showAlert] = useIonAlert();
  const router = useIonRouter();
  const isNative = useRef<boolean>(Capacitor.isNativePlatform());

  useEffect(() => {
    if (!isNative.current) {
      if (showPopup) {
        showAlert({
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
    }
  }, []);

  return {
    isNative,
  };
}
