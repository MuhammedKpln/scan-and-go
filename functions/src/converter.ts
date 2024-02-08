import {
  PartialWithFieldValue,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export function converter<T>() {
  return {
    toFirestore: (data: PartialWithFieldValue<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot): T => snap.data() as T,
  };
}
