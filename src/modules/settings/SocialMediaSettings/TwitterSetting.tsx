import AppModalHeader from "@/components/App/AppModalHeader";
import { useAuthContext } from "@/context/AuthContext";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { useUpdateDoc } from "@/hooks/useUpdateDoc";
import { FirebaseCollections } from "@/models/firebase_collections.model";
import { db } from "@/services/firebase.service";
import { doc } from "@firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
} from "@ionic/react";
import { logoTwitter } from "ionicons/icons";
import { useCallback, useMemo, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formValidator = z.object({
  twitterUsername: z.string().startsWith("@"),
});

export default function TwitterSetting() {
  const modalRef = useRef<HTMLIonModalElement>(null);
  const { user } = useAuthContext();
  const { showToast } = useAppToast();
  const { control, handleSubmit } = useForm<typeof formValidator._type>({
    resolver: zodResolver(formValidator),
    reValidateMode: "onSubmit",
  });
  const docRef = useMemo(
    () => doc(db, FirebaseCollections.Profiles, user!.uid),
    []
  );
  const { mutate } = useUpdateDoc(docRef);

  const onSubmit = useCallback(async (inputs: typeof formValidator._type) => {
    try {
      await mutate({
        "socialMediaAccounts.twitter": inputs.twitterUsername,
      });

      showToast({
        message: "Updated succesfully!",
        status: ToastStatus.Success,
      });

      modalRef.current?.dismiss(undefined, "confirm");
    } catch (error) {
      showToast({
        message: "Error!",
        status: ToastStatus.Error,
      });
    }
  }, []);

  return (
    <>
      <IonItem button id="open-twitter-setting">
        <IonIcon icon={logoTwitter} slot="start" />
        <IonLabel>Twitter</IonLabel>
      </IonItem>

      <IonModal
        ref={modalRef}
        trigger="open-twitter-setting"
        initialBreakpoint={0.5}
        breakpoints={[0, 0.25, 0.5, 0.75]}
      >
        <AppModalHeader modalRef={modalRef}>
          <IonTitle>Twitter</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={handleSubmit(onSubmit)}>
              <IonLabel>Save</IonLabel>
            </IonButton>
          </IonButtons>
        </AppModalHeader>

        <IonContent class="ion-padding">
          <Controller
            name="twitterUsername"
            control={control}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { error, isTouched },
            }) => {
              return (
                <IonInput
                  className={`${!error ? "ion-valid" : "ion-invalid"} ${
                    isTouched ? "ion-touched" : null
                  }`}
                  placeholder="@username"
                  helperText="Your Twitter username"
                  onIonChange={onChange}
                  value={value}
                  onIonBlur={onBlur}
                  errorText={error && error.message}
                />
              );
            }}
          />
        </IonContent>
      </IonModal>
    </>
  );
}
