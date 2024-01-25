import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { Routes } from "@/routes/routes";
import { FirebaseAuthService } from "@/services/firebase-auth.service";
import { auth, db } from "@/services/firebase.service";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { IonButton, IonInput, useIonAlert, useIonRouter } from "@ionic/react";
import { User } from "firebase/auth";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./login.module.scss";

type Inputs = {
  email: string;
  password: string;
};

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Minimum 5 karaktär."),
});

export default function LoginModule() {
  const router = useIonRouter();
  const { showToast } = useAppToast();
  const [presentAlert] = useIonAlert();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onChange",
  });

  const sendVerificationMail = useCallback(async (user: User) => {
    const authService = new FirebaseAuthService(auth, db);
    await authService.sendVerificationEmail(user);

    showToast({
      message: "Email verification succesfully send!",
      status: ToastStatus.Success,
    });
  }, []);

  const onSubmit = useCallback(async (data: Inputs) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (user.user.emailVerified) {
        showToast({
          message: "Logged in successfully.",
          status: ToastStatus.Success,
        });
        router.push("/");
      } else {
        await presentAlert({
          message: "You need to activate you're account before proceeding.",
          subHeader: "Account verification",
          buttons: [
            {
              text: "Send verification mail",
              handler: () => sendVerificationMail(user.user),
            },
            {
              text: "Cancel",
              role: "cancel",
            },
          ],
        });
      }
    } catch (error) {
      showToast({
        message: "Kunde inte logga in, är du registrerad hos oss?",
        status: ToastStatus.Error,
        buttons: [
          {
            text: "Skapa ett konto",
            handler: () => router.push(Routes.Register),
          },
        ],
      });
    }
  }, []);

  return (
    <>
      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <IonInput
              className={`${!errors.email ? "ion-valid" : "ion-invalid"} ${
                fieldState.isTouched ? "ion-touched" : null
              }`}
              label="Email"
              fill="outline"
              labelPlacement="floating"
              type="email"
              errorText={errors.email?.message ?? undefined}
              onIonBlur={onBlur}
              onIonChange={onChange}
              value={value}
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <IonInput
              className={`${!errors.password ? "ion-valid" : "ion-invalid"} ${
                fieldState.isTouched ? "ion-touched" : null
              }`}
              label="Lösenord"
              fill="outline"
              type="password"
              labelPlacement="floating"
              errorText={errors.password?.message ?? undefined}
              onIonBlur={onBlur}
              onIonChange={onChange}
              value={value}
            />
          )}
          name="password"
        />

        <IonButton type="submit" expand="full" shape="round">
          Logga in
        </IonButton>
      </form>
    </>
  );
}
