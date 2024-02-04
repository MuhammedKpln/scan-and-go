import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { TagDetailPageProps } from "@/pages/Tag/Tag";
import styles from "@/pages/Tag/Tag.module.scss";
import { noteService } from "@/services/note.service";
import { profileService } from "@/services/profile.service";
import { tagService } from "@/services/tag.service";
import {
  IonButton,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  useIonAlert,
  useIonModal,
  useIonRouter,
} from "@ionic/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  logoTwitter,
  mailOpenOutline,
  phonePortraitOutline,
} from "ionicons/icons";
import { useCallback, useMemo } from "react";
import SendMessageModule from "./send_message.module";

export default function TagModule(props: TagDetailPageProps) {
  const [showAlert] = useIonAlert();
  const router = useIonRouter();
  const { isSignedIn } = useAuthContext();

  const fetchTag = useCallback(() => {
    return tagService.fetchTag(props.match.params.tagUid);
  }, []);

  const tagQuery = useQuery({
    queryKey: [QueryKeys.Tag, props.match.params.tagUid],
    queryFn: fetchTag,
    networkMode: "online",
  });

  const [showSendMessageModal, hideSendMessageModal] = useIonModal(
    SendMessageModule,
    {
      onCancel: () => hideSendMessageModal(undefined, "cancel"),
      onConfirm: () => hideSendMessageModal(undefined, "confirm"),
      toUserUid: tagQuery?.data?.data()?.userUid,
    }
  );

  const fetchProfile = useCallback(() => {
    return profileService.fetchProfile(tagQuery?.data!.data()!.userUid);
  }, [tagQuery]);

  const sendMessage = useCallback(() => {
    showSendMessageModal({
      initialBreakpoint: 0.5,
    });
  }, []);

  const profileQuery = useQuery({
    queryKey: [QueryKeys.Profile, tagQuery?.data?.data()?.userUid],
    queryFn: fetchProfile,
    enabled: !!tagQuery?.data?.data()?.userUid && tagQuery.data.exists(),
    networkMode: "online",
  });

  const fetchPhoneNumber = useCallback(() => {
    return profileService.fetchPhoneNumber(tagQuery?.data!.data()!.userUid);
  }, [tagQuery]);

  const fetchSocialMediaAccounts = useCallback(() => {
    return profileService.fetchSocialMediaAccounts(
      tagQuery?.data!.data()!.userUid
    );
  }, [tagQuery]);

  const fetchLatestNotes = useCallback(() => {
    return noteService.fetchLatestNotes(tagQuery.data!.data()!.userUid);
  }, [tagQuery]);

  const [phoneQuery, socialMediaQuery, notesQuery] = useQueries({
    queries: [
      {
        queryKey: [QueryKeys.UserPhone, tagQuery?.data?.data()?.userUid],
        queryFn: fetchPhoneNumber,
        networkMode: "online",
        enabled:
          !!tagQuery?.data?.data()?.userUid &&
          tagQuery.data.exists() &&
          profileQuery.data?.data()?.showPhoneNumber,
      },
      {
        queryKey: [
          QueryKeys.UserSocialMediaAccounts,
          tagQuery?.data?.data()?.userUid,
        ],
        networkMode: "online",
        queryFn: fetchSocialMediaAccounts,
        enabled: !!tagQuery?.data?.data()?.userUid && tagQuery.data.exists(),
      },
      {
        networkMode: "online",
        queryKey: [QueryKeys.Notes, tagQuery?.data?.data()?.userUid],
        queryFn: fetchLatestNotes,
        enabled: !!tagQuery?.data?.data()?.userUid && tagQuery.data.exists(),
      },
    ],
  });

  const userLatestNote = useMemo(() => {
    if (notesQuery.isLoading) {
      return;
    }

    if (!notesQuery.data?.empty) {
      return notesQuery?.data?.docs[0].data().content;
    }

    return tagQuery?.data?.data()?.tagNote;
  }, [notesQuery, tagQuery]);

  const profileData = useMemo(() => profileQuery.data?.data(), [profileQuery]);
  const socialData = useMemo(
    () => socialMediaQuery.data?.data(),
    [socialMediaQuery]
  );
  const phoneData = useMemo(() => phoneQuery.data?.data(), [phoneQuery]);

  if (tagQuery.isLoading || profileQuery.isLoading) {
    return <AppLoading message="Loading tag..." />;
  }

  if (!tagQuery?.data?.exists()) {
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
    <div className={styles.container}>
      <div id="userDetails" className="">
        <img
          src={profileData?.profileImageRef}
          className="w-32 h-32 rounded-full"
        />

        <h1>
          {profileData?.firstName} {profileData?.lastName}
        </h1>
        <IonText color="medium">{profileData?.bio}</IonText>
      </div>

      {profileData?.sendMessageAllowed && isSignedIn && (
        <IonButton onClick={sendMessage} fill="solid">
          Skicka meddelande
        </IonButton>
      )}

      <IonItem className={styles.noteContainer} lines="none">
        <IonLabel>
          <p>Anteckning</p>
          <h6>
            {notesQuery.isLoading ? <IonSpinner /> : <>{userLatestNote}</>}
          </h6>
        </IonLabel>
      </IonItem>

      <div id="userQr" className={styles.qrCodeContainer}>
        <IonImg
          src="https://docs.lightburnsoftware.com/img/QRCode/ExampleCode.png"
          className="w-36 h-36"
        />
      </div>

      <IonList>
        {phoneData && (
          <IonItem
            href={`tel:${phoneData.value}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IonIcon icon={phonePortraitOutline} slot="start" />
            <IonLabel>
              <p>Phone</p>
              <h6>
                <a>{phoneData.value}</a>
              </h6>
            </IonLabel>
          </IonItem>
        )}

        <IonItem
          href={`mailto:email@address.com`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IonIcon icon={mailOpenOutline} slot="start" />

          <IonLabel>
            <p>Email</p>
            <h6>
              <a>email@address.com</a>
            </h6>
          </IonLabel>
        </IonItem>

        {socialData && (
          <IonItem
            href={`https://twitter.com/${socialData.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IonIcon icon={logoTwitter} slot="start" />
            <IonLabel>
              <p>Twitter</p>
              <h6>
                <a>{socialData.twitter}</a>
              </h6>
            </IonLabel>
          </IonItem>
        )}
      </IonList>
    </div>
  );
}
