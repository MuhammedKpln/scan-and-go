import AppHeader from "@/components/App/AppHeader";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { barbellOutline } from "ionicons/icons";

export default function SettingsPage() {
  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Settings</IonTitle>
      </AppHeader>

      <IonContent>
        <IonList inset>
          <IonListHeader>
            <IonLabel>Profile Settings</IonLabel>
          </IonListHeader>
          <IonItem button>
            <IonIcon icon={barbellOutline} slot="start" />
            <IonLabel>selam</IonLabel>
          </IonItem>
        </IonList>

        <IonList inset>
          <IonListHeader>
            <IonLabel>App Settings</IonLabel>
          </IonListHeader>
          <IonItem button>
            <IonIcon icon={barbellOutline} slot="start" />
            <IonLabel>selam</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
