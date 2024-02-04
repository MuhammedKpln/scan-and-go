import AppModalHeader from "@/components/App/AppModalHeader";
import { useAuthContext } from "@/context/AuthContext";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { useGallery } from "@/hooks/useGallery";
import { QueryKeys } from "@/models/query_keys.model";
import { IUser } from "@/models/user.model";
import { profileService } from "@/services/profile.service";
import { storageService } from "@/services/storage.service";
import { Photo } from "@capacitor/camera";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonImg,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "firebase/auth";
import { getDownloadURL } from "firebase/storage";
import { useCallback, useEffect, useMemo, useState } from "react";

interface IProps {
  onClose(): void;
  onConfirm(): void;
}

export default function ChangeProfilePicture(props: IProps) {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();
  const { user } = useAuthContext();
  const { getPhoto, initialize } = useGallery();
  const [selectedImage, setSelectedImage] = useState<Photo | undefined>();

  const userProfile = useMemo(() => {
    return queryClient.getQueryData<IUser>([QueryKeys.Profile, user?.uid]);
  }, [user]);

  useEffect(() => {
    initialize();
  }, []);

  const onClickAvatar = useCallback(async () => {
    const photo = await getPhoto();

    if (photo) {
      setSelectedImage(photo);
    }
  }, []);

  const onSave = useCallback(async () => {
    const ref = await storageService.uploadAvatar(
      user!.uid,
      selectedImage!.dataUrl!
    );

    const photoURL = await getDownloadURL(ref.ref);

    updateProfile(user!, {
      photoURL,
    });

    await profileService.updateProfile(user!.uid, {
      profileImageRef: photoURL,
    });

    showToast({
      message: "New pp uploaded",
      status: ToastStatus.Success,
    });

    queryClient.setQueryData<IUser>([QueryKeys.Profile, user?.uid], (v) => {
      return {
        ...v,
        profileImageRef: photoURL,
      } as IUser;
    });

    props.onConfirm();
  }, [selectedImage, user]);

  return (
    <IonPage>
      <AppModalHeader onClose={props.onClose}>
        <IonTitle>Select a picture</IonTitle>
        {selectedImage && (
          <IonButtons slot="end">
            <IonButton onClick={onSave}>Save</IonButton>
          </IonButtons>
        )}
      </AppModalHeader>

      <IonContent>
        <div className="flex flex-col justify-center items-center ion-padding gap-5">
          <IonAvatar onClick={onClickAvatar}>
            <IonImg
              src={selectedImage?.dataUrl ?? userProfile?.profileImageRef}
            />
          </IonAvatar>

          {!selectedImage && (
            <IonButton fill="outline" onClick={onClickAvatar}>
              Välj en bild
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
