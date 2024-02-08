import { useAuthContext } from "@/context/AuthContext";
import { renderIdSingleWithData } from "@/helpers";
import { IRoomWithId } from "@/models/room.model";
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
import { paperPlaneOutline } from "ionicons/icons";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./Chat.module.scss";

interface IProps {
  data: IRoomWithId;
  sendMessage: (input: typeof newMessageForm._type) => void;
}

const newMessageForm = z.object({
  message: z.string(),
});

export default function ChatModule({ data, sendMessage }: IProps) {
  const { user } = useAuthContext();
  const form = useForm<typeof newMessageForm._type>({
    resolver: zodResolver(newMessageForm),
  });

  useEffect(() => {
    const titleElement = document.querySelectorAll(".chat-message");

    titleElement[titleElement.length - 1].scrollIntoView({
      behavior: "smooth",
    });
  });

  return (
    <>
      <IonContent>
        <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
          <div
            id="messages"
            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
          >
            {renderIdSingleWithData(data, (item) =>
              item.messages.map((message, index) => {
                if (message.sendBy === user!.uid) {
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
                          src={message.user?.profileImageRef}
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
                        src={message.user?.profileImageRef}
                        className={styles.chatAvatarL}
                      />
                    </div>
                  </div>
                );
              })
            )}
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
