import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface IProps {
  onDismiss: (data?: string, role?: string) => void;
}
export default function NewNoteModule(props: IProps) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={() => props.onDismiss(undefined, "cancel")}
            >
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Temporary note</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => props.onDismiss(undefined, "confirm")}
              strong={true}
            >
              Publish
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonSelect label="Select a tag">
              <IonSelectOption value="">BMW</IonSelectOption>
              <IonSelectOption value="">Mercedes</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonTextarea
              placeholder="Not detaylari"
              labelPlacement="floating"
              label="Not detaylari"
            ></IonTextarea>
          </IonItem>
          <IonItem>
            <IonLabel>Choose a expire time</IonLabel>
            <IonDatetimeButton datetime="datetime">se</IonDatetimeButton>
          </IonItem>
        </IonList>
        <IonModal keepContentsMounted={true}>
          <IonContent>
            <IonDatetime id="datetime" presentation="time" locale="sv-SE" />;
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
}
