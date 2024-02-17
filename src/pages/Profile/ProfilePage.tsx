import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import ProfileView from "@/components/ProfileView/ProfileView";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { IUser } from "@/models/user.model";
import UpdateProfileModule from "@/modules/profile/UpdateProfile.module";
import { Routes } from "@/routes/routes";
import {
  IUserWithPhoneAndSocial,
  profileService,
} from "@/services/profile.service";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { pencilOutline, settingsOutline } from "ionicons/icons";
import { useCallback, useMemo } from "react";

export default function ProfilePage() {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
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
    queryKey: [QueryKeys.ProfileWithRelations, authContext.user?.id],
    queryFn: async () => {
      const profile = await profileService.fetchProfile(authContext.user!.id);

      queryClient.setQueryData<IUser>(
        [QueryKeys.Profile, authContext.user?.id],
        () => {
          const data = produce<Partial<IUserWithPhoneAndSocial>>(
            profile,
            (draft) => {
              delete draft.social_media_accounts;
              delete draft.phone_numbers;
            }
          );

          return data as IUser;
        }
      );

      return profile;
    },
  });

  const socialMediaAccounts = useMemo(() => {
    if (profileQuery.isSuccess) {
      return profileQuery.data.social_media_accounts.length > 0
        ? profileQuery.data.social_media_accounts[0]
        : undefined;
    }

    return undefined;
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

  if (profileQuery.isLoading) {
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
