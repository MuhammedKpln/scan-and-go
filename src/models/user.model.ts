interface ISocialMediaAccounts {
  twitter?: string;
}

export type IUser = {
  firstName: string;
  lastName: string;
  profileImageRef?: string;
  bio?: string;
  socialMediaAccounts?: ISocialMediaAccounts;
};

export interface IRegisterUserForm
  extends Omit<IUser, "profileImageRef" | "bio"> {
  email: string;
  password: string;
}
