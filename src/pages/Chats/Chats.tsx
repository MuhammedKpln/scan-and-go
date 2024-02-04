import AppInfoCard from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import Chat from "@/components/Chat/Chat";
import { useAuthContext } from "@/context/AuthContext";
import { renderIdWithData } from "@/helpers";
import { QueryKeys } from "@/models/query_keys.model";
import { IRoom, IRoomWithId } from "@/models/room.model";
import { Routes } from "@/routes/routes";
import { messagesService } from "@/services/messages.service";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";

export default function ChatsPage() {
  const router = useIonRouter();
  const { user } = useAuthContext();

  const data = useQuery<IRoomWithId[] | undefined>({
    queryKey: [QueryKeys.Chats, user?.uid],
    queryFn: () => messagesService.fetchRooms(user!.uid),
  });

  if (data.isLoading) {
    return <AppLoading />;
  }

  console.log(data.data);

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

        {data.data!.length < 1 ? (
          <AppInfoCard message="No messages found" />
        ) : (
          <IonList inset>
            {renderIdWithData<IRoom>(data.data!, (data, id) => {
              return (
                <Chat
                  key={id}
                  onClick={() =>
                    router.push(Routes.Chat.replace(":roomUid", id))
                  }
                  subtitle={data.recentMessage.message}
                  user={{
                    firstName: data.recentMessage.user!.firstName,
                    lastName: data.recentMessage.user!.lastName,
                    profileImageRef: data.recentMessage.user!.profileImageRef,
                    sendMessageAllowed:
                      data.recentMessage.user!.sendMessageAllowed,
                    showPhoneNumber: false,
                  }}
                  onClickDelete={() => null}
                />
              );
            })}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}
