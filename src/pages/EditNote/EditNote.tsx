import AppHeader from "@/components/App/AppHeader";
import AppLoading from "@/components/App/AppLoading";
import { useAuthContext } from "@/context/AuthContext";
import { INote, INoteWithId } from "@/models/note.model";
import { QueryKeys } from "@/models/query_keys.model";
import EditNoteModule from "@/modules/note/edit_note.module";
import { Routes } from "@/routes/routes";
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
  const { user } = useAuthContext();

  const notes = useMemo(() => {
    return queryClient.getQueryData<INoteWithId[]>([
      QueryKeys.Notes,
      user?.uid,
    ]);
  }, [queryClient]);

  const note = useMemo(() => {
    let note: INote | undefined;

    if (!notes) return;

    for (const key of notes!) {
      for (const k of Object.keys(key)) {
        if (props.match.params.noteUid === k) {
          return key[k];
        }
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
        <EditNoteModule note={note} noteUid={props.match.params.noteUid} />
      </IonContent>
    </IonPage>
  );
}
