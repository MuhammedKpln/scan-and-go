import AppModalHeader, {
  AppModalHeaderProps,
} from "@/components/App/AppModalHeader";
import AppButton from "@/components/AppButton";
import AppAvatar from "@/components/Avatar";
import { QueryKeys } from "@/models/query_keys.model";
import { ITagWithRelations, tagService } from "@/services/tag.service";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRippleEffect,
  IonSkeletonText,
  IonSpinner,
  useIonModal,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import {
  logoTwitter,
  phonePortraitOutline,
  qrCodeOutline,
  sendOutline,
  shareSocialOutline,
} from "ionicons/icons";
import { AsYouType } from "libphonenumber-js";
import { useCallback, useEffect, useMemo } from "react";
import SendMessageModule from "../send_message.module";
import styles from "./tag_dialog.module.scss";

type IProps = {
  tagUid: string;
} & AppModalHeaderProps;

export default function TagDialogModule({ onClose, tagUid }: IProps) {
  const fetchTag = useCallback(() => {
    return tagService.fetchTag(tagUid);
  }, []);

  const tagQuery = useQuery<ITagWithRelations>({
    queryKey: [QueryKeys.Tag, tagUid],
    queryFn: fetchTag,
  });

  const profileData = useMemo(() => tagQuery.data?.profiles, [tagQuery]);

  const [showSendMessageModal, hideSendMessageModal] = useIonModal(
    SendMessageModule,
    {
      onCancel: () => hideSendMessageModal(undefined, "cancel"),
      onConfirm: () => hideSendMessageModal(undefined, "confirm"),
      toUserUid: profileData?.id,
      toUser: profileData,
    }
  );

  const userLatestNote = useMemo(() => {
    if (!tagQuery.isSuccess) return "";

    if (tagQuery.data.notes.length > 0) {
      return tagQuery.data.notes[0].content;
    }

    return tagQuery.data.note;
  }, [tagQuery]);

  const phoneData = useMemo(() => {
    return tagQuery.data?.profiles?.phone_numbers ?? undefined;
  }, [tagQuery]);

  const socialMediaAccountsData = useMemo(() => {
    return tagQuery.data?.profiles?.social_media_accounts ?? undefined;
  }, [tagQuery]);

  const sendMessage = useCallback(() => {
    showSendMessageModal({
      initialBreakpoint: 0.5,
    });
  }, []);

  useEffect(() => {
    return () => {
      console.log("Selam");
      hideSendMessageModal(undefined, "confirm");
    };
  }, []);

  return (
    <IonPage>
      <AppModalHeader onClose={onClose} />

      <IonContent>
        <div id="container" className="flex flex-col gap-5 ion-padding">
          <div id="user" className="flex gap-3 justify-between items-center">
            <AppAvatar>
              {tagQuery.isPending && <IonSkeletonText animated />}
            </AppAvatar>
            <div>
              <h1 className="font-bold">
                {tagQuery.isPending ? (
                  <IonSkeletonText style={{ width: "15rem", height: "2rem" }} />
                ) : (
                  `${profileData?.firstName} ${profileData?.lastName}`
                )}
              </h1>
              <p>
                {tagQuery.isPending ? (
                  <IonSkeletonText style={{ width: "15rem" }} />
                ) : (
                  profileData?.bio
                )}
              </p>
            </div>
          </div>

          <div
            className={classNames(
              "flex flex-col p-5 gap-5 rounded-lg",
              styles.note
            )}
          >
            {userLatestNote}
          </div>

          {tagQuery.isPending ? (
            <IonSpinner className="self-center" />
          ) : (
            <>
              <div id="actions" className="flex flex-wrap gap-5">
                <AppButton className="w-full" onClick={sendMessage}>
                  <IonIcon icon={sendOutline} slot="start" />
                  Skicka meddelande
                </AppButton>

                <AppButton fill="outline" className="w-[45%]">
                  <IonIcon icon={qrCodeOutline} slot="start" />
                  QR-kod
                </AppButton>
                <AppButton fill="outline" className="w-[45%]">
                  <IonIcon icon={shareSocialOutline} slot="start" />
                  Share
                </AppButton>
              </div>

              <div id="socialAccounts" className="flex gap-5">
                {socialMediaAccountsData?.twitter && (
                  <div
                    id="block"
                    className={classNames(
                      styles.block,
                      "ion-activatable",
                      "relative"
                    )}
                  >
                    <IonIcon icon={logoTwitter} size="large" />
                    Twitter
                    <IonRippleEffect />
                  </div>
                )}
              </div>

              <div id="contacts">
                <IonList lines="none">
                  <IonListHeader>
                    <IonLabel>Kontakt Information</IonLabel>
                  </IonListHeader>
                  {phoneData && (
                    <IonItem>
                      <IonIcon icon={phonePortraitOutline} slot="end" />
                      <IonLabel>
                        <p>Telefonnummer</p>
                        <h6>
                          <a>{new AsYouType("SE").input(phoneData.number)}</a>
                        </h6>
                      </IonLabel>
                    </IonItem>
                  )}
                </IonList>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
