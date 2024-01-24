import { DocumentReference, getDoc } from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { QueryStatus, UseBaseHookReturnValue, useBaseHook } from "./base";

export function useColletionDataOnce<T>(
  docRef: DocumentReference
): UseBaseHookReturnValue<T> {
  const { data, error, setData, setError, setStatus, status } =
    useBaseHook<T>();

  useEffect(() => {
    _getByDoc(docRef);
  }, []);

  const _getByDoc = useCallback(async (docRef: DocumentReference) => {
    const query = await getDoc(docRef);
    if (query.exists()) {
      setStatus(QueryStatus.Success);
      setData(query.data() as T);
    } else {
      setStatus(QueryStatus.Error);
      setError(new Error(`Document with path ${docRef.path} does not exist.`));
    }
  }, []);

  return {
    status,
    data,
    error,
  };
}
