import { Routes } from "@/routes/routes";
import { authService } from "@/services/auth.service";
import { IonIcon, IonItem, IonLabel, useIonRouter } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useCallback } from "react";

export default function LogoutSetting() {
  const router = useIonRouter();

  const onClickItem = useCallback(async () => {
    await authService.logout();

    router.push(Routes.Login, "root", "replace");
  }, []);

  return (
    <IonItem button onClick={onClickItem}>
      <IonIcon icon={logOutOutline} slot="start" />
      <IonLabel>Logga ut</IonLabel>
    </IonItem>
  );
}
