import { useState } from "react";

export enum QueryStatus {
  Success,
  Error,
  Loading,
}

export function useBaseHook<T>() {
  const [status, setStatus] = useState<QueryStatus>(QueryStatus.Loading);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();

  return {
    status,
    setStatus,
    data,
    setData,
    error,
    setError,
  };
}

export interface UseBaseHookReturnValue<T> {
  status: QueryStatus;
  data?: T;
  error?: Error | string;
}
export interface UseBaseHookReturnValueWithMutate<T> {
  status: QueryStatus;
  data?: T;
  error?: Error | string;
  mutate?: () => Promise<void>;
}

export interface UseBaseHookArgs {
  isAsync?: boolean;
}
