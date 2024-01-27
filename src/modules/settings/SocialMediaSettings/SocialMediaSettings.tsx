import { IonLabel, IonList, IonListHeader } from "@ionic/react";
import TwitterSetting from "./TwitterSetting";

export default function SocialMediaSettings() {
  return (
    <IonList inset>
      <IonListHeader>
        <IonLabel>Profile</IonLabel>
      </IonListHeader>

      <TwitterSetting />
    </IonList>
  );
}
