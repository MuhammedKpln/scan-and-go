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
    const query = await getDocs(docRef);
    if (!query.empty) {
      // const docs = query.docs.map((e) => e.data());
      setData(query as QuerySnapshot<T>);
      setStatus(QueryStatus.Success);
    } else {
      setError(new Error(`Collection data does not exist.`));
      setStatus(QueryStatus.Error);
    }
  }, []);

  return {
    status,
    data,
    error,
  };
}
