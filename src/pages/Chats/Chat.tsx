import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { QueryKeys } from "@/models/query_keys.model";
import { IMessageWithProfiles, INewMessagePayload } from "@/models/room.model";
import { IUser } from "@/models/user.model";
import ChatModule from "@/modules/chat/Chat.module";
import { messagesQuery, messagesService } from "@/services/messages.service";
import { useAuthStore } from "@/stores/auth.store";
import {
  IonPage,
  IonTitle,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { QueryData, RealtimeChannel } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback, useMemo, useRef } from "react";
import { RouteComponentProps } from "react-router";

export interface ChatPageProps
  extends RouteComponentProps<{
    roomUid: string;
  }> {}

export default function ChatPage(props: ChatPageProps) {
  const user = useAuthStore((state) => state.user);
  const roomNewMessageEvent = useRef<RealtimeChannel>();
  const queryClient = useQueryClient();
  const roomId = useMemo(() => props.match.params.roomUid, []);

  useIonViewWillEnter(() => {
    roomNewMessageEvent.current = messagesService
      .listenRoom(roomId, (m) => onNewMessage(m))
      .subscribe();
  });

  useIonViewWillLeave(() => {
    roomNewMessageEvent.current?.unsubscribe();
  });

  const onNewMessage = useCallback((m: INewMessagePayload) => {
    console.log("se");
    queryClient.setQueryData<IMessageWithProfiles[]>(
      [QueryKeys.Chat, roomId],
      (v) => {
        const updatedState = produce(v, (draft) => {
          draft?.push(m.payload);
        });

        return updatedState;
      }
    );
  }, []);

  const query = useQuery<QueryData<typeof messagesQuery>>({
    queryKey: [QueryKeys.Chat, roomId],
    queryFn: () => messagesService.fetchRoomMessages(roomId),
  });

  const pageTitle = useMemo(() => {
    if (query.isLoading) return;

    for (const message of query.data!) {
      if (message.toId !== user?.id) {
        const user = message.to as unknown as IUser;
        return `${user.firstName} ${user.lastName}`;
      }
    }
  }, [query.isLoading]);

  if (query.isLoading) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>{pageTitle}</IonTitle>
      </AppHeader>

      <ChatModule roomUid={roomId} data={query!.data!} />
    </IonPage>
  );
}
