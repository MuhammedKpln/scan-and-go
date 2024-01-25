import {
  DocumentData,
  Query,
  QuerySnapshot,
  getDocs,
} from "firebase/firestore";
import { useCallback, useEffect } from "react";
import { QueryStatus, UseBaseHookReturnValue, useBaseHook } from "./base";

export function useCollection<T = DocumentData>(
  query: Query
): UseBaseHookReturnValue<QuerySnapshot<T>> {
  const { data, error, setData, setError, setStatus, status } =
    useBaseHook<QuerySnapshot<T>>();

  useEffect(() => {
    _getDocs(query);
  }, []);

  const _getDocs = useCallback(async (docRef: Query) => {
    try {
      const query = await getDocs(docRef);
      console.log(query);
      setData(query as QuerySnapshot<T>);
      setStatus(QueryStatus.Success);
    } catch (error) {
      console.log(error);
      setError(error as Error);
      setStatus(QueryStatus.Error);
    }
  }, []);

  return {
    status,
    data,
    error,
  };
}
