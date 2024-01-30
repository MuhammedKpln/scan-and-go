import { IonItem, IonToggle } from "@ionic/react";
import { useCallback } from "react";

export default function PhoneVisibility() {
  const onChange = useCallback(() => {}, []);

  return (
    <IonItem>
      <IonToggle onIonChange={onChange}>Visa mitt telefonnummer</IonToggle>
    </IonItem>
  );
}
