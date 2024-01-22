import DividerWithText from "@/components/DividerWithText/DividerWithText";
import LoginModule from "@/modules/auth/login.module";
import { IonButton, IonContent, IonIcon, IonPage, IonText } from "@ionic/react";
import { logoApple, logoGoogle } from "ionicons/icons";

export default function LoginPage() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex flex-col justify-evenly gap-3 h-full">
          <div>
            <IonText>
              <h1>Login</h1>
            </IonText>
            <IonText color="medium">Welcome back to the app</IonText>
          </div>
          <LoginModule />

          <DividerWithText text="eller forsätt med" />

          <IonButton shape="round" fill="outline" color="secondary">
            <IonIcon slot="start" icon={logoGoogle} />
            Fortsätt med Google
          </IonButton>
          <IonButton shape="round" fill="outline" color="secondary">
            <IonIcon slot="start" icon={logoApple} />
            Fortsätt med Apple
          </IonButton>

          <DividerWithText text="eller" />
          <IonButton fill="clear">Skapa ett konto</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
