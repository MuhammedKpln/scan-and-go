import AppHeader from "@/components/App/AppHeader";
import SettingsModule from "@/modules/settings/settings.module";
import { IonContent, IonPage, IonTitle } from "@ionic/react";

export default function SettingsPage() {
  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Settings</IonTitle>
      </AppHeader>
      <IonContent>
        <SettingsModule />
      </IonContent>
    </IonPage>
  );
}
