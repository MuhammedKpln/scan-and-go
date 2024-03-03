import { useIsNative } from "@/hooks/app/useIsNative";
import { useFcmToken } from "@/hooks/useFcmToken";
import { PluginListenerHandle } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";

export default function IsAllowedNotification() {
  const { isNative } = useIsNative();
  const [showAlert, setShowAlert] = useState<boolean>(true);
  const { init } = useFcmToken();

  useEffect(() => {
    let pushListener: PluginListenerHandle;
    if (isNative.current) {
      pushListener = PushNotifications.addListener("registration", () => {
        setShowAlert(false);
      });
    }

    async function check() {
      if (!isNative.current) return;

      const permissions = await PushNotifications.checkPermissions();

      if (permissions.receive === "granted") {
        setShowAlert(false);
      }
    }

    check();

    return () => {
      if (isNative.current) {
        pushListener?.remove();
      }
    };
  }, [isNative]);

  const initNotifications = useCallback(() => {
    init();
  }, []);

  if (showAlert) {
    return (
      <IonCard onClick={initNotifications}>
        <IonCardHeader>
          <IonCardTitle>Allow Notifications</IonCardTitle>
          <IonCardSubtitle>For getting notifications instantly</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          Download our application for better user experience!
        </IonCardContent>
      </IonCard>
    );
  }
}
