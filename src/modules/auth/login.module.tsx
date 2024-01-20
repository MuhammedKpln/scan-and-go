import { auth } from "@/services/firebase.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonInput,
  IonText,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useAuthSignInWithEmailAndPassword } from "@react-query-firebase/auth";
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
  const signInMutation = useAuthSignInWithEmailAndPassword(auth);
  const router = useIonRouter();
  const [present] = useIonToast();
  const {
    handleSubmit,
    control,
    formState: { errors, touchedFields },
  } = useForm<Inputs>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(async (data: Inputs) => {
    const user = await signInMutation.mutateAsync(data);

    if (user.user) {
      await present("Logged in successfully.", 3000);
      router.push("/");
    }
  }, []);

  return (
    <>
      <div className={styles.logoBg}>G</div>
      <IonText>
        <h1>Scan & Go</h1>
      </IonText>
      <IonText color="medium">
        <h6>
          Belajar gratis di Namanyajugabelajar.io, dan memulai karir yang kamu
          cita-citata sejak dalam embrio!
        </h6>
      </IonText>

      <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }, fieldState }) => (
            <IonInput
              className={`${!errors.email ? "ion-valid" : "ion-invalid"} ${
                fieldState.isTouched ? "ion-touched" : null
              }`}
              label="Email"
              fill="solid"
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
              fill="solid"
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

        <IonButton type="submit" expand="full">
          Logga in
        </IonButton>
      </form>
    </>
  );
}
