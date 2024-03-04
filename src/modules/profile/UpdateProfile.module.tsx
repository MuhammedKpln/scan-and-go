import AppLoading from "@/components/App/AppLoading";
import AppModalHeader from "@/components/App/AppModalHeader";
import AppButton from "@/components/AppButton";
import AppAvatar from "@/components/Avatar";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { useGallery } from "@/hooks/useGallery";
import { QueryKeys } from "@/models/query_keys.model";
import { IUser, IUserWithPhoneAndSocial } from "@/models/user.model";
import { profileService } from "@/services/profile.service";
import { storageService } from "@/services/storage.service";
import { useAuthStore } from "@/stores/auth.store";
import { Photo } from "@capacitor/camera";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import mime from "mime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  onClose(): void;
  onConfirm(): void;
}

const profileFormValidator = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().optional(),
});

export default function UpdateProfileModule(props: IProps) {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();
  const user = useAuthStore((state) => state.user);
  const { getPhoto, initialize } = useGallery();
  const [selectedImage, setSelectedImage] = useState<Photo | undefined>();

  const userProfile = useQuery<IUserWithPhoneAndSocial>({
    queryKey: [QueryKeys.ProfileWithRelations, user?.id],
  });
  const updateProfileMutation = useMutation<void, void, Partial<IUser>>({
    mutationFn: (variables) => {
      return profileService.updateProfile(user!.id, variables);
    },
  });

  const selectedImageAsBlob = useMemo(
    () =>
      selectedImage &&
      `data:${mime.getType(selectedImage.format)};base64,${
        selectedImage.base64String
      }`,
    [selectedImage]
  );

  const form = useForm<typeof profileFormValidator._type>({
    resolver: zodResolver(profileFormValidator),
  });

  useEffect(() => {
    initialize();

    if (userProfile.isSuccess) {
      form.setValue("firstName", userProfile?.data.firstName);
      form.setValue("lastName", userProfile?.data.lastName);
      form.setValue("bio", userProfile?.data.bio ?? undefined);
    }
  }, []);

  const onClickAvatar = useCallback(async () => {
    const photo = await getPhoto();

    if (photo) {
      setSelectedImage(photo);
    }
  }, []);

  const onSave = useCallback(
    async (items: typeof profileFormValidator._type) => {
      const updatedFields: IUserWithPhoneAndSocial = {
        ...userProfile.data!,
        firstName: items.firstName,
        lastName: items.lastName,
        bio: items.bio ?? null,
      };

      if (selectedImage) {
        const ref = await storageService.uploadAvatar(user!.id, selectedImage);

        if (ref) {
          const photoURL = storageService.getAavatarURL(ref.path);

          updatedFields.profileImageUrl = photoURL;
        }
      }

      await updateProfileMutation.mutateAsync(updatedFields);

      queryClient.setQueryData<IUserWithPhoneAndSocial>(
        [QueryKeys.ProfileWithRelations, user?.id],
        (v) => {
          return {
            ...v,
            ...updatedFields,
          };
        }
      );

      showToast({
        message: "Profilsidan har uppdaterats",
        status: ToastStatus.Success,
      });
      props.onConfirm();
    },
    [selectedImage, user, userProfile]
  );

  if (userProfile.isPending) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppModalHeader onClose={props.onClose}>
        <IonTitle>Uppdatera profil</IonTitle>
        {(form.formState.isValid || selectedImage) && (
          <IonButtons slot="end">
            <AppButton
              onClick={form.handleSubmit(onSave)}
              isLoading={updateProfileMutation.isPending}
            >
              Spara
            </AppButton>
          </IonButtons>
        )}
      </AppModalHeader>

      <IonContent>
        <form onSubmit={form.handleSubmit(onSave)}>
          <IonCard>
            <IonCardContent>
              <div className="flex justify-center flex-col items-center">
                <AppAvatar
                  slot="middle"
                  cacheNetworkImage={false}
                  url={
                    selectedImageAsBlob ?? userProfile!.data!.profileImageUrl!
                  }
                  onClick={onClickAvatar}
                />

                <IonButton fill="clear" onClick={onClickAvatar}>
                  Välj en bild
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          <IonList inset>
            <IonItem>
              <Controller
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <IonInput
                    name={field.name}
                    onIonChange={field.onChange}
                    onIonBlur={field.onBlur}
                    value={field.value}
                    label="Namn"
                    labelPlacement="floating"
                  />
                )}
              />
            </IonItem>
            <IonItem>
              <Controller
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <IonInput
                    name={field.name}
                    onIonChange={field.onChange}
                    onIonBlur={field.onBlur}
                    value={field.value}
                    label="Efternamn"
                    labelPlacement="floating"
                  />
                )}
              />
            </IonItem>
            <IonItem>
              <Controller
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <IonTextarea
                    name={field.name}
                    onIonChange={field.onChange}
                    onIonBlur={field.onBlur}
                    label="Biografi"
                    labelPlacement="floating"
                    value={field.value}
                  />
                )}
              />
            </IonItem>
          </IonList>
        </form>
      </IonContent>
    </IonPage>
  );
}
