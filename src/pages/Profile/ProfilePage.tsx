import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import ProfileView from "@/components/ProfileView/ProfileView";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import UpdateProfileModule from "@/modules/profile/UpdateProfile.module";
import { Routes } from "@/routes/routes";
import { profileService } from "@/services/profile.service";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { useQueries } from "@tanstack/react-query";
import { pencilOutline, settingsOutline } from "ionicons/icons";
import { useCallback, useMemo } from "react";

export default function ProfilePage() {
  const authContext = useAuthContext();
  const [showProfilePictureModal, hideProfilePictureModal] = useIonModal(
    UpdateProfileModule,
    {
      onClose: () => hideProfilePictureModal(undefined, "cancel"),
      onConfirm: () => hideProfilePictureModal(undefined, "confirm"),
    }
  );

  const onClickEdit = useCallback(() => {
    showProfilePictureModal({
      breakpoints: [0.25, 0.5, 0.75],
      initialBreakpoint: 0.75,
    });
  }, []);

  const [profileQuery, socialMediaAccountsQuery] = useQueries({
    queries: [
      {
        queryKey: [QueryKeys.Profile, authContext.user?.uid],
        queryFn: async () => {
          const profile = await profileService.fetchProfile(
            authContext.user!.uid
          );

          return profile.data();
        },
      },
      {
        queryKey: [QueryKeys.UserSocialMediaAccounts, authContext.user?.uid],
        queryFn: async () => {
          const socialMedia = await profileService.fetchSocialMediaAccounts(
            authContext.user!.uid
          );

          return socialMedia.data();
        },
      },
    ],
  });

  const profile = useMemo(() => profileQuery?.data, [profileQuery]);

  const socialMediaAccounts = useMemo(
    () => socialMediaAccountsQuery?.data,
    [socialMediaAccountsQuery]
  );

  if (profileQuery.isError) {
    return (
      <IonPage>
        <IonContent>
          <AppInfoCard message="Error!" status={InfoCardStatus.Error} />
        </IonContent>
      </IonPage>
    );
  }

  if (profileQuery.isLoading) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {`${profile?.firstName} ${profile?.lastName}` ?? "No name"}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={Routes.Settings}>
              <IonIcon icon={settingsOutline} />
            </IonButton>
            <IonButton onClick={onClickEdit}>
              <IonIcon icon={pencilOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {profile && (
          <ProfileView
            bioContent={profile.bio!}
            bioText="Biografi"
            profileData={profile!}
            showSocial
            socialData={socialMediaAccounts}
          />
        )}
      </IonContent>
    </IonPage>
  );
}
