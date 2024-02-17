import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { INote } from "@/models/note.model";
import { QueryKeys } from "@/models/query_keys.model";
import { noteService } from "@/services/note.service";
import { tagService } from "@/services/tag.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  useIonToast,
} from "@ionic/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { produce } from "immer";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  noteUid: number;
  note: INote;
}

interface UpdateNoteMutationVariables {
  noteUid: number;
  note: Partial<INote>;
}

const newNoteFormSchema = z.object({
  tag: z.number(),
  content: z.string(),
  expireAt: z.date(),
});

export default function EditNoteModule(props: IProps) {
  const queryClient = useQueryClient();

  const { handleSubmit, control } = useForm<typeof newNoteFormSchema._type>({
    resolver: zodResolver(newNoteFormSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      content: props.note.content,
      expireAt: new Date(props.note.expire_at),
      tag: props.note.tagId,
    },
  });

  const { user } = useAuthContext();
  const [showToast] = useIonToast();

  const tags = useQuery({
    queryKey: [QueryKeys.Tags, user?.id],
    queryFn: () => tagService.fetchTags(user!.id),
    networkMode: "offlineFirst",
  });

  const updateNote = useMutation<void, void, UpdateNoteMutationVariables>({
    mutationKey: [QueryKeys.Notes, user?.id],
    mutationFn: ({ note, noteUid }) => noteService.updateNote(noteUid, note),
    onSuccess(_, variables) {
      queryClient.setQueryData<INote[]>([QueryKeys.Notes, user?.id], (v) => {
        if (v) {
          const updatedState = produce(v, (draft) => {
            const index = draft.findIndex((e) => e.id === variables.noteUid);

            if (index !== -1) {
              draft[index] = { ...draft[index], ...variables.note };
            }
          });

          return updatedState;
        }
      });
    },
  });

  const onSubmitForm = useCallback(
    async (data: typeof newNoteFormSchema._type) => {
      await updateNote.mutateAsync({
        note: {
          content: data.content,
          expire_at: data.expireAt.toISOString(),
          userId: user!.id,
          created_at: new Date().toISOString(),
          tagId: data.tag,
        },
        noteUid: props.noteUid,
      });

      showToast({
        message: "Anteckning har sparats.",
        color: "success",
        duration: 3000,
      });
    },
    []
  );

  if (tags.isLoading) {
    return <AppLoading />;
  }

  return (
    <>
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

        <IonButton type="submit" expand="full" className="ion-padding">
          Spara notering
        </IonButton>
      </form>
    </>
  );
}
