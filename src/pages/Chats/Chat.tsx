import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { getIdSingleWithData } from "@/helpers";
import { IRoom, IRoomWithId } from "@/models/room.model";
import ChatModule from "@/modules/chat/Chat.module";
import { messagesService } from "@/services/messages.service";
import {
  IonPage,
  IonTitle,
  useIonViewDidEnter,
  useIonViewDidLeave,
} from "@ionic/react";
import { Timestamp, Unsubscribe } from "firebase/firestore";
import { useCallback, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";

export interface ChatPageProps
  extends RouteComponentProps<{
    roomUid: string;
  }> {}

export default function ChatPage(props: ChatPageProps) {
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<IRoomWithId | undefined>();
  const { user } = useAuthContext();
  const unsub = useRef<Unsubscribe>();

  const sendMessage = useCallback(
    (message: string) => {
      console.log("qwe");
      getIdSingleWithData<IRoom>(data!, async (item) => {
        item.messages.push({
          message: message,
          sendBy: user!.uid,
          created_at: Timestamp.fromDate(new Date()),
        });

        await messagesService.sendMessage(
          item,
          item,
          props.match.params.roomUid
        );
      });
    },
    [data]
  );

  const listenRoom = useCallback(() => {
    return messagesService.listenRoom(
      props.match.params.roomUid,
      async (item) => {
        if (item?.data()) {
          const newItem = await messagesService.mapUserDetails(
            item.data()!,
            item.id
          );

          getIdSingleWithData(newItem, async (data) => {
            for (const message of data.messages) {
              if (message.sendBy === user!.uid) {
                setTitle(
                  message.user!.firstName + " " + message.user!.lastName
                );
                break;
              }
            }
          });

          setData(newItem);
        }
      }
    );
  }, [user]);

  useIonViewDidEnter(() => {
    unsub.current = listenRoom();
  });

  useIonViewDidLeave(() => {
    unsub.current?.call(undefined);
  });

  if (!data) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>{title}</IonTitle>
      </AppHeader>

      <ChatModule
        sendMessage={(input) => sendMessage(input.message)}
        data={data}
      />
    </IonPage>
  );
}
