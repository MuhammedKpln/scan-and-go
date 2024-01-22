import { IUser } from "@/models/user.model";
import { converter } from "@/services/firebase.service";
import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { doc } from "firebase/firestore";
import {
  arrowRedoOutline,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoWhatsapp,
} from "ionicons/icons";
import { useAuth, useFirestore, useFirestoreDocDataOnce } from "reactfire";
import styles from "./Profile.module.scss";

export default function ProfilePage() {
  const user = useAuth();
  const firestore = useFirestore();
  const ref = doc(
    firestore,
    "profiles",
    user.currentUser!.uid
  ).withConverter<IUser>(converter());
  const profile = useFirestoreDocDataOnce<IUser>(ref);

  if (profile.status === "error") {
    return (
      <IonPage>
        <IonAlert>seklam</IonAlert>
      </IonPage>
    );
  }

  if (profile.status === "loading") {
    return (
      <IonPage>
        <IonLoading>Loading..</IonLoading>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonTitle>
              {`${profile.data.firstName} ${profile.data.lastName}` ??
                "No name"}
            </IonTitle>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={arrowRedoOutline} />
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
                {`${profile.data.firstName} ${profile.data.lastName}` ??
                  "No name"}
              </h3>
            </IonText>
            <IonText>{profile.data.bio}</IonText>

            <IonButtons className="mt-5">
              <IonButton fill="clear">
                <IonIcon icon={logoLinkedin} />
              </IonButton>
              <IonButton fill="clear">
                <IonIcon icon={logoInstagram} />
              </IonButton>
              <IonButton fill="clear">
                <IonIcon icon={logoFacebook} />
              </IonButton>
              <IonButton fill="clear">
                <IonIcon icon={logoWhatsapp} />
              </IonButton>
            </IonButtons>
          </div>
          <div className="flex flex-col w-full">
            <IonButton color="secondary" className="mb-5">
              Anteckningar
            </IonButton>
            <IonButton color="secondary">Redigera</IonButton>
          </div>
          <IonButton onClick={() => user.signOut()}>Visa QR-Koden</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
