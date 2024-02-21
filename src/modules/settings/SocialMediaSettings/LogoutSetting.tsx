import { useAuthContext } from "@/context/AuthContext";
import { Routes } from "@/routes/routes";
import { IonIcon, IonItem, IonLabel, useIonRouter } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useCallback } from "react";

export default function LogoutSetting() {
  const router = useIonRouter();
  const { logout } = useAuthContext();

  const onClickItem = useCallback(async () => {
    await logout();

    router.push(Routes.Login, "root", "replace");
  }, []);

  return (
    <IonItem button onClick={onClickItem}>
      <IonIcon icon={logOutOutline} slot="start" />
      <IonLabel>Logga ut</IonLabel>
    </IonItem>
  );
}
