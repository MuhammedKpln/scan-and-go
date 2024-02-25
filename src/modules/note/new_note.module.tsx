import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { INote } from "@/models/note.model";
import { QueryKeys } from "@/models/query_keys.model";
import { noteService } from "@/services/note.service";
import { tagService } from "@/services/tag.service";
import { useAuthStore } from "@/stores/auth.store";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback, useEffect } from "react";
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
  const queryClient = useQueryClient();
  const { handleSubmit, control } = useForm<typeof newNoteFormSchema._type>({
    resolver: zodResolver(newNoteFormSchema),
    reValidateMode: "onSubmit",
  });
  const [showAlert, dismissAlert] = useIonAlert();

  const user = useAuthStore((state) => state.user);
  const [showToast] = useIonToast();

  const tags = useQuery({
    queryKey: [QueryKeys.Tags, user?.id],
    queryFn: () => tagService.fetchTags(user!.id),
  });

  const addNewDoc = useMutation<INote, void, Omit<INote, "id">>({
    mutationKey: [QueryKeys.Notes, user?.id],
    mutationFn: (note) => noteService.addNewNote(note),
    onSuccess(data) {
      queryClient.setQueryData<INote[]>([QueryKeys.Notes, user?.id], (v) => {
        const updatedState = produce(v, (draft) => {
          draft?.push(data);
        });

        return updatedState;
      });
    },
  });

  const onSubmitForm = useCallback(
    async (data: typeof newNoteFormSchema._type) => {
      await addNewDoc.mutateAsync({
        content: data.content,
        expire_at: data.expireAt.toISOString(),
        userId: user!.id,
        created_at: new Date().toISOString(),
        tagId: data.tag,
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
    if (tags.isFetched && !tags.data) {
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

  if (tags.isLoading) {
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
        {tags.isError && (
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
                    {tags.data?.map((tag) => (
                      <IonSelectOption value={tag.id} key={tag.id}>
                        {tag.name}
                      </IonSelectOption>
                    ))}
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
                render={({ field: { onBlur, onChange } }) => (
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
