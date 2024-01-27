import { DocumentData, DocumentReference, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { QueryStatus, useBaseHook } from "./base";

export function useUpdateDoc<T = DocumentData>(docRef: DocumentReference<T>) {
  const { setError, setStatus, status, error } = useBaseHook<T>();

  const mutate = useCallback(async (data: Partial<T>) => {
    try {
      await updateDoc(docRef, data);
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
