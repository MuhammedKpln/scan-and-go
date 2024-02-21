import AppInfoCard from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import AppModalHeader from "@/components/App/AppModalHeader";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { useGallery } from "@/hooks/useGallery";
import { QueryKeys } from "@/models/query_keys.model";
import {
  IUserWithPhoneAndSocial,
  profileService,
} from "@/services/profile.service";
import { storageService } from "@/services/storage.service";
import { useAuthStore } from "@/stores/auth.store";
import { Photo } from "@capacitor/camera";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
} from "@ionic/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  bio: z.string(),
});

export default function UpdateProfileModule(props: IProps) {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();
  const user = useAuthStore((state) => state.user);
  const { getPhoto, initialize } = useGallery();
  const [selectedImage, setSelectedImage] = useState<Photo | undefined>();

  const userProfile = useQuery<IUserWithPhoneAndSocial>({
    queryKey: [QueryKeys.ProfileWithRelations, user?.id],
    queryFn: () => profileService.fetchProfile(user!.id),
    networkMode: "offlineFirst",
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
    defaultValues: {
      bio: userProfile?.data?.bio ?? undefined,
      firstName: userProfile?.data?.firstName,
      lastName: userProfile?.data?.lastName,
    },
    resolver: zodResolver(profileFormValidator),
  });

  useEffect(() => {
    initialize();
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
        bio: items.bio,
      };

      if (selectedImage) {
        const ref = await storageService.uploadAvatar(user!.id, selectedImage);

        if (ref) {
          const photoURL = storageService.getAavatarURL(ref.path);

          updatedFields.profileImageUrl = photoURL;
        }
      }

      await profileService.updateProfile(user!.id, updatedFields);

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

  if (userProfile.isLoading) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppModalHeader onClose={props.onClose}>
        <IonTitle>Uppdatera profil</IonTitle>
        {form.formState.isValid && (
          <IonButtons slot="end">
            <IonButton onClick={form.handleSubmit(onSave)}>Spara</IonButton>
          </IonButtons>
        )}
      </AppModalHeader>

      <IonContent>
        <form onSubmit={form.handleSubmit(onSave)}>
          {form.formState.isDirty && <AppInfoCard message="olmaz " />}
          <IonCard>
            <IonCardContent>
              <div className="flex justify-center flex-col items-center">
                <IonAvatar className="cursor-pointer" onClick={onClickAvatar}>
                  <IonImg
                    src={
                      selectedImageAsBlob ?? userProfile!.data!.profileImageUrl!
                    }
                  />
                </IonAvatar>

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
