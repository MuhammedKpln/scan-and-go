import SettingsModule from "@/modules/settings/settings.module";
import { IonContent, IonPage } from "@ionic/react";

export default function SettingsPage() {
  return (
    <IonPage>
      <IonContent>
        <SettingsModule />
      </IonContent>
    </IonPage>
  );
}
