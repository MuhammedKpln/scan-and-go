import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { PropsWithChildren, RefObject } from "react";

interface IProps extends PropsWithChildren {
  modalRef: RefObject<HTMLIonModalElement>;
}

export default function AppModalHeader({ children, modalRef }: IProps) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton
            onClick={() => modalRef.current?.dismiss(undefined, "cancel")}
          >
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonButtons>

        {children}
      </IonToolbar>
    </IonHeader>
  );
}
