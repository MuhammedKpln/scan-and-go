import { IRegisterUserForm } from "@/models/user.model";
import { FirebaseAuthService } from "@/services/firebase-auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonInput,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth, useFirestore, useSigninCheck } from "reactfire";
import { z } from "zod";
import styles from "./register.module.scss";

const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Minimum 5 karaktär."),
  firstName: z.string().min(3, "Minimum 3 karaktär."),
  lastName: z.string().min(3, "Minimum 3 karaktär."),
});

export default function RegisterModule() {
  const auth = useAuth();
  const [showToast, dismissToast] = useIonToast();
  const router = useIonRouter();
  const firestore = useFirestore();
  const [showLoading, dismissLoading] = useIonLoading();
  const signInCheck = useSigninCheck();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRegisterUserForm>({
    resolver: zodResolver(registerFormSchema),
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (signInCheck.data.signedIn) {
      const interval = setInterval(() => {
        auth?.currentUser?.reload();
      }, 5_000);

      return () => {
        dismissLoading();

        clearInterval(interval);
        showToast({
          color: "success",
          message: "Reg success",
          duration: 2000,
        });
        router.push("/app", "forward", "replace");
      };
    }
  }, [signInCheck]);

  const onSubmit = useCallback(async (data: IRegisterUserForm) => {
    const fbAuth = new FirebaseAuthService(auth, firestore);

    try {
      await fbAuth.createUser(data);

      showLoading(
        "Vi har skickat ett verifiering mejl, var snäll verifiera dig innan vi fortsätter."
      );
    } catch (error) {
      showToast({
        color: "danger",
        message: "Reg error",
        duration: 2000,
      });
    }
  }, []);

  return (
    <>
      <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <IonInput
              className={`${!errors.firstName ? "ion-valid" : "ion-invalid"} ${
                fieldState.isTouched ? "ion-touched" : null
              }`}
              label="Namn"
              fill="outline"
              labelPlacement="floating"
              errorText={errors.firstName?.message ?? undefined}
              onIonBlur={onBlur}
              onIonChange={onChange}
              value={value}
            />
          )}
          name="firstName"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <IonInput
              className={`${!errors.lastName ? "ion-valid" : "ion-invalid"} ${
                fieldState.isTouched ? "ion-touched" : null
              }`}
              label="Efternamn"
              fill="outline"
              labelPlacement="floating"
              errorText={errors.lastName?.message ?? undefined}
              onIonBlur={onBlur}
              onIonChange={onChange}
              value={value}
            />
          )}
          name="lastName"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <IonInput
              type="email"
              className={`${!errors.email ? "ion-valid" : "ion-invalid"} ${
                fieldState.isTouched ? "ion-touched" : null
              }`}
              label="Email"
              fill="outline"
              labelPlacement="floating"
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
              labelPlacement="floating"
              errorText={errors.password?.message ?? undefined}
              onIonBlur={onBlur}
              onIonChange={onChange}
              value={value}
              type="password"
            />
          )}
          name="password"
        />

        <IonButton type="submit" expand="full" shape="round">
          Registrera mig
        </IonButton>
      </form>
    </>
  );
}
