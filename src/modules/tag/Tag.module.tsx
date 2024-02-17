import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import ProfileView from "@/components/ProfileView/ProfileView";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { TagDetailPageProps } from "@/pages/Tag/Tag";
import { Routes } from "@/routes/routes";
import { ITagWithRelations, tagService } from "@/services/tag.service";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonTitle,
  useIonAlert,
  useIonModal,
  useIonRouter,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { chevronBackSharp } from "ionicons/icons";
import { useCallback, useMemo } from "react";
import SendMessageModule from "./send_message.module";

export default function TagModule(props: TagDetailPageProps) {
  const [showAlert] = useIonAlert();
  const router = useIonRouter();
  const { isSignedIn } = useAuthContext();

  const fetchTag = useCallback(() => {
    return tagService.fetchTag(props.match.params.tagUid);
  }, []);

  const tagQuery = useQuery<ITagWithRelations>({
    queryKey: [QueryKeys.Tag, props.match.params.tagUid],
    queryFn: fetchTag,
    networkMode: "online",
  });
  const profileData = useMemo(() => tagQuery.data?.profiles, [tagQuery]);

  const sendMessage = useCallback(() => {
    showSendMessageModal({
      initialBreakpoint: 0.5,
    });
  }, []);

  const [showSendMessageModal, hideSendMessageModal] = useIonModal(
    SendMessageModule,
    {
      onCancel: () => hideSendMessageModal(undefined, "cancel"),
      onConfirm: () => hideSendMessageModal(undefined, "confirm"),
      toUserUid: profileData?.id,
      toUser: profileData,
    }
  );

  const goBack = useCallback(() => {
    router.push(Routes.AppRoot, "root", "replace");
  }, []);

  const userLatestNote = useMemo(() => {
    if (!tagQuery.isSuccess) return "";

    if (tagQuery.data.notes.length > 0) {
      return tagQuery.data.notes[0].content;
    }

    return tagQuery.data.note;
  }, [tagQuery]);

  const phoneData = useMemo(() => {
    if (!tagQuery.isSuccess) return;

    if (tagQuery.data.profiles?.phone_numbers) {
      return tagQuery.data.profiles?.phone_numbers[0];
    }
  }, [tagQuery]);

  const socialMediaAccountsData = useMemo(() => {
    if (!tagQuery.isSuccess) return;

    if (tagQuery.data.profiles?.social_media_accounts) {
      return tagQuery.data.profiles?.social_media_accounts[0];
    }
  }, [tagQuery]);

  if (tagQuery.isLoading) {
    return <AppLoading message="Loading tag..." />;
  }

  if (!tagQuery?.data) {
    showAlert({
      message: "Kunde inte hitta taggen",
      buttons: [
        {
          text: "Ok",
          handler: () => router.push("/", "root", "replace"),
        },
      ],
    });

    return;
  }

  return (
    <>
      <AppHeader>
        <IonButtons slot="start">
          <IonButton onClick={goBack}>
            <IonIcon icon={chevronBackSharp} />
          </IonButton>
        </IonButtons>

        <IonTitle>
          {profileData?.firstName} {profileData?.lastName}
        </IonTitle>
      </AppHeader>
      <IonContent className="ion-padding">
        <ProfileView
          bioContent={userLatestNote}
          bioText="Anteckning"
          profileData={profileData!}
          onSendMessage={sendMessage}
          phoneData={phoneData}
          socialData={socialMediaAccountsData}
          isSignedIn={isSignedIn}
          showSendMessageBtn={profileData?.sendMessageAllowed}
        />
      </IonContent>
    </>
  );
}
