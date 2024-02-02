import Chat from "@/components/Chat/Chat";
import { Routes } from "@/routes/routes";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

export default function ChatsPage() {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Chattar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Chattar</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList inset>
          <Chat
            onClick={() => router.push(`${Routes.Chats}/23`)}
            subtitle="Burasi chattir sana buradan yaziyotum götun asla kalkmasin"
            user={{
              firstName: "Muhammed",
              lastName: "Kaplan",
              profileImageRef: "null",
              showPhoneNumber: false,
            }}
            onClickDelete={() => null}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
}
