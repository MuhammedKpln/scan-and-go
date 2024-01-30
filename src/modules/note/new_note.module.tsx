import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { QueryStatus } from "@/hooks/base";
import { useAddDoc } from "@/hooks/useAddDoc";
import { useCollection } from "@/hooks/useCollection";
import { INote } from "@/models/note.model";
import { converter, db } from "@/services/firebase.service";
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
  IonPage,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { Timestamp, collection, query, where } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
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
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<typeof newNoteFormSchema._type>({
    resolver: zodResolver(newNoteFormSchema),
    reValidateMode: "onSubmit",
  });
  const [showAlert, dismissAlert] = useIonAlert();

  const authContext = useAuthContext();
  const [showToast] = useIonToast();
  const tagsCollection = useMemo(() => collection(db, "tags"), []);
  const notesRef = useMemo(
    () => collection(db, "notes").withConverter<INote>(converter()),
    []
  );
  const tagsQuery = query(
    tagsCollection,
    where("userUid", "==", authContext.user?.uid)
  ).withConverter(converter<ITag>());
  const addNewDoc = useAddDoc(notesRef);

  const tags = useCollection<ITag>(tagsQuery);

  const onSubmitForm = useCallback(
    async (data: typeof newNoteFormSchema._type) => {
      console.log("ae");
      await addNewDoc.mutate({
        content: data.content.toString(),
        expire_at: Timestamp.fromDate(data.expireAt),
        userUid: authContext.user!.uid,
        created_at: Timestamp.fromDate(new Date()),
      });

      props.onDismiss(undefined, "confirm");
      showToast({
        message: "Temporary note created sucesfully.",
        color: "success",
        duration: 3000,
      });
    },
    []
  );

  useEffect(() => {
    if (tags.status === QueryStatus.Success && tags.data?.empty) {
      showAlert({
        message: "You don't have any registered tags, please register one.",
        onWillDismiss: () => props.onDismiss(undefined, "cancel"),
        buttons: [
          {
            text: "Ok",
            role: "confirm",
            handler: () => dismissAlert(),
          },
        ],
      });
    }
  }, [tags]);

  console.log(tags);

  if (tags.status === QueryStatus.Loading) {
    return <AppLoading />;
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
          <IonTitle>Skapa ett temporär anteckning</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {tags.status === QueryStatus.Error && (
          <AppInfoCard
            message="Ett fel har uppstot! var snäll prova igen senare"
            status={InfoCardStatus.Error}
          />
        )}
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
                  >
                    {tags.data?.docs.map((e) => {
                      const s = e.data();

                      return (
                        <IonSelectOption value={e.id} key={e.id}>
                          {s.tagName}
                        </IonSelectOption>
                      );
                    })}
                  </IonSelect>
                )}
              />
            </IonItem>
            <IonItem>
              <Controller
                control={control}
                name="content"
                render={({ field: { onBlur, onChange, value } }) => (
                  <IonTextarea
                    placeholder="Not detaylari"
                    labelPlacement="floating"
                    label="Not detaylari"
                    onIonChange={onChange}
                    onIonBlur={onBlur}
                    value={value}
                  ></IonTextarea>
                )}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Choose a expire time</IonLabel>
              <IonDatetimeButton datetime="datetime">se</IonDatetimeButton>
            </IonItem>
          </IonList>

          <IonPopover keepContentsMounted={true}>
            <IonContent>
              <Controller
                control={control}
                name="expireAt"
                render={({ field: { onBlur, onChange, value } }) => (
                  <IonDatetime
                    id="datetime"
                    presentation="time"
                    onIonBlur={onBlur}
                    onIonChange={(e) =>
                      onChange(new Date(e.target.value as string))
                    }
                    locale="sv-SE"
                  />
                )}
              />
            </IonContent>
          </IonPopover>

          <IonButton
            type="submit"
            expand="full"
            shape="round"
            className="ion-padding"
          >
            Publish temporary note
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}
