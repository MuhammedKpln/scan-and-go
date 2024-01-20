import { IUser } from "@/models/user.model";
import { auth, converter, firestore } from "@/services/firebase.service";
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
import { useAuthUser } from "@react-query-firebase/auth";
import { useFirestoreDocument } from "@react-query-firebase/firestore";
import { doc } from "firebase/firestore";
import {
  arrowRedoOutline,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoWhatsapp,
} from "ionicons/icons";
import styles from "./Profile.module.scss";

export default function ProfilePage() {
  const user = useAuthUser(["user"], auth);
  const ref = doc(firestore, "profiles", user.data!.uid).withConverter<IUser>(
    converter()
  );
  const profile = useFirestoreDocument<IUser>(
    ["profiles", user.data?.uid],
    ref
  );

  //   useEffect(() => {
  //     async function fetchData() {
  //       const docRef = doc(firestore, "profiles", user!.uid);
  //       const data = await getDoc(docRef);

  //       console.log(data.data());
  //     }

  //     fetchData();
  //   }, []);

  if (user.isError || profile.isError) {
    return (
      <IonPage>
        <IonAlert>seklam</IonAlert>
      </IonPage>
    );
  }

  if (user.isLoading || profile.isLoading) {
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
              {profile?.data?.data()?.firstName}{" "}
              {profile?.data?.data()?.lastName}
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
                {profile?.data?.data()?.firstName}{" "}
                {profile?.data?.data()?.lastName}
              </h3>
            </IonText>
            <IonText>{profile?.data?.data()?.bio}</IonText>

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
          <IonButton> Visa QR-Koden </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
