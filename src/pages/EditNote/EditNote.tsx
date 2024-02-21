import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { INote } from "@/models/note.model";
import { QueryKeys } from "@/models/query_keys.model";
import EditNoteModule from "@/modules/note/edit_note.module";
import { Routes } from "@/routes/routes";
import { useAuthStore } from "@/stores/auth.store";
import { IonContent, IonPage, IonTitle } from "@ionic/react";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Redirect, RouteComponentProps } from "react-router";

export interface EditNotePageProps
  extends RouteComponentProps<{
    noteUid: string;
  }> {}

export default function EditNotePage(props: EditNotePageProps) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const notes = useMemo(() => {
    return queryClient.getQueryData<INote[]>([QueryKeys.Notes, user?.id]);
  }, [queryClient]);

  const note = useMemo(() => {
    let note: INote | undefined;

    if (!notes) return;

    for (const key of notes) {
      if (key.id === parseInt(props.match.params.noteUid)) {
        return key;
      }
    }

    return note;
  }, [notes]);

  if (!notes) {
    return <Redirect to={Routes.AppRoot} />;
  }

  if (!note) {
    return <AppLoading />;
  }

  return (
    <IonPage>
      <AppHeader withBackButton>
        <IonTitle>Edit note</IonTitle>
      </AppHeader>
      <IonContent>
        <EditNoteModule
          note={note}
          noteUid={parseInt(props.match.params.noteUid)}
        />
      </IonContent>
    </IonPage>
  );
}
