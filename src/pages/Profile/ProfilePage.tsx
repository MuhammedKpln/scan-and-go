import { AuthContext } from "@/context/AuthContext";
import { useColletionDataOnce } from "@/hooks/useCollectionDataOnce";
import { IUser } from "@/models/user.model";
import { converter, db } from "@/services/firebase.service";
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
  const [loading, data, error] = useColletionDataOnce<IUser>(docRef);

  if (error) {
    return (
      <IonPage>
        <IonAlert>seklam</IonAlert>
      </IonPage>
    );
  }

  if (loading) {
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
              {`${data?.firstName} ${data?.lastName}` ?? "No name"}
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
              <h3>{`${data?.firstName} ${data?.lastName}` ?? "No name"}</h3>
            </IonText>
            <IonText>{data?.bio}</IonText>

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
          <IonButton onClick={() => authContext?.logout()}>
            Visa QR-Koden
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
