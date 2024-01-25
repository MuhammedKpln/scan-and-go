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
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";

export default function HomeNotesCard() {
  const router = useIonRouter();
  const authContext = useAuthContext();
  const notesCollection = useMemo(
    () => collection(db, FirebaseCollections.Notes),
    []
  );
  const notesQuery = useMemo(
    () => query(notesCollection, where("userUid", "==", authContext.user?.uid)),
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
            {notes.data?.docs.map((e) => {
              const note = e.data();
              return (
                <IonItem
                  routerLink={`${Routes.Notes}/${e.id}`}
                  lines="none"
                  button
                  key={e.id}
                >
                  <IonLabel>
                    <h3>{note.content}</h3>
                    <p>{note.expire_at.toDate().toString()}</p>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonCardContent>
    </IonCard>
  );
}
