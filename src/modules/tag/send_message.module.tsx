import AppModalHeader from "@/components/App/AppModalHeader";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { QueryKeys } from "@/models/query_keys.model";
import { IMessage, IMessageWithProfiles } from "@/models/room.model";
import { IUser } from "@/models/user.model";
import { messagesService } from "@/services/messages.service";
import { useAuthStore } from "@/stores/auth.store";
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
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback, useState } from "react";

interface IProps {
  onCancel: () => void;
  onConfirm: () => void;
  toUserUid: string;
  toUser: IUser;
}

interface SendMessageMutationVariables {
  fromId: string;
  toId: string;
  message: string;
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
  const user = useAuthStore((state) => state.user);
  const { showToast } = useAppToast();
  const compareWith = useCallback(
    (o1: IPredefinedMessages, o2: IPredefinedMessages) => {
      return o1.id === o2.id;
    },
    []
  );

  const sendMessageMutation = useMutation<
    IMessageWithProfiles,
    PostgrestError,
    SendMessageMutationVariables
  >({
    mutationFn: ({ fromId, message, toId }) => {
      return messagesService.sendMessage(fromId, toId, message);
    },

    onSuccess(data) {
      queryClient.setQueryData<IMessage[]>(
        [QueryKeys.Chat, data.roomId],
        (v) => {
          const updatedState = produce(v, (draft) => {
            draft?.push(data);
          });

          return updatedState;
        }
      );
    },
  });

  const sendMessage = useCallback(async () => {
    sendMessageMutation
      .mutateAsync({
        fromId: user!.id,
        message: selectedMessage?.name ?? "Hej!",
        toId: props.toUserUid,
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
        <IonTitle>Skicka meddelande till {props.toUser.firstName}</IonTitle>

        {selectedMessage && (
          <IonButtons slot="end">
            <IonButton onClick={sendMessage}>Skicka meddelande</IonButton>
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
