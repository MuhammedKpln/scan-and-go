import AppHeader from "@/components/App/AppHeader";
import DividerWithText from "@/components/DividerWithText/DividerWithText";
import RegisterModule from "@/modules/auth/register.module";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
} from "@ionic/react";
import { logoApple, logoGoogle } from "ionicons/icons";

export default function RegisterPage() {
  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Registrera dig</IonTitle>
      </AppHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col justify-evenly gap-3">
          <div>
            <IonText>
              <h1>Registrera dig</h1>
            </IonText>
            <IonText color="medium">Welcome to the family!</IonText>
          </div>
          <RegisterModule />

          <DividerWithText text="eller forsätt med" />

          <IonButton shape="round" fill="outline" color="secondary">
            <IonIcon slot="start" icon={logoGoogle} />
            Fortsätt med Google
          </IonButton>
          <IonButton shape="round" fill="outline" color="secondary">
            <IonIcon slot="start" icon={logoApple} />
            Fortsätt med Apple
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
