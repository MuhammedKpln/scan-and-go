import HomeNotesCard from "@/modules/note/home_notes_card.module";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { lazy, useCallback } from "react";
import styles from "./Home.module.scss";

export default function HomePage() {
  const [showModal, hideModal] = useIonModal(
    lazy(() => import("@/modules/note/new_note.module")),
    {
      onDismiss: (data: string, role: string) => hideModal(data, role),
    }
  );

  const onClickAddNote = useCallback(() => {
    showModal();
  }, []);

  return (
    <IonPage className="ion-padding">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle>Hem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={styles.ionPage}>
          <HomeNotesCard />

          <IonButton onClick={onClickAddNote}>
            <IonIcon icon={addOutline} />
            Lägg till nytt anteckning
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
