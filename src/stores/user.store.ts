import { IUser } from "@/models/user.model";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUserStore extends IUser {
  dispatch: (state: IReducerPayload) => void;
}

interface IReducerPayload {
  type: IUserReducerType;
  args: Partial<IUserStore>;
}

export enum IUserReducerType {
  UpdateSocialMediaAccounts,
  UpdateUser,
}

const reducer = (
  state: IUserStore,
  { type, args }: IReducerPayload
): Partial<IUserStore> => {
  switch (type) {
    case IUserReducerType.UpdateUser:
      return args;

    case IUserReducerType.UpdateSocialMediaAccounts:
      return {
        socialMediaAccounts: {
          ...state.socialMediaAccounts,
          ...args.socialMediaAccounts,
        },
      };
  }
};

export const useUserStore = create<IUserStore>()(
  persist(
    (set, get) => ({
      firstName: "",
      lastName: "",
      bio: undefined,
      profileImageRef: undefined,
      socialMediaAccounts: { twitter: "se" },
      dispatch: (args) => set((state) => reducer(state, args), true),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
