import { useFcmToken } from "@/hooks/useFcmToken";
import HomeNotesCard from "@/modules/note/home_notes_card.module";
import NewNoteModule from "@/modules/note/new_note.module";
import TagDialogModule from "@/modules/tag/tag_dialog/tag_dialog.module";
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
import { lazy, useCallback, useEffect } from "react";
import styles from "./Home.module.scss";

const UserAlerts = lazy(
  () => import("@/components/Home/UserAlerts/UserAlerts")
);

export default function HomePage() {
  const { deInit: fcmDeInit, init: fcmInit } = useFcmToken();

  const [showNewNoteModal, hideNewNoteModal] = useIonModal(NewNoteModule, {
    onDismiss: (data: string, role: string) => hideNewNoteModal(data, role),
  });
  const [show, hide] = useIonModal(TagDialogModule, {
    onDismiss: (data: string, role: string) => hide(data, role),
  });

  const onClickAddNote = useCallback(() => {
    show({
      breakpoints: [0.5, 0.75],
      initialBreakpoint: 0.5,
    });
  }, []);

  useEffect(() => {
    fcmInit();

    return () => {
      fcmDeInit();
      hide(undefined, "cancel");
    };
  }, []);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Hem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hem</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className={styles.ionPage}>
          <div>
            <UserAlerts />
            <HomeNotesCard />
          </div>

          <IonButton onClick={onClickAddNote}>
            <IonIcon icon={addOutline} />
            Lägg till nytt anteckning
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
