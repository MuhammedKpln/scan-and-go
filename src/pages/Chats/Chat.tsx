import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { getIdSingleWithData, renderIdSingleWithData } from "@/helpers";
import { FirebaseCollections } from "@/models/firebase_collections.model";
import { QueryKeys } from "@/models/query_keys.model";
import { IRoom, IRoomWithId } from "@/models/room.model";
import { converter, db } from "@/services/firebase.service";
import { messagesService } from "@/services/messages.service";
import { profileService } from "@/services/profile.service";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  useIonViewDidEnter,
} from "@ionic/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PartialWithFieldValue,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { paperPlaneOutline } from "ionicons/icons";
import { useCallback } from "react";
import { RouteComponentProps } from "react-router";

export interface ChatPageProps
  extends RouteComponentProps<{
    roomUid: string;
  }> {}

export default function ChatPage(props: ChatPageProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const data = useQuery<IRoomWithId | undefined>({
    queryKey: [QueryKeys.Chat, user?.uid],
    networkMode: "offlineFirst",
    queryFn: async () =>
      await messagesService.fetchRoom(props.match.params.roomUid),
  });

  useIonViewDidEnter(() => {
    messagesService.listenRoom(props.match.params.roomUid, (item) => {
      queryClient.setQueryData(
        [QueryKeys.Chat, user?.uid],
        async (v: IRoomWithId) => {
          const data = item.data();

          if (data && v) {
            const recent = await profileService.fetchProfile(
              data.recentMessage.sendBy,
              true
            );

            const _messages = data.messages.map(async (e) => {
              const user = await profileService.fetchProfile(e.sendBy, true);

              return {
                ...e,
                user: user.data(),
              };
            });

            const messages = await Promise.all(_messages);

            const recentm = {
              ...data.recentMessage,
              user: recent.data(),
            };

            getIdSingleWithData<IRoom>(v, (ss, dds) => {
              ss.messages.push();
            });

            return v as unknown as IRoomWithId[];
          }

          return v as unknown as IRoomWithId[];
        }
      );
    });
  });

  const sendMessage = useCallback(() => {
    const docRef = doc(
      db,
      FirebaseCollections.Rooms,
      props.match.params.roomUid
    ).withConverter<IRoom>(converter());

    getIdSingleWithData<IRoom>(data.data!, async (item, id) => {
      console.log(item);

      item.messages.push({
        message: "testtir babbbabaaaaaAA",
        sendBy: user!.uid,
        created_at: Timestamp.fromDate(new Date()),
      });

      console.log(item);

      await updateDoc(docRef, item as PartialWithFieldValue<IRoom>);
    });
  }, [data]);

  if (data.isLoading) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Title</IonTitle>
      </AppHeader>
      <IonContent>
        {renderIdSingleWithData(data.data!, (data, id) => {
          return data.messages.map((e) => (
            <IonCard key={id + e.sendBy + e.created_at}>
              <IonCardHeader>
                <IonCardTitle>{e.user?.firstName}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>{e.message}</IonCardContent>
            </IonCard>
          ));
        })}
      </IonContent>

      <IonFooter>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput placeholder="SELAM" />
            </IonCol>
            <IonCol>
              <IonFabButton onClick={sendMessage}>
                <IonIcon icon={paperPlaneOutline} />
              </IonFabButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonPage>
  );
}
