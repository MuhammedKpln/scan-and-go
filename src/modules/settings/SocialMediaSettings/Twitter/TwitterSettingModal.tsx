import AppLoading from "@/components/App/AppLoading";
import AppModalHeader from "@/components/App/AppModalHeader";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { QueryKeys } from "@/models/query_keys.model";
import { IUserPrivateSocialMediaAccounts } from "@/models/user.model";
import {
  IUserWithPhoneAndSocial,
  profileService,
} from "@/services/profile.service";
import { useAuthStore } from "@/stores/auth.store";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  onClose: () => void;
  onConfirm: () => void;
}

const formValidator = z.object({
  twitterUsername: z.string(),
});

type IUpdateTwitterMutationVars = Pick<
  IUserPrivateSocialMediaAccounts,
  "twitter"
>;

export default function TwitterSettingModal(props: IProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const userSocialAccounts = useQuery<IUserPrivateSocialMediaAccounts | null>({
    queryKey: [QueryKeys.UserSocialMediaAccounts, user?.id],
    networkMode: "offlineFirst",
    queryFn: () => profileService.fetchSocialMediaAccounts(user!.id),
  });

  const mutation = useMutation<void, void, IUpdateTwitterMutationVars>({
    mutationKey: [QueryKeys.UserSocialMediaAccounts, user?.id],
    mutationFn: ({ twitter }) => {
      return profileService.updateSocialMediaAccounts(user!.id, {
        twitter,
      });
    },
    onSuccess(_, variables) {
      queryClient.setQueryData<IUserWithPhoneAndSocial>(
        [QueryKeys.ProfileWithRelations, user?.id],
        (v) => {
          if (v) {
            const updatedState = produce(v, (draft) => {
              if (draft.social_media_accounts.length > 0) {
                draft.social_media_accounts[0].twitter = variables.twitter;
              }
            });

            return updatedState;
          }
        }
      );

      queryClient.setQueryData<IUserPrivateSocialMediaAccounts>(
        [QueryKeys.UserSocialMediaAccounts, user?.id],
        (v) => {
          if (v) {
            const updatedState = produce(v, (draft) => {
              draft.twitter = variables.twitter;
            });

            return updatedState;
          }
        }
      );
    },
  });

  const { showToast } = useAppToast();
  const { control, handleSubmit, setValue } = useForm<
    typeof formValidator._type
  >({
    resolver: zodResolver(formValidator),
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!userSocialAccounts.isSuccess) return;

    if (userSocialAccounts.data?.twitter) {
      setValue("twitterUsername", userSocialAccounts.data.twitter);
    }
  }, [userSocialAccounts]);

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

  if (userSocialAccounts.isLoading) {
    return <AppLoading />;
  }

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
                placeholder="Your Twitter username"
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
