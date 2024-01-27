import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { AuthContext } from "@/context/AuthContext";
import { QueryStatus } from "@/hooks/base";
import { useColletionDataOnce } from "@/hooks/useCollectionDataOnce";
import { IUser } from "@/models/user.model";
import { Routes } from "@/routes/routes";
import { converter, db } from "@/services/firebase.service";
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
} from "@ionic/react";
import { doc } from "firebase/firestore";
import { logoTwitter, settingsOutline } from "ionicons/icons";
import { useContext, useMemo } from "react";
import styles from "./Profile.module.scss";

export default function ProfilePage() {
  const authContext = useContext(AuthContext);
  const docRef = useMemo(
    () =>
      doc(db, "profiles", authContext!.user!.uid).withConverter<IUser>(
        converter()
      ),
    []
  );
  const profile = useColletionDataOnce<IUser>(docRef);

  if (profile.status === QueryStatus.Error) {
    return (
      <IonPage>
        <IonContent>
          <AppInfoCard message="Error!" status={InfoCardStatus.Error} />
        </IonContent>
      </IonPage>
    );
  }

  if (profile.status === QueryStatus.Loading) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonTitle>
              {`${profile.data?.firstName} ${profile.data?.lastName}` ??
                "No name"}
            </IonTitle>
          </IonButtons>
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
                {`${profile.data?.firstName} ${profile.data?.lastName}` ??
                  "No name"}
              </h3>
            </IonText>
            <IonText>{profile.data?.bio}</IonText>

            <IonButtons className="mt-5">
              {profile.data?.socialMediaAccounts?.twitter && (
                <IonButton
                  fill="clear"
                  href={`https://twitter.com/${profile.data.socialMediaAccounts.twitter}`}
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
          <IonButton onClick={() => authContext?.logout()}>
            Visa QR-Koden
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
