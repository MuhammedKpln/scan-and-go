import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import styles from "./Home.module.scss";

export default function HomePage() {
  const router = useIonRouter();

  return (
    <IonPage className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle>Hem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={styles.ionPage}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Anteckningar</IonCardTitle>
              <IonCardSubtitle>Sparade anteckningar</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList>
                <IonItem
                  onClick={() => router.push("/note")}
                  lines="none"
                  button
                >
                  <IonLabel>
                    <h3>Pokémon Yellow</h3>
                    <p>2023-02-21</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonButton>
            <IonIcon icon={addOutline} />
            Lägg till nytt anteckning
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
