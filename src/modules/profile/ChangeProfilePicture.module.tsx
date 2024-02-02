import AppModalHeader from "@/components/App/AppModalHeader";
import { useAuthContext } from "@/context/AuthContext";
import { useGallery } from "@/hooks/useGallery";
import { QueryKeys } from "@/models/query_keys.model";
import { IUser } from "@/models/user.model";
import { storage } from "@/services/firebase.service";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonPage,
  IonTitle,
} from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { ref, uploadString } from "firebase/storage";
import { useCallback, useEffect, useMemo, useState } from "react";

interface IProps {
  onClose(): void;
  onConfirm(): void;
}

export default function ChangeProfilePicture(props: IProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { getPhoto, initialize } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const profilePicture = useMemo(() => {
    return queryClient.getQueryData<IUser>([QueryKeys.Profile, user?.uid]);
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  const onClickAvatar = useCallback(async () => {
    const photo = await getPhoto();
    if (photo) {
      setSelectedImage(photo!.dataUrl!);
    }
  }, []);

  const onSave = useCallback(() => {
    const storageRef = ref(storage, user?.uid);
    uploadString(storageRef, selectedImage!).then((v) => props.onConfirm());
  }, [selectedImage]);

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
            <img src={selectedImage ?? profilePicture?.profileImageRef} />
          </IonAvatar>

          <IonButton fill="outline" onClick={onClickAvatar}>
            Välj en bild
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
