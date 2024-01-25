import Chat from "@/components/Chat";
import { Routes } from "@/routes/routes";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";

export default function ChatsPage() {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle>Chattar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Chat
          onClick={() => router.push(`${Routes.Chats}/23`)}
          subtitle="Burasi chattir sana buradan yaziyotum götun asla kalkmasin"
          user={{
            firstName: "Muhammed",
            lastName: "Kaplan",
            profileImageRef: "null",
          }}
          onClickDelete={() => null}
        />
      </IonContent>
    </IonPage>
  );
}
