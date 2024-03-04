import { Tables } from "./supabase";

export type IUser = Tables<"profiles">;

export type IUserPrivatePhone = Tables<"phone_numbers">;

export type IUserPrivateSocialMediaAccounts = Tables<"social_media_accounts">;

export interface IRegisterUserForm
  extends Omit<
    IUser,
    "profileImageRef" | "bio" | "sendMessageAllowed" | "showPhoneNumber"
  > {
  email: string;
  password: string;
}

export interface IUserWithPhoneAndSocial extends IUser {
  social_media_accounts: IUserPrivateSocialMediaAccounts;
  phone_numbers: IUserPrivatePhone;
}
