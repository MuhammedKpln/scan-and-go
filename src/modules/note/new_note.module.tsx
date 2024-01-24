import { INote } from "@/models/note.model";
import { converter } from "@/services/firebase.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonPopover,
  IonSelect,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  Timestamp,
  collection,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useFirestore,
  useFirestoreCollection,
  useSigninCheck,
} from "reactfire";
import { z } from "zod";

interface IProps {
  onDismiss: (data?: string, role?: string) => void;
}

const newNoteFormSchema = z.object({
  tag: z.string(),
  content: z.string(),
  expireAt: z.date(),
});

export default function NewNoteModule(props: IProps) {
  const firestore = useFirestore();
  const user = useSigninCheck();
  const tagsCollection = collection(firestore, "tags");
  const tagsQuery = query(
    tagsCollection,
    where("userUid", "==", user.data.user?.uid)
  ).withConverter(converter<ITag>());

  const ss = useFirestoreCollection(tagsQuery);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<typeof newNoteFormSchema._type>({
    resolver: zodResolver(newNoteFormSchema),
    reValidateMode: "onChange",
  });

  const onSubmitForm = useCallback(async () => {
    const docRef = doc(firestore, "notes").withConverter<INote>(converter());

    setDoc(docRef, {
      content: "",
      expire_at: Timestamp.fromDate(new Date()),
      title: "",
    });
  }, []);

  console.log(ss);

  if (ss.status === "loading") {
    return (
      <IonPage>
        <IonLoading />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              color="medium"
              onClick={() => props.onDismiss(undefined, "cancel")}
            >
              Cancel
            </IonButton>
          </IonButtons>
          <IonTitle>Temporary note</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => props.onDismiss(undefined, "confirm")}
              strong={true}
            >
              Publish
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <IonList inset>
            <IonItem>
              <Controller
                control={control}
                name="tag"
                render={({ field: { onBlur, onChange, value } }) => (
                  <IonSelect
                    label="Select a tag"
                    value={value}
                    onIonChange={onChange}
                    onIonBlur={onBlur}
                  ></IonSelect>
                )}
              />
            </IonItem>
            <IonItem>
              <IonTextarea
                placeholder="Not detaylari"
                labelPlacement="floating"
                label="Not detaylari"
              ></IonTextarea>
            </IonItem>
            <IonItem>
              <IonLabel>Choose a expire time</IonLabel>
              <IonDatetimeButton datetime="datetime">se</IonDatetimeButton>
            </IonItem>
          </IonList>
          <IonPopover keepContentsMounted={true}>
            <IonContent>
              <IonDatetime id="datetime" presentation="time" locale="sv-SE" />
            </IonContent>
          </IonPopover>
        </form>
      </IonContent>
    </IonPage>
  );
}
