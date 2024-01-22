import welcomeImageUrl from "@/assets/welcome.svg";
import { IonButton, IonContent, IonImg, IonPage, IonText } from "@ionic/react";
import styles from "./Onboard.module.scss";
export default function OnboardPage() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className={styles.container}>
          <IonImg src={welcomeImageUrl} className={styles.welcomeImage} />

          <div>
            <IonText>
              <h2>Welcome to the app</h2>
            </IonText>
            <IonText color="medium" className="text-sm">
              We're excited to help you book and manage you service appointments
              with ease.
            </IonText>
          </div>

          <IonButton routerLink="/login" shape="round" className="w-full">
            Logga in
          </IonButton>

          <IonButton fill="clear" routerLink="/register">
            Create an account
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
