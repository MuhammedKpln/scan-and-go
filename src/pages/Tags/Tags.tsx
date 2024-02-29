import TagsModule from "@/modules/tags/tags.module";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export default function TagsPage() {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Etiketter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Etiketter</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <TagsModule />
        </div>
      </IonContent>
    </IonPage>
  );
}
