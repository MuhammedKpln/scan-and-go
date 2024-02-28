import AppHeader from "@/components/App/AppHeader";
import NewTagModule from "@/modules/newtag/newtag.module";
import { IonContent, IonPage, IonTitle } from "@ionic/react";

export default function NewTagPage() {
  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Nytt ettikett</IonTitle>
      </AppHeader>

      <IonContent>
        <NewTagModule />
      </IonContent>
    </IonPage>
  );
}
