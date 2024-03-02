import Verification from "@/assets/verification.svg";
import AppHeader from "@/components/App/AppHeader";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { Routes } from "@/routes/routes";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import {
  IonButton,
  IonContent,
  IonImg,
  IonPage,
  IonText,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { Redirect } from "react-router";
import styles from "./verification.module.scss";

export default function VerificationPage() {
  const user = useAuthStore((state) => state.user);
  const { showToast } = useAppToast();
  const router = useIonRouter();

  const onClickResend = useCallback(async () => {
    await authService.sendVerificationEmail(user!.email!);

    showToast({
      message: "Vi har skickat ett nytt verifierings mejl.",
      status: ToastStatus.Success,
    });
  }, [user]);

  if (
    router.routeInfo.search === `?verified=true` &&
    user?.email_confirmed_at
  ) {
    showToast({
      message: "Du har nu verifierad ditt emejl!",
      status: ToastStatus.Success,
    });
    return <Redirect to={Routes.AppRoot} />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Verifiera dig!</IonTitle>
      </AppHeader>

      <IonContent className="ion-padding">
        <div className={styles.container}>
          <div>
            <motion.div
              className="box"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <IonImg src={Verification} className={styles.image} />
            </motion.div>
            <h1>Kontrollera din e-post</h1>
            <IonText>
              Kontrollera din e-post och klicka på länken för att verifiera. Vi
              har skickat till:
            </IonText>
            <p className="font-bold">{user?.email}</p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <IonButton href="mailto:">Öppna e-postmeddelanden</IonButton>
            <IonButton color="light" onClick={onClickResend}>
              Skicka om e-post
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
