import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { Routes } from "@/routes/routes";
import { profileService } from "@/services/profile.service";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useQueries } from "@tanstack/react-query";
import { logoTwitter, settingsOutline } from "ionicons/icons";
import { useCallback, useMemo } from "react";
import styles from "./Profile.module.scss";

export default function ProfilePage() {
  const authContext = useAuthContext();
  const router = useIonRouter();
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

  const onLogout = useCallback(async () => {
    await authContext?.logout();
    router.push("/", "root", "replace");
  }, []);

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
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={`${styles.ionPage} ion-padding`}>
          <div className="flex justify-center items-center flex-col">
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </IonAvatar>
            <IonText>
              <h3>
                {`${profile?.firstName} ${profile?.lastName}` ?? "No name"}
              </h3>
            </IonText>
            <IonText>{profile?.bio}</IonText>

            <IonButtons className="mt-5">
              {socialMediaAccounts?.twitter && (
                <IonButton
                  fill="clear"
                  href={`https://twitter.com/${socialMediaAccounts.twitter}`}
                  target="_blank"
                >
                  <IonIcon icon={logoTwitter} />
                </IonButton>
              )}
            </IonButtons>
          </div>
          <div className="flex flex-col w-full">
            <IonButton color="secondary" className="mb-5">
              Anteckningar
            </IonButton>
            <IonButton color="secondary">Redigera</IonButton>
          </div>
          <IonButton onClick={onLogout}>Visa QR-Koden</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
