export type IUser = {
  firstName: string;
  lastName: string;
  profileImageRef?: string;
  bio?: string;
  socialMediaAccounts?: object;
};

export interface IRegisterUserForm
  extends Omit<IUser, "profileImageRef" | "bio"> {
  email: string;
  password: string;
}
