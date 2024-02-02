import AppInfoCard from "@/components/App/AppInfoCard";
import { useAuthContext } from "@/context/AuthContext";
import { QueryKeys } from "@/models/query_keys.model";
import { Routes } from "@/routes/routes";
import { noteService } from "@/services/note.service";
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
} from "@ionic/react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale/sv";

export default function HomeNotesCard() {
  const { user } = useAuthContext();

  const notes = useQuery({
    queryKey: [QueryKeys.Notes, user?.uid],
    queryFn: () => noteService.fetchLatestNote(user!.uid),
  });

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
            {notes.data?.empty ? (
              <AppInfoCard message="Inga temporär notering" />
            ) : (
              notes.data!.docs.map((e) => {
                const note = e.data();
                const date = formatDistanceToNow(note.expire_at.toDate(), {
                  addSuffix: true,
                  locale: sv,
                });
                return (
                  <IonItem
                    routerLink={`${Routes.Notes}/${e.id}`}
                    lines="none"
                    button
                    key={e.id}
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
