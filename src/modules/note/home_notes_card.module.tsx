import AppInfoCard from "@/components/App/AppInfoCard";
import { useAuthContext } from "@/context/AuthContext";
import { deleteIdWithDataValue, renderIdWithData } from "@/helpers";
import { INote, INoteWithId } from "@/models/note.model";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale/sv";
import { useCallback } from "react";

interface DeleteMutationVariables {
  noteUid: string;
}

export default function HomeNotesCard() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useIonRouter();

  const deleteMutation = useMutation<void, void, DeleteMutationVariables>({
    mutationFn: ({ noteUid }) => noteService.deleteNote(noteUid),
    onSuccess(data, variables) {
      queryClient.setQueryData<INoteWithId[]>([QueryKeys.Tag, user?.id], () => {
        const notes = queryClient.getQueryData<INoteWithId[]>([
          QueryKeys.Notes,
          user?.id,
        ]);

        if (notes) {
          return deleteIdWithDataValue<INote>(notes, variables.noteUid);
        }
      });
    },
  });

  const notes = useQuery({
    queryKey: [QueryKeys.Notes, user?.id],
    queryFn: async () => {
      const notes = await noteService.fetchLatestNotes(user!.id);

      return notes.map<INoteWithId>((e) => ({
        [e.id]: e,
      }));
    },
  });

  const onClickItem = useCallback(async (item: INote, noteUid: string) => {
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
        router.push(Routes.EditNote.replace(":noteUid", noteUid));
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
              renderIdWithData<INote>(notes.data, (note, id) => {
                const date = formatDistanceToNow(note.expire_at, {
                  addSuffix: true,
                  locale: sv,
                });
                return (
                  <IonItem
                    lines="none"
                    button
                    key={id}
                    onClick={() => onClickItem(note, id)}
                  >
                    <IonLabel>
                      <h3>{note.content}</h3>
                      <p>{date}</p>
                    </IonLabel>
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
