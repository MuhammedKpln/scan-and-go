import AppInfoCard, { InfoCardStatus } from "@/components/App/AppInfoCard";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { renderIdWithData, updateIdWithDataValue } from "@/helpers";
import { INote, INoteWithId } from "@/models/note.model";
import { QueryKeys } from "@/models/query_keys.model";
import { ITag } from "@/models/tag.model";
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
import { Timestamp } from "firebase/firestore";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface IProps {
  noteUid: string;
  note: INote;
}

interface UpdateNoteMutationVariables {
  noteUid: string;
  note: Partial<INote>;
}

const newNoteFormSchema = z.object({
  tag: z.string(),
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
      expireAt: props.note.expire_at.toDate(),
      tag: props.note.tagUid,
    },
  });

  const { user } = useAuthContext();
  const [showToast] = useIonToast();

  const tags = useQuery({
    queryKey: [QueryKeys.Tags, user?.uid],
    queryFn: () => tagService.fetchTags(user!.uid),
  });

  const updateNote = useMutation<void, void, UpdateNoteMutationVariables>({
    mutationKey: [QueryKeys.Notes, user?.uid],
    mutationFn: ({ note, noteUid }) => noteService.updateNote(noteUid, note),
    onSuccess(data, variables) {
      queryClient.setQueryData<INoteWithId[]>(
        [QueryKeys.Notes, user?.uid],
        (v) => {
          if (v) {
            return updateIdWithDataValue<INote>(
              v,
              variables.noteUid,
              variables.note
            );
          }

          return v;
        }
      );
    },
  });

  const onSubmitForm = useCallback(
    async (data: typeof newNoteFormSchema._type) => {
      await updateNote.mutateAsync({
        note: {
          content: data.content,
          expire_at: Timestamp.fromDate(data.expireAt),
          userUid: user!.uid,
          created_at: Timestamp.fromDate(new Date()),
          tagUid: data.tag,
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
                  {renderIdWithData<ITag>(tags.data!, (data, id) => (
                    <IonSelectOption value={id} key={id}>
                      {data.tagName}
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
