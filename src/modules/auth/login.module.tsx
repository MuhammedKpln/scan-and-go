import { signInWithEmailAndPassword } from "@firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { IonButton, IonInput, useIonRouter, useIonToast } from "@ionic/react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "reactfire";
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
  const auth = useAuth();
  const router = useIonRouter();
  const [present] = useIonToast();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginFormSchema),
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(async (data: Inputs) => {
    const user = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (user.user) {
      await present("Logged in successfully.", 3000);
      router.push("/");
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
