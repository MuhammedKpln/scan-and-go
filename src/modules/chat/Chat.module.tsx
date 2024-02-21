import { IUser } from "@/models/user.model";
import { messagesQuery, messagesService } from "@/services/messages.service";
import { useAuthStore } from "@/stores/auth.store";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonRow,
} from "@ionic/react";
import { PostgrestError, QueryData } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { paperPlaneOutline } from "ionicons/icons";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./Chat.module.scss";

interface IProps {
  data: QueryData<typeof messagesQuery>;
  roomUid: string;
}

const newMessageForm = z.object({
  message: z.string(),
});

interface SendMessageMutation {
  roomUid: string;
  fromId: string;
  toId: string;
  message: string;
}

export default function ChatModule({ data, roomUid }: IProps) {
  const user = useAuthStore((state) => state.user);
  const [parent] = useAutoAnimate();

  const form = useForm<typeof newMessageForm._type>({
    resolver: zodResolver(newMessageForm),
  });

  const sendMessageMutation = useMutation<
    QueryData<typeof messagesQuery>,
    PostgrestError,
    SendMessageMutation
  >({
    mutationKey: [],
    mutationFn: ({ fromId, message, roomUid, toId }) =>
      messagesService.sendMessage(roomUid, fromId, toId, { message }),
  });

  useEffect(() => {
    const titleElement = document.querySelectorAll(".chat-message");

    if (!titleElement) return;

    setTimeout(() => {
      titleElement[titleElement.length - 1].scrollIntoView({
        behavior: "smooth",
      });
    }, 500);
  });

  const sendMessage = useCallback(
    async (input: typeof newMessageForm._type) => {
      let toId: string = "";

      for (const message of data) {
        if (message.toId !== user?.id) {
          toId = message.toId;
          break;
        }
      }

      await sendMessageMutation.mutateAsync({
        fromId: user!.id,
        message: input.message,
        roomUid,
        toId: toId,
      });
    },
    []
  );

  return (
    <>
      <IonContent>
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col  overflow-hidden ">
          <div
            id="messages"
            ref={parent}
            className="flex flex-col space-y-4 p-3 overflow-hidden scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {data.map((message, index) => {
              if (message.fromId === user!.id) {
                return (
                  <div className="chat-message" key={index}>
                    <div className="flex items-end justify-end">
                      <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-1 items-end">
                        <div>
                          <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                            {message.message}
                          </span>
                        </div>
                      </div>
                      <IonImg
                        src={
                          (message.from as unknown as IUser).profileImageUrl!
                        }
                        className={styles.chatAvatar}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div className="chat-message" key={index}>
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-sm max-w-xs mx-2 order-2 items-start">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {message.message}
                        </span>
                      </div>
                    </div>
                    <IonImg
                      src={(message.to as unknown as IUser).profileImageUrl!}
                      className={styles.chatAvatarL}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>

      <IonFooter>
        <form onSubmit={form.handleSubmit(sendMessage)}>
          <IonGrid>
            <IonRow>
              <IonCol>
                <Controller
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <IonInput
                      placeholder="Ditt meddelande"
                      onIonChange={(e) => field.onChange(e.target.value)}
                      onIonBlur={() => field.onBlur()}
                      value={field.value}
                      name={field.name}
                    />
                  )}
                />
              </IonCol>
              <IonCol size="sm">
                <IonButton fill="clear" type="submit">
                  <IonIcon icon={paperPlaneOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
      </IonFooter>
    </>
  );
}
