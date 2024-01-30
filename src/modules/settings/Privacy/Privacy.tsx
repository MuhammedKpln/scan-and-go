import { IonLabel, IonList, IonListHeader } from "@ionic/react";
import PhoneVisibility from "./PhoneVisibility";

export default function Privacy() {
  return (
    <IonList inset>
      <IonListHeader>
        <IonLabel>Privacy</IonLabel>
      </IonListHeader>

      <PhoneVisibility />
    </IonList>
  );
}
