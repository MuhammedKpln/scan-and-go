import AppInfoCard from "@/components/App/AppInfoCard";
import { useAuthContext } from "@/context/AuthContext";
import { ToastStatus, useAppToast } from "@/hooks/useAppToast";
import { INote } from "@/models/note.model";
import { QueryKeys } from "@/models/query_keys.model";
import { Routes } from "@/routes/routes";
import { noteService } from "@/services/note.service";
import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  useIonRouter,
} from "@ionic/react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale/sv";
import { produce } from "immer";
import { useCallback } from "react";

interface DeleteMutationVariables {
  noteUid: number;
}

export default function HomeNotesCard() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useIonRouter();
  const { showToast } = useAppToast();

  const deleteMutation = useMutation<
    void,
    PostgrestError,
    DeleteMutationVariables
  >({
    mutationFn: ({ noteUid }) => noteService.deleteNote(noteUid),
    onSuccess(data, variables) {
      showToast({
        message: "Deleted note",
        status: ToastStatus.Success,
      });

      queryClient.setQueryData<INote[]>([QueryKeys.Notes, user?.id], () => {
        const notes = queryClient.getQueryData<INote[]>([
          QueryKeys.Notes,
          user?.id,
        ]);

        if (notes) {
          const updatedNotes = produce(notes, (draftData) => {
            const index = draftData.findIndex(
              (v) => v.id === variables.noteUid
            );

            if (index !== -1) {
              draftData.splice(index, 1);
            }
          });

          return updatedNotes;
        }

        return notes;
      });
    },
  });

  const notes = useQuery({
    queryKey: [QueryKeys.Notes, user?.id],
    queryFn: async () => {
      const notes = await noteService.fetchLatestNotes(user!.id);

      return notes;
    },
  });

  const onClickItem = useCallback(async (item: INote, noteUid: number) => {
    const actionResult = await ActionSheet.showActions({
      title: item.content,
      options: [
        {
          title: "Redigera anteckning",
          style: ActionSheetButtonStyle.Default,
        },
        {
          title: "Delete",
          style: ActionSheetButtonStyle.Destructive,
        },
        {
          title: "Cancel",
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });

    switch (actionResult.index) {
      case 0:
        router.push(Routes.EditNote.replace(":noteUid", noteUid.toString()));
        break;
      case 1:
        await deleteMutation.mutateAsync({
          noteUid,
        });
        break;
    }
  }, []);
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Noteringar</IonCardTitle>
        <IonCardSubtitle>Senaste notering</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        {notes.isLoading ? (
          <IonSpinner />
        ) : (
          <IonList>
            {!notes.data ? (
              <AppInfoCard message="Inga temporär notering" />
            ) : (
              notes.data.map((note) => {
                const date = formatDistanceToNow(note.expire_at, {
                  addSuffix: true,
                  locale: sv,
                });
                return (
                  <IonItem
                    lines="none"
                    button
                    key={note.id}
                    onClick={() => onClickItem(note, note.id)}
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables.noteUid === note.id ? (
                      <IonSpinner />
                    ) : (
                      <IonLabel>
                        <h3>{note.content}</h3>
                        <p>{date}</p>
                      </IonLabel>
                    )}
                  </IonItem>
                );
              })
            )}
          </IonList>
        )}
      </IonCardContent>
    </IonCard>
  );
}
