import { IonLabel, IonList, IonListHeader } from "@ionic/react";
import LogoutSetting from "./LogoutSetting";
import TwitterSetting from "./Twitter/TwitterSetting";

export default function SocialMediaSettings() {
  return (
    <IonList inset>
      <IonListHeader>
        <IonLabel>Profile</IonLabel>
      </IonListHeader>

      <TwitterSetting />
      <LogoutSetting />
    </IonList>
  );
}
