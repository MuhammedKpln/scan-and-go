import { IRegisterUserForm } from "@/models/user.model";
import { Routes } from "@/routes/routes";
import { fbAuthService } from "@/services/firebase-auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonInput,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./register.module.scss";

const registerFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Minimum 5 karaktär."),
  firstName: z.string().min(3, "Minimum 3 karaktär."),
  lastName: z.string().min(3, "Minimum 3 karaktär."),
});

export default function RegisterModule() {
  const [showToast] = useIonToast();
  const router = useIonRouter();
  const [showLoading, dismissLoading] = useIonLoading();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRegisterUserForm>({
    resolver: zodResolver(registerFormSchema),
    reValidateMode: "onChange",
  });

  const onSubmit = useCallback(async (data: IRegisterUserForm) => {
    try {
      await showLoading();
      await fbAuthService.createUser(data);

      await dismissLoading();
      showToast({
        color: "success",
        message: "Reg success",
        duration: 2000,
      });
      router.push(Routes.Verification, "forward", "replace");
    } catch (error) {
      await dismissLoading();
      showToast({
        color: "danger",
        message: "Reg error " + error,
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
