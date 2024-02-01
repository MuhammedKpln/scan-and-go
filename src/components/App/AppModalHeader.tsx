import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { PropsWithChildren } from "react";

interface IProps extends PropsWithChildren {
  onClose: () => void;
}

export default function AppModalHeader({ children, onClose }: IProps) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonButtons>

        {children}
      </IonToolbar>
    </IonHeader>
  );
}
