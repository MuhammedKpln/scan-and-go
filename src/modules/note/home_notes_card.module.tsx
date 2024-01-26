import AppInfoCard from "@/components/App/AppInfoCard";
import { useAuthContext } from "@/context/AuthContext";
import { QueryStatus } from "@/hooks/base";
import { useCollection } from "@/hooks/useCollection";
import { FirebaseCollections } from "@/models/firebase_collections.model";
import { INote } from "@/models/note.model";
import { Routes } from "@/routes/routes";
import { db } from "@/services/firebase.service";
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
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale/sv";
import { collection, limit, query, where } from "firebase/firestore";
import { useMemo } from "react";

export default function HomeNotesCard() {
  const router = useIonRouter();
  const authContext = useAuthContext();
  const notesCollection = useMemo(
    () => collection(db, FirebaseCollections.Notes),
    []
  );
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const notesQuery = useMemo(
    () =>
      query(
        notesCollection,
        where("userUid", "==", authContext.user?.uid),
        where("expire_at", ">", new Date(Date.now() + 10000)),
        limit(4)
      ),
    []
  );

  const notes = useCollection<INote>(notesQuery);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Anteckningar</IonCardTitle>
        <IonCardSubtitle>Sparade anteckningar</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        {notes.status === QueryStatus.Loading ? (
          <IonSpinner />
        ) : (
          <IonList>
            {notes.data?.empty ? (
              <AppInfoCard message="Inga temporär anteckningar" />
            ) : (
              notes.data?.docs.map((e) => {
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
