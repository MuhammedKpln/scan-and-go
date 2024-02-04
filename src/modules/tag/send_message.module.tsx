import AppModalHeader from "@/components/App/AppModalHeader";
import { useAuthContext } from "@/context/AuthContext";
import { getIdWithData } from "@/helpers";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { QueryKeys } from "@/models/query_keys.model";
import { IMessage, IRoom, IRoomWithId } from "@/models/room.model";
import { messagesService } from "@/services/messages.service";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
} from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentReference, Timestamp } from "firebase/firestore";
import { useCallback, useState } from "react";

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  toUserUid: string;
}

interface SendMessageMutationVariables {
  room: IRoom;
  message: IMessage;
  documentData?: Partial<IRoom>;
  documentId?: string;
}

interface IPredefinedMessages {
  id: number;
  name: string;
}

const messages: IPredefinedMessages[] = [
  {
    id: 1,
    name: "Hej",
  },
  {
    id: 2,
    name: "Hej, ditt fönster är öppet.",
  },
  {
    id: 3,
    name: "Hej, du har parkerat fel.",
  },
];

export default function SendMessageModule(props: IProps) {
  const [selectedMessage, setSelectedMessage] = useState<IPredefinedMessages>();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { showToast } = useAppToast();
  const compareWith = useCallback(
    (o1: IPredefinedMessages, o2: IPredefinedMessages) => {
      return o1.id === o2.id;
    },
    []
  );

  const sendMessageMutation = useMutation<
    DocumentReference<IRoom> | void,
    Error,
    SendMessageMutationVariables
  >({
    mutationFn: ({ room, documentData, documentId, message }) => {
      const data: Partial<IRoom> | undefined = documentData
        ? {
            ...documentData,
            recentMessage: message,
          }
        : undefined;

      return messagesService.sendMessage(room, data, documentId);
    },

    onSuccess(data, variables) {
      if (!data) return;

      queryClient.setQueryData<IRoomWithId[]>(
        [QueryKeys.Chats, user?.uid],
        (v) => {
          if (v) {
            const newRoom = {
              [data.id]: variables.room,
            };

            v.push(newRoom);

            return v;
          }
        }
      );
    },
  });

  const sendMessage = useCallback(async () => {
    const _message: IMessage = {
      created_at: Timestamp.fromDate(new Date()),
      message: selectedMessage!.name,
      sendBy: user!.uid,
    };

    const room: IRoom = {
      created_at: Timestamp.fromDate(new Date()),
      messages: [_message],
      recentMessage: _message,
      users: [props.toUserUid, user!.uid],
    };

    const cachedChats = await messagesService.fetchRooms(user!.uid, {
      fromCache: true,
    });

    if (cachedChats.length > 0) {
      // If there is a cached chat data
      getIdWithData(cachedChats, async (data, id) => {
        const toIncludes = data.users.includes(props.toUserUid);
        const fromIncludes = data.users.includes(user!.uid);

        if (fromIncludes && toIncludes) {
          // If it includes chat with this particular user, update the messages
          data.messages.push(_message);

          sendMessageMutation
            .mutateAsync({
              room: data,
              documentData: data,
              documentId: id,
              message: _message,
            })
            .then(onSuccess)
            .catch(onFailure);

          return;
        } else {
          // Else cached data exists, but not with this user.
          sendMessageMutation
            .mutateAsync({
              room,
              message: _message,
            })
            .then(onSuccess)
            .catch(onFailure);

          return;
        }
      });

      return;
    }

    // No cached data exists, create new doc
    sendMessageMutation
      .mutateAsync({
        room,
        message: _message,
      })
      .then(onSuccess)
      .catch(onFailure);

    function onSuccess() {
      props.onConfirm();
      showToast({
        message: "Skickat meddelande!",
        status: ToastStatus.Success,
      });
    }

    function onFailure(e: unknown) {
      props.onCancel();
      console.log(e);
      showToast({
        message: "Fel!",
        status: ToastStatus.Error,
      });
    }
  }, [selectedMessage]);

  return (
    <IonPage>
      <AppModalHeader onClose={props.onCancel}>
        <IonTitle>Selam</IonTitle>

        {selectedMessage && (
          <IonButtons slot="end">
            <IonButton onClick={sendMessage}>Send message</IonButton>
          </IonButtons>
        )}
      </AppModalHeader>
      <IonContent>
        <IonList lines="none">
          <IonRadioGroup
            compareWith={compareWith}
            onIonChange={(ev) => setSelectedMessage(ev.target.value)}
          >
            {messages.map((message) => (
              <IonItem key={message.id}>
                <IonRadio value={message}>{message.name}</IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
