import {
  CollectionReference,
  DocumentData,
  WithFieldValue,
  addDoc,
} from "firebase/firestore";
import { useCallback } from "react";
import { QueryStatus, useBaseHook } from "./base";

export function useSetDoc<T = DocumentData>(docRef: CollectionReference<T>) {
  const { setError, setStatus, status, error } = useBaseHook<T>();

  const mutate = useCallback(async (data: WithFieldValue<T>) => {
    try {
      await addDoc(docRef, data);
      setStatus(QueryStatus.Success);
    } catch (error) {
      setStatus(QueryStatus.Error);
      setError(error as Error);
    }
  }, []);

  return {
    mutate,
    status,
    error,
  };
}
