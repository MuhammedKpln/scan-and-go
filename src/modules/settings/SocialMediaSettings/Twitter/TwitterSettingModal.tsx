import AppModalHeader from "@/components/App/AppModalHeader";
import { useAuthContext } from "@/context/AuthContext";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { QueryKeys } from "@/models/query_keys.model";
import { IUserPrivateSocialMediaAccounts } from "@/models/user.model";
import { profileService } from "@/services/profile.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonInput,
  IonLabel,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  onClose: () => void;
  onConfirm: () => void;
}

const formValidator = z.object({
  twitterUsername: z.string().startsWith("@"),
});

interface IUpdateTwitterMutationVars {
  twitter: string;
}

export default function TwitterSettingModal(props: IProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const userSocialAccounts = useMemo(() => {
    return queryClient.getQueryData<IUserPrivateSocialMediaAccounts>([
      QueryKeys.UserSocialMediaAccounts,
      user?.uid,
    ]);
  }, []);

  const mutation = useMutation<void, void, IUpdateTwitterMutationVars>({
    mutationKey: [QueryKeys.UserSocialMediaAccounts, user?.uid],
    mutationFn: ({ twitter }) => {
      return profileService.updateSocialMediaAccounts(user!.uid, {
        twitter,
      });
    },
  });

  const { showToast } = useAppToast();
  const { control, handleSubmit } = useForm<typeof formValidator._type>({
    resolver: zodResolver(formValidator),
    reValidateMode: "onSubmit",
    defaultValues: {
      twitterUsername: userSocialAccounts?.twitter,
    },
  });

  const onSubmit = useCallback(async (inputs: typeof formValidator._type) => {
    try {
      await mutation.mutateAsync({
        twitter: inputs.twitterUsername,
      });

      showToast({
        message: "Updated succesfully!",
        status: ToastStatus.Success,
      });

      props.onConfirm();
    } catch (error) {
      showToast({
        message: "Error!",
        status: ToastStatus.Error,
      });
    }
  }, []);

  return (
    <IonPage>
      <AppModalHeader onClose={props.onClose}>
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
    </IonPage>
  );
}
