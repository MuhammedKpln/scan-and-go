import { IonLabel, IonList, IonListHeader } from "@ionic/react";
import AllowMessages from "./AllowMessages";
import PhoneVisibility from "./PhoneVisibility";

export default function Privacy() {
  return (
    <IonList inset>
      <IonListHeader>
        <IonLabel>Privacy</IonLabel>
      </IonListHeader>

      <PhoneVisibility />
      <AllowMessages />
    </IonList>
  );
}
