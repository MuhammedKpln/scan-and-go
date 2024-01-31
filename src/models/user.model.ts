export type IUser = {
  firstName: string;
  lastName: string;
  showPhoneNumber: boolean;
  profileImageRef?: string;
  bio?: string;
};

export type IUserPrivatePhone = {
  value: string;
};

export type IUserPrivateSocialMediaAccounts = {
  twitter?: string;
};

export interface IRegisterUserForm
  extends Omit<IUser, "profileImageRef" | "bio"> {
  email: string;
  password: string;
}
