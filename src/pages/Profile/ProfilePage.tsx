import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import ProfileView from "@/components/ProfileView/ProfileView";
import { QueryKeys } from "@/models/query_keys.model";
import { IUserWithPhoneAndSocial } from "@/models/user.model";
import UpdateProfileModule from "@/modules/profile/UpdateProfile.module";
import { Routes } from "@/routes/routes";
import { profileService } from "@/services/profile.service";
import { useAuthStore } from "@/stores/auth.store";
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
import { useQuery } from "@tanstack/react-query";
import { pencilOutline, settingsOutline } from "ionicons/icons";
import { useCallback, useMemo } from "react";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

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

  const profileQuery = useQuery<IUserWithPhoneAndSocial>({
    queryKey: [QueryKeys.ProfileWithRelations, user?.id],
    queryFn: async () => {
      const profile = await profileService.fetchProfile(user!.id);

      return profile;
    },
  });

  const socialMediaAccounts = useMemo(() => {
    return profileQuery.data?.social_media_accounts;
  }, [profileQuery]);

  if (profileQuery.isError) {
    return (
      <IonPage>
        <IonContent>
          <AppInfoCard message="Error!" status={InfoCardStatus.Error} />
        </IonContent>
      </IonPage>
    );
  }

  if (profileQuery.isPending) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {`${profileQuery.data?.firstName} ${profileQuery.data?.lastName}` ??
              "No name"}
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
        <ProfileView
          bioContent={profileQuery.data!.bio!}
          bioText="Biografi"
          profileData={profileQuery.data!}
          socialData={socialMediaAccounts}
        />
      </IonContent>
    </IonPage>
  );
}
