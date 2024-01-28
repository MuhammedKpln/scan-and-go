import AppHeader from "@/components/App/AppHeader";
import Chat from "@/components/Chat/Chat";
import { Routes } from "@/routes/routes";
import { IonContent, IonPage, IonTitle, useIonRouter } from "@ionic/react";

export default function ChatsPage() {
  const router = useIonRouter();

  return (
    <IonPage>
      <AppHeader>
        <IonTitle>Chattar</IonTitle>
      </AppHeader>

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
        />{" "}
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
