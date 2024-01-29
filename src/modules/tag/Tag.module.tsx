import AppLoading from "@/components/App/AppLoading";
import { TagDetailPageProps } from "@/pages/Tag/Tag";
import styles from "@/pages/Tag/Tag.module.scss";
import { noteService } from "@/services/note.service";
import { profileService } from "@/services/profile.service";
import { tagService } from "@/services/tag.service";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import {
  logoTwitter,
  mailOpenOutline,
  phonePortraitOutline,
} from "ionicons/icons";
import { useMemo } from "react";
import { Redirect } from "react-router";

export default function TagModule(props: TagDetailPageProps) {
  const tagQuery = useQuery({
    queryKey: ["tag", props.match.params.tagUid],
    queryFn: () => {
      return tagService.fetchTag(props.match.params.tagUid);
    },
  });

  const profileQuery = useQuery({
    enabled: !!tagQuery.data?.data()?.userUid && tagQuery.data.exists(),
    queryKey: ["notes", tagQuery.data?.data()?.userUid],
    queryFn: () => {
      return profileService.fetchProfile(tagQuery.data!.data()!.userUid);
    },
  });

  const notesQuery = useQuery({
    enabled: !!tagQuery.data?.data()?.userUid && tagQuery.data.exists(),
    queryKey: ["profile", tagQuery.data?.data()?.userUid],
    queryFn: () => {
      return noteService.fetchLatestNotes(tagQuery.data!.data()!.userUid);
    },
  });
  const userLatestNote = useMemo(() => {
    console.log(notesQuery);

    if (notesQuery.isLoading) {
      return;
    }

    if (!notesQuery.data?.empty) {
      return notesQuery?.data?.docs[0].data().content;
    }

    return tagQuery.data?.data()?.tagNote;
  }, [notesQuery]);

  const profileData = profileQuery.data?.data();

  if (tagQuery.isLoading || profileQuery.isLoading) {
    return <AppLoading message="Loading tag..." />;
  }

  if (!tagQuery.data?.exists()) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.container}>
      <div id="userDetails" className="">
        <img
          src={profileData?.profileImageRef?.toString()}
          className="w-32 h-32 rounded-full"
        />

        <h1>
          {profileData?.firstName?.toString()}{" "}
          {profileData?.lastName?.toString()}
        </h1>
        <IonText color="medium">{profileData?.bio?.toString()}</IonText>
      </div>

      <div className={styles.noteContainer}>
        {notesQuery.isLoading ? <IonSpinner /> : <>{userLatestNote}</>}
      </div>

      <div id="userQr" className={styles.qrCodeContainer}>
        <img
          src="https://docs.lightburnsoftware.com/img/QRCode/ExampleCode.png"
          className="w-36 h-36"
        />
      </div>

      <IonList inset className="w-full">
        <IonItem>
          <IonIcon icon={phonePortraitOutline} slot="start" />
          <IonLabel>
            <p>Phone</p>
            <h6>
              <a href="tel:+1 000-000-000">+1 000-000-000</a>
            </h6>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon icon={mailOpenOutline} slot="start" />

          <IonLabel>
            <p>Email</p>
            <h6>
              <a href="mailto:email@address.com">email@address.com</a>
            </h6>
          </IonLabel>
        </IonItem>

        {profileData?.socialMediaAccounts?.twitter && (
          <IonItem>
            <IonIcon icon={logoTwitter} slot="start" />
            <IonLabel>
              <p>Twitter</p>
              <h6>
                <a
                  href={`https://twitter.com/${profileData.socialMediaAccounts.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profileData.socialMediaAccounts.twitter}
                </a>
              </h6>
            </IonLabel>
          </IonItem>
        )}
      </IonList>
    </div>
  );
}
