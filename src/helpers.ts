import React from "react";

interface BaseIdWithData<K> {
  [s: string]: K;
}

export function renderIdWithData<T>(
  data: BaseIdWithData<T>[],
  children: (data: T, id: string) => React.ReactNode
): React.ReactNode {
  return data.map((item) => {
    return Object.keys(item).map((key) => {
      return children(item[key], key);
    });
  });
}
export function getIdSingleWithData<T>(
  data: BaseIdWithData<T>,
  children: (data: T, id: string) => Promise<BaseIdWithData<T> | void>
) {
  return Object.keys(data).map((key) => {
    return children(data[key], key);
  });
}

export function renderIdSingleWithData<T>(
  data: BaseIdWithData<T>,
  children: (data: T, id: string) => React.ReactNode
): React.ReactNode {
  return Object.keys(data).map((key) => {
    return children(data[key], key);
  });
}

export function updateIdWithDataValue<T>(
  data: BaseIdWithData<T>[],
  id: string,
  updatedData: Partial<T>
) {
  for (const item of data) {
    for (const idValue of Object.keys(item)) {
      if (id === idValue) {
        item[idValue] = {
          ...item[idValue],
          ...updatedData,
        };

        return data;
      }
    }
  }
}

export function deleteIdWithDataValue<T>(
  data: BaseIdWithData<T>[],
  id: string
) {
  for (const item of data) {
    for (const idValue of Object.keys(item)) {
      if (id === idValue) {
        delete item[idValue];

        return data;
      }
    }
  }
}
