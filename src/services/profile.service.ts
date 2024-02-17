import {
  IUser,
  IUserPrivatePhone,
  IUserPrivateSocialMediaAccounts,
} from "@/models/user.model";
import { QueryData } from "@supabase/supabase-js";
import { BaseService } from "./base.service";
import { supabaseClient } from "./supabase.service";

const profileQuery = supabaseClient
  .from("profiles")
  .select("*, phone_numbers(*), social_media_accounts(*)")
  .single();

export type IUserWithPhoneAndSocial = QueryData<typeof profileQuery>;

class ProfileService extends BaseService {
  async updateProfile(userUid: string, _data: Partial<IUser>) {
    const { data, error } = await this.client
      .from("profiles")
      .update(_data)
      .eq("id", userUid);

    if (error) {
      throw error;
    }

    return data;
  }

  async updateSocialMediaAccounts(
    userUid: string,
    _data: Partial<IUserPrivateSocialMediaAccounts>
  ): Promise<boolean> {
    const { error } = await this.client
      .from("social_media_accounts")
      .update(_data)
      .eq("userId", userUid);

    if (error) {
      throw error;
    }

    return true;
  }

  async fetchPhoneNumber(
    userUid: string
  ): Promise<Pick<IUserPrivatePhone, "number">> {
    const { data, error } = await this.client
      .from("phone_numbers")
      .select("number")
      .eq("userId", userUid)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchSocialMediaAccounts(
    userUid: string
  ): Promise<IUserPrivateSocialMediaAccounts> {
    const { data, error } = await this.client
      .from("social_media_accounts")
      .select()
      .eq("userId", userUid)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async fetchProfile(userUid: string) {
    const profileQuery = this.client
      .from("profiles")
      .select("*, phone_numbers(*), social_media_accounts(*)")
      .eq("id", userUid)
      .limit(1)
      .single();

    type IUserWithPhoneAndSocial = QueryData<typeof profileQuery>;

    const { data, error } = await profileQuery;

    if (error) {
      throw error;
    }

    const profileWithRelations: IUserWithPhoneAndSocial = data;

    return profileWithRelations;
  }
}

export const profileService = new ProfileService();
