import { IUser } from "@/models/user.model";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUserStore extends IUser {
  hasBeenFetched: boolean;
}

interface IUserStoreActions {
  dispatch: (state: IReducerPayload) => void;
  resetState: () => void;
}

interface IReducerPayload {
  type: IUserReducerType;
  args: Partial<IUserStore>;
}

export enum IUserReducerType {
  UpdateUser,
}

const initialState: IUserStore = {
  firstName: "",
  lastName: "",
  bio: undefined,
  profileImageRef: undefined,
  showPhoneNumber: false,
  hasBeenFetched: false,
};

const reducer = (
  state: IUserStore,
  { type, args }: IReducerPayload
): Partial<IUserStore> => {
  switch (type) {
    case IUserReducerType.UpdateUser:
      return { ...state, ...args };
  }
};

export const useUserStore = create<IUserStore & IUserStoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      resetState: () => set(initialState),
      dispatch: (args) => set((state) => reducer(state, args)),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
