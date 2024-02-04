import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { getIdSingleWithData, renderIdSingleWithData } from "@/helpers";
import { FirebaseCollections } from "@/models/firebase_collections.model";
import { IRoom, IRoomWithId } from "@/models/room.model";
import { converter, db } from "@/services/firebase.service";
import { messagesService } from "@/services/messages.service";
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
import { useQueryClient } from "@tanstack/react-query";
import {
  PartialWithFieldValue,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { paperPlaneOutline } from "ionicons/icons";
import { useCallback, useState } from "react";
import { RouteComponentProps } from "react-router";

export interface ChatPageProps
  extends RouteComponentProps<{
    roomUid: string;
  }> {}

export default function ChatPage(props: ChatPageProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [data, setData] = useState<IRoomWithId | undefined>();

  // const data = useQuery<IRoomWithId | undefined>({
  //   queryKey: [QueryKeys.Chat, user?.uid],
  //   networkMode: "offlineFirst",
  //   queryFn: async () =>
  // });

  useIonViewDidEnter(() => {
    // await messagesService.fetchRoom(props.match.params.roomUid),

    messagesService.listenRoom(props.match.params.roomUid, async (item) => {
      if (item?.data()) {
        const newItem = await messagesService.mapUserDetails(
          item.data()!,
          item.id
        );

        setData(newItem);
      }
    });
  });

  console.log(data);

  const sendMessage = useCallback(() => {
    const docRef = doc(
      db,
      FirebaseCollections.Rooms,
      props.match.params.roomUid
    ).withConverter<IRoom>(converter());

    getIdSingleWithData<IRoom>(data!, async (item, id) => {
      item.messages.push({
        message: "testtir babbbabaaaaaAA " + user!.email,
        sendBy: user!.uid,
        created_at: Timestamp.fromDate(new Date()),
      });

      console.log(item);

      await updateDoc(docRef, item as PartialWithFieldValue<IRoom>);
    });
  }, [data]);

  if (data === undefined) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Title</IonTitle>
      </AppHeader>
      <IonContent>
        {renderIdSingleWithData(data!, (data, id) => {
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
