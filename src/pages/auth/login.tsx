import LoginModule from "@/modules/auth/login.module";
import { IonContent, IonPage } from "@ionic/react";

function LoginPage() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <LoginModule />
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;
