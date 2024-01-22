import AppHeader from "@/components/App/AppHeader";
import { IonContent, IonPage, IonTitle } from "@ionic/react";

export default function ChatPage() {
  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Title</IonTitle>
      </AppHeader>
      <IonContent>slam</IonContent>
    </IonPage>
  );
}
