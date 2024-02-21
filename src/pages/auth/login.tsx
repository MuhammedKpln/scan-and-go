import AppHeader from "@/components/App/AppHeader";
import DividerWithText from "@/components/DividerWithText/DividerWithText";
import LoginModule from "@/modules/auth/login.module";
import { Routes } from "@/routes/routes";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
} from "@ionic/react";
import { logoApple, logoGoogle } from "ionicons/icons";

export default function LoginPage() {
  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Login</IonTitle>
      </AppHeader>
      <IonContent className="ion-padding">
        <div className="flex flex-col justify-evenly gap-3">
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
          <IonButton fill="clear" routerLink={Routes.Register}>
            Skapa ett konto
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
