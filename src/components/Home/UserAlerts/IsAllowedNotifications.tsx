import { useIsNative } from "@/hooks/app/useIsNative";
import { PushNotifications } from "@capacitor/push-notifications";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { useEffect, useState } from "react";

export default function IsAllowedNotification() {
  const { isNative } = useIsNative();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    async function check() {
      if (!isNative.current) return;

      const permissions = await PushNotifications.checkPermissions();

      if (permissions.receive !== "granted") {
        setShowAlert(true);
      }
    }

    check();
  }, [isNative]);

  if (showAlert) {
    return (
      <IonCard>
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
