import Verification from "@/assets/verification.svg";
import AppHeader from "@/components/App/AppHeader";
import { useAuthContext } from "@/context/AuthContext";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { fbAuthService } from "@/services/firebase-auth.service";
import {
  IonButton,
  IonContent,
  IonImg,
  IonPage,
  IonText,
  IonTitle,
} from "@ionic/react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import styles from "./verification.module.scss";

export default function VerificationPage() {
  const { user } = useAuthContext();
  const { showToast } = useAppToast();

  const onClickResend = useCallback(async () => {
    await fbAuthService.sendVerificationEmail(user!);

    showToast({
      message: "Vi har skickat ett nytt verifierings mejl.",
      status: ToastStatus.Success,
    });
  }, [user]);

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
